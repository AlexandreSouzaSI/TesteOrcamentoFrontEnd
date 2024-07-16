import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "./ui/button";
import { DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { editBudgets } from "@/api/edit-budgets";
import { zodResolver } from "@hookform/resolvers/zod";
import { getBudgetsDetails } from "@/api/get-budgets-details";

interface budgetsBodyResponse {
    budgetsId: string
    name?: string,
    data?: string,
    valor?: number, 
    status?: string,
    dataVencimento?: string,
}

const budgetsBodyForm = z.object({
    budgetsId: z.string(),
    name: z.string().optional(),
    data: z.string().optional(),
    valor: z.coerce.number().optional(),
    status: z.string().optional(),
    dataVencimento: z.string().optional(),
})

type BudgetsBodySchema = z.infer<typeof budgetsBodyForm>

export interface BudgetsDetailsProps {
    budgetsId: string
    open: boolean
    onClose: () => void
}

export function EditBudgetsModal({budgetsId, open, onClose}: BudgetsDetailsProps) {
    const queryClient = useQueryClient()
    const {data: result} = useQuery({
        queryKey: ['budgets', budgetsId],
        queryFn: () => getBudgetsDetails({ budgetsId }),
        enabled: open
    })

    if (!result) {
        return null
    }

    const { register, handleSubmit, formState: { isSubmitting }, control } = useForm<BudgetsBodySchema>({
        resolver: zodResolver(budgetsBodyForm),
        defaultValues: {
            budgetsId: result.id,
            name: result.name ?? '',
            data: result.data ?? '',
            valor: result.valor ?? '',
            status: result.status ?? '',
            dataVencimento: result.dataVencimento ?? '',
        }
    })

    const { mutateAsync: updateBudgetsFn } = useMutation({
        mutationFn: editBudgets,
        onSuccess: async () => {
            toast.success('Despesa atualizada com sucesso');
            onClose()
            await queryClient.invalidateQueries(['budgets', { budgetsId }]);
        },
        onError: () => {
            toast.error('Falha ao atualizar a despesa. Tente novamente.');
        }
    })

    async function handleUpdateBudgets(data: BudgetsBodySchema) {
        try {
            await updateBudgetsFn({
                budgetsId: data.budgetsId,
                name: data.name,
                valor: data.valor,
                data: data.data,
                status: data.status,
                dataVencimento: data.dataVencimento
            })
        } catch (error) {
            toast.error('Falha ao atualizar a despesa. Tente novamente.');
        }
    }

    return (
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Editar Despesa</DialogTitle>
                <DialogDescription>
                    Painel para editar uma despesa
                </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit(handleUpdateBudgets)}>
                <div className="space-y-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label className="text-right" htmlFor="name">
                            Nome
                        </Label>
                        <Input className="col-span-3" id="name" {...register('name')}/>
                        
                        <Label className="text-right" htmlFor="valor">
                            Valor
                        </Label>
                        <Input className="col-span-3" id="valor" {...register('valor')}/>

                       {/*  <Label className="text-right" htmlFor="date">
                            Data do Vencimento
                        </Label>
                        <Input type="date" className="col-span-3" id="dataVencimento" {...register('dataVencimento')}/> */}
                        
                        <Label className="text-right" htmlFor="status">
                            Status
                        </Label>
                        <Controller 
                            name="status"
                            control={control}
                            render={({ field: { name, onChange, value, disabled} }) => (
                                <Select
                                    defaultValue="pendente"
                                    name={name}
                                    onValueChange={onChange}
                                    value={value}
                                    disabled={disabled}
                                >
                                    <SelectTrigger className="w-[342px]">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="pendente">Pendente</SelectItem>
                                        <SelectItem value="pago">Pago</SelectItem>
                                        <SelectItem value="vencido">Vencido</SelectItem>
                                    </SelectContent>
                                </Select>
                            )}
                        />
                    </div>
                </div>

                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="ghost" type="button">
                            Cancelar
                        </Button>
                    </DialogClose>
                    <Button type="submit" variant="green" disabled={isSubmitting}>
                        Salvar
                    </Button>
                </DialogFooter>
            </form>
        </DialogContent>
    )
}
