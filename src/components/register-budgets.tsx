import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { CalendarIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { z } from 'zod'
import { useForm, Controller, useWatch } from 'react-hook-form'

import { getCategory } from '@/api/category/get-category'
import { getProduct } from '@/api/product/get-product'
import { getCosts } from '@/api/costs/get-costs'
import { registerBudgets } from '@/api/budgets/register-budgets'
import { formatValue } from '@/lib/formatValue'
import { cn } from '@/lib/utils'

import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Calendar } from './ui/calendar'
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'

const budgetsBodyForm = z.object({
  name: z.string(),
  valor: z.coerce.number().optional(),
  status: z.string().optional(),
  userId: z.string().optional(),
  dataVencimento: z.date().optional(),
  categoriaId: z.string().optional(),
  produtoId: z.string().optional(),
  custoId: z.string().optional(),
  type: z.string().optional(),
  quantidade: z.coerce.number().optional(),
  valorUnitario: z.coerce.number().optional(),
})

type BudgetsBodySchema = z.infer<typeof budgetsBodyForm>

interface Category {
  id: string
  name: string
  produto: string
}

interface ProductOrCost {
  id: string
  name: string
}

export interface RegisterBudgetsModalProps {
  onClose: () => void
}

export function RegisterBudgetsModal({ onClose }: RegisterBudgetsModalProps) {
  const [categories, setCategories] = useState<Category[]>([])
  const [products, setProducts] = useState<ProductOrCost[]>([])
  const [costs, setCosts] = useState<ProductOrCost[]>([])
  const [type, setType] = useState<'products' | 'costs'>('products')

  const { register, handleSubmit, formState: { isSubmitting }, control, setValue } = useForm<BudgetsBodySchema>()
  const queryClient = useQueryClient()

  const categoriaIdSelecionada = useWatch({ control, name: 'categoriaId' })
  const quantidadeWatch = useWatch({ control, name: 'quantidade' })
  const valorUnitarioWatch = useWatch({ control, name: 'valorUnitario' })

  // Queries
  const { data: result, isLoading: categoriesLoading } = useQuery({
    queryKey: ['category'],
    queryFn: () => getCategory({ pageIndex: 0, name: '' }),
  })

  useEffect(() => {
    if (result) {
      // Filtra categorias pelo tipo
      const filtered = result.categoria.filter(c =>
        type === 'products' ? c.produto === "true" : c.produto === "false"
      )
      setCategories(filtered)
    }
  }, [result, type])

  // Busca produtos ou custos quando categoria ou tipo muda
  useEffect(() => {
    if (!categoriaIdSelecionada) {
      setProducts([])
      setCosts([])
      return
    }

    const categoriaSelecionada = categories.find(c => c.id === categoriaIdSelecionada)
    if (!categoriaSelecionada) {
      setProducts([])
      setCosts([])
      return
    }

    if (type === 'products') {
      getProduct({ categoriaId: categoriaSelecionada.id }).then((res) => {
        setProducts(res.produto.map(p => ({ id: p.id, name: p.name })))
      })
    } else {
      getCosts({ categoriaId: categoriaSelecionada.id }).then((res) => {
        setCosts(res.custo.map(c => ({ id: c.id, name: c.name })))
      })
    }
  }, [categories, categoriaIdSelecionada, type])

  // Calcula valor automaticamente
  useEffect(() => {
    const quantidadeNum = Number(formatValue(quantidadeWatch ?? '0'))
    const valorUnitarioNum = Number(formatValue(valorUnitarioWatch ?? '0'))
    if (quantidadeNum && valorUnitarioNum) {
      setValue('valor', quantidadeNum * valorUnitarioNum)
    }
  }, [quantidadeWatch, valorUnitarioWatch, setValue])

  const { mutateAsync: registerBudgetsFn } = useMutation({
    mutationFn: registerBudgets,
    onSuccess: async () => {
      toast.success('Despesa criada com sucesso')
      await queryClient.invalidateQueries()
      onClose()
    },
    onError: () => {
      toast.error('Falha ao criar uma despesa. Tente novamente.')
    },
  })

  async function handleRegisterBudgets(data: BudgetsBodySchema) {
    const quantidade = data.quantidade ?? 0
    const valorUnitario = data.valorUnitario ?? 0

    const valor: number = data.valor ?? (quantidade * valorUnitario)

    try {
      await registerBudgetsFn({
        ...data,
        name: data.name,
        valor,
        status: data.status,
        dataVencimento: data.dataVencimento ? format(data.dataVencimento, 'yyyy-MM-dd') : undefined,
        categoriaId: data.categoriaId,
        produtoId: type === 'products' ? data.produtoId : undefined,
        custoId: type === 'costs' ? data.custoId : undefined,
        quantidade: formatValue(data.quantidade),
        valorUnitario: formatValue(data.valorUnitario),
      })
    } catch (error) {
      // OnError já trata
    }
  }

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Cadastrar Despesa</DialogTitle>
        <DialogDescription>Painel para adicionar uma despesa</DialogDescription>
      </DialogHeader>

      <form onSubmit={handleSubmit(handleRegisterBudgets)}>
        <div className="space-y-4 py-4">
          {/* Tipo */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Tipo</Label>
            <Controller
              name="type"
              control={control}
              render={({ field: { onChange } }) => (
                <Select
                  value={type}
                  onValueChange={(v) => {
                    const newType = v as 'products' | 'costs'
                    setType(newType)
                    onChange(newType)
                    setValue('produtoId', undefined)
                    setValue('custoId', undefined)
                  }}
                >
                  <SelectTrigger className="col-span-3 w-[342px]">
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="products">Produto</SelectItem>
                    <SelectItem value="costs">Custo</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          {/* Categoria */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Categoria</Label>
            <Controller
              name="categoriaId"
              control={control}
              render={({ field: { onChange, value, disabled } }) => (
                <Select
                  value={value}
                  onValueChange={onChange}
                  disabled={disabled || categoriesLoading}
                >
                  <SelectTrigger className="col-span-3 w-[342px]">
                    <SelectValue placeholder="Selecione uma categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(c => (
                      <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          {/* Produto ou Custo */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">{type === 'products' ? 'Produto' : 'Custo'}</Label>
            <Controller
              name={type === 'products' ? 'produtoId' : 'custoId'}
              control={control}
              render={({ field: { onChange, value, disabled } }) => (
                <Select
                  value={value}
                  onValueChange={(v) => {
                    const item = (type === 'products' ? products : costs).find(i => i.id === v)
                    if (item) setValue('name', item.name)
                    onChange(v)
                  }}
                  disabled={disabled}
                >
                  <SelectTrigger className="col-span-3 w-[342px]">
                    <SelectValue placeholder={`Selecione um ${type === 'products' ? 'produto' : 'custo'}`} />
                  </SelectTrigger>
                  <SelectContent>
                    {(type === 'products' ? products : costs).map(i => (
                      <SelectItem key={i.id} value={i.id}>{i.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          {/* Nome, Valor, Status, Quantidade, Valor Unitário, Data */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Nome</Label>
            <Input {...register('name')} className="col-span-3" />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Valor</Label>
            <Input {...register('valor', { valueAsNumber: true })} className="col-span-3" />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Status</Label>
            <Controller
              name="status"
              control={control}
              render={({ field: { onChange, value, disabled } }) => (
                <Select value={value} onValueChange={onChange} disabled={disabled}>
                  <SelectTrigger className="col-span-3 w-[342px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pendente">Pendente</SelectItem>
                    <SelectItem value="pago">Pago</SelectItem>
                    <SelectItem value="vencido">Vencido</SelectItem>
                    <SelectItem value="hoje">Hoje</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Quantidade</Label>
            <Input {...register('quantidade', { valueAsNumber: true })} className="col-span-3" />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Valor Unitário</Label>
            <Input {...register('valorUnitario', { valueAsNumber: true })} className="col-span-3" />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Data de Vencimento</Label>
            <Controller
              name="dataVencimento"
              control={control}
              render={({ field: { onChange, value } }) => (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className={cn('w-[240px] justify-start text-left font-normal', !value && 'text-muted-foreground')}>
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {value ? format(value, 'PPP', { locale: ptBR }) : 'Escolha uma data'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={value} onSelect={onChange} initialFocus />
                  </PopoverContent>
                </Popover>
              )}
            />
          </div>
        </div>

        <DialogFooter>
          <Button disabled={isSubmitting} variant="green" type="submit">{isSubmitting ? 'Cadastrando...' : 'Cadastrar'}</Button>
          <DialogClose asChild>
            <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
          </DialogClose>
        </DialogFooter>
      </form>
    </DialogContent>
  )
}
