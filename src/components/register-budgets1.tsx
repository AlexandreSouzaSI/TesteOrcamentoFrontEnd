import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { CalendarIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { z } from 'zod'

import { getCategory } from '@/api/category/get-category'
import { registerBudgets } from '@/api/budgets/register-budgets'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { cn } from '@/lib/utils'

import { Button } from './ui/button'
import { Calendar } from './ui/calendar'
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog'
import { Input } from './ui/input'
import { Label } from './ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select'
import { getProduct } from '@/api/product/get-product'
import { useForm, Controller, useWatch } from 'react-hook-form';
import { formatValue } from '@/lib/formatValue'
import { getCosts } from '@/api/costs/get-costs'

const budgetsBodyForm = z.object({
  name: z.string(),
  valor: z.coerce.number(),
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

export interface RegisterBudgetsModalProps {
  onClose: () => void
}

export function RegisterBudgetsModal({ onClose }: RegisterBudgetsModalProps) {
  const [categories, setCategories] = useState<{ id: string; name: string, produto: string }[]>([]);
  const [products, setProducts] = useState<{ id: string; name: string }[]>([]);
  const [costs, setCosts] = useState<{ id: string; name: string }[]>([]);
  const [type, setType] = useState<'products' | 'costs'>('costs');

  const { register, handleSubmit, formState: { isSubmitting }, control, watch, setValue } = useForm<BudgetsBodySchema>();
  const queryClient = useQueryClient();

  const categoriaIdSelecionada = useWatch({
    control,
    name: 'categoriaId',
  });

  const { mutateAsync: registerBudgetsFn } = useMutation({
    mutationFn: registerBudgets,
    onSuccess: async () => {
      toast.success('Despesa criada com sucesso');
      await queryClient.invalidateQueries();
      onClose();
    },
    onError: () => {
      toast.error('Falha ao criar uma despesa. Tente novamente.');
    },
  });

  const { data: result, isLoading: categoriesLoading } = useQuery({
    queryKey: ['category'],
    queryFn: () => getCategory({ pageIndex: 0, name: '' }),
  });

  console.log("aqui: ", result)

  useEffect(() => {
    if (result) {
      // Filtra as categorias com base no tipo selecionado (products ou costs)
      const filteredCategories = result.categoria.filter(category => {
        if (type === 'products') {
          return category.produto === "true"; // Apenas categorias de produtos
        } else if (type === 'costs') {
          return category.produto === "false"; // Apenas categorias de custos
        }
        return false; // Caso o tipo não seja reconhecido, retorna vazio
      });

      // Verificação se existem categorias filtradas
      if (filteredCategories.length > 0) {
        setCategories(filteredCategories);
      } else {
        setCategories([]); // Limpa as categorias caso não existam
      }
    }
  }, [result, type]); // Adiciona 'type' como dependência para atualizar a filtragem ao mudar o tipo

  const quantidadeWatch = useWatch({ control, name: 'quantidade' });
  const valorUnitarioWatch = useWatch({ control, name: 'valorUnitario' });

  useEffect(() => {
    const quantidadeNum = Number(formatValue(quantidadeWatch ?? '0'));
    const valorUnitarioNum = Number(formatValue(valorUnitarioWatch ?? '0'));
    if (quantidadeNum && valorUnitarioNum) {
      setValue('valor', quantidadeNum * valorUnitarioNum);
    }
  }, [quantidadeWatch, valorUnitarioWatch]);


  console.log("AQUI: ", categories)

  useEffect(() => {
    if (categories.length > 0) {
      const categoriaSelecionada = categories.find(
        (category) => category.id === categoriaIdSelecionada
      );

      if (categoriaSelecionada) {
        if (type === 'products') {
          getProduct({ categoriaId: categoriaSelecionada.id }).then(
            (produtos) => setProducts(produtos.produto)
          );
        } else if (type === 'costs') {
          getCosts({ categoriaId: categoriaSelecionada.id }).then(
            (custos) => {
              const formattedCosts = custos.custo.map((c) => ({
                id: c.id,
                name: c.name
              }));
              setCosts(formattedCosts);
            }
          );
        }
      } else {
        setProducts([]);
        setCosts([]);
      }
    }
  }, [categories, categoriaIdSelecionada, type]);

  async function handleRegisterBudgets(data: BudgetsBodySchema) {
    const quantidade = formatValue(data.quantidade ?? '0');
    const valorUnitario = formatValue(data.valorUnitario ?? '0');
    let valor = formatValue(data.valor);

    if (quantidade && valorUnitario) {
      valor = quantidade * valorUnitario;
    }


    try {
      await registerBudgetsFn({
        name: data.name,
        valor: valor ? valor : data.valor,
        status: data.status,
        dataVencimento: data.dataVencimento
          ? format(data.dataVencimento, 'yyyy-MM-dd')
          : undefined,
        categoriaId: data.categoriaId,
        produtoId: type === 'products' ? data.produtoId : undefined,
        custoId: type === 'costs' ? data.custoId : undefined,
        quantidade: formatValue(data.quantidade),
        valorUnitario: formatValue(data.valorUnitario),
      });
    } catch (error) {
      // A mensagem de erro já está sendo tratada pelo onError do mutateAsync
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
          <div className="grid grid-cols-4 items-center gap-4">
            {/* Seletor de Tipo */}
            <Label className="text-right" htmlFor="type">
              Tipo
            </Label>
            <Controller
              name="type"
              control={control}
              render={({ field: { onChange, value } }) => (
                <Select
                  onValueChange={(newValue) => {
                    setType(newValue as 'products' | 'costs');
                    onChange(newValue);
                    setValue('produtoId', undefined); // Resetar o produto/custo selecionado ao mudar o tipo
                  }}
                  value={type}
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

            <Label className="text-right" htmlFor="categoria">
              Categoria
            </Label>
            <Controller
              name="categoriaId"
              control={control}
              render={({ field: { name, onChange, value, disabled } }) => (
                <Select
                  name={name}
                  onValueChange={(newValue) => {
                    onChange(newValue);
                    const selectedCategory = categories.find(
                      (category) => category.id === newValue,
                    );
                    if (!selectedCategory) {
                      setProducts([]);
                      setCosts([]);
                    }
                  }}
                  value={value}
                  disabled={disabled || categoriesLoading}
                >
                  <SelectTrigger className="col-span-3 w-[342px]">
                    <SelectValue placeholder="Selecione uma categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />

            <Label className="text-right" htmlFor="produto">
              {type === 'products' ? 'Produto' : 'Custo'}
            </Label>
            <Controller
              name={type === 'products' ? "produtoId" : "custoId"}
              control={control}
              render={({ field: { name, onChange, value, disabled } }) => (
                <Select
                  name={name}
                  onValueChange={(newValue) => {
                    const selectedItem = type === 'products'
                      ? products.find((product) => product.id === newValue)
                      : costs.find((cost) => cost.id === newValue);

                    if (selectedItem) {
                      setValue('name', selectedItem.name); // Atualiza o campo "name" com o nome do produto/custo
                    }

                    onChange(newValue);
                  }}
                  value={value}
                  disabled={disabled || categoriesLoading}
                >
                  <SelectTrigger className="col-span-3 w-[342px]">
                    <SelectValue placeholder={`Selecione um ${type === 'products' ? 'produto' : 'custo'}`} />
                  </SelectTrigger>
                  <SelectContent>
                    {(type === 'products' ? products : costs).map((item) => (
                      <SelectItem key={item.id} value={item.id}>
                        {item.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right" htmlFor="name">
              Nome
            </Label>
            <Input
              id="name"
              {...register('name')}
              className="col-span-3"
              placeholder="Nome"
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right" htmlFor="valor">
              Valor
            </Label>
            <Input
              id="valor"
              {...register('valor', { valueAsNumber: true })}
              className="col-span-3"
              placeholder="Valor"
              onChange={(event) => {
                const value = event.target.value;
                const formattedValue = formatValue(value);
                setValue('valor', formattedValue as unknown as number);
              }}
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right" htmlFor="status">
              Status
            </Label>
            <Controller
              name="status"
              control={control}
              render={({ field: { name, onChange, value, disabled } }) => (
                <Select
                  name={name}
                  onValueChange={onChange}
                  value={value}
                  disabled={disabled}
                >
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
            <Label className="text-right" htmlFor="quantidade">
              Quantidade
            </Label>
            <Input
              id="quantidade"
              {...register('quantidade', { valueAsNumber: true })}
              className="col-span-3"
              placeholder="Quantidade"
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right" htmlFor="valorUnitario">
              Valor Unitário
            </Label>
            <Input
              id="valorUnitario"
              {...register('valorUnitario', { valueAsNumber: true })}
              className="col-span-3"
              placeholder="Valor Unitário"
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right" htmlFor="dataVencimento">
              Data de Vencimento
            </Label>
            <Controller
              control={control}
              name="dataVencimento"
              render={({ field: { onChange, value } }) => (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      id="dataVencimento"
                      variant={'outline'}
                      className={cn(
                        'w-[240px] justify-start text-left font-normal',
                        !value && 'text-muted-foreground',
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {value ? format(value, 'PPP', { locale: ptBR }) : 'Escolha uma data'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={value}
                      onSelect={onChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              )}
            />
          </div>
        </div>

        <DialogFooter>
          <Button disabled={isSubmitting} variant="green" type="submit">
            {isSubmitting ? 'Cadastrando...' : 'Cadastrar'}
          </Button>
          <DialogClose asChild>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
          </DialogClose>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}
