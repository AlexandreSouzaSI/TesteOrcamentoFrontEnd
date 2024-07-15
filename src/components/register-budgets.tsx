import { useMutation } from "@tanstack/react-query";
import { Button } from "./ui/button";
import { DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { registerBudgets } from "@/api/register-budgets";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

const budgetsBodyForm = z.object({
    name: z.string(),
    valor: z.coerce.number(),
    status: z.string().optional(),
    dataVencimento: z.date().optional(),
    userId: z.string()
})

type BudgetsBodySchema = z.infer<typeof budgetsBodyForm>

export function RegisterBudgetsModal() {
    const { register, handleSubmit, formState: {isSubmitting}, control } = useForm<BudgetsBodySchema>()

    const { mutateAsync: registerBudgetsFn } = useMutation({
        mutationFn: registerBudgets
    })

    async function handleRegisterBudgets(data: BudgetsBodySchema) {
        console.log("aqui: ", data)
        try {
            await registerBudgetsFn({
                name: data.name,
                valor: data.valor,
                status: data.status,
                dataVencimento: data.dataVencimento,
            })

            toast.success('Despesa Criada com sucesso')
        } catch (error) {
            toast.error('Falha ao criar despesa tente novamente')
        }
    }

    return (
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Cadastrar Despesa</DialogTitle>
                <DialogDescription>
                    Painel para adicionar uma despesa
                </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit(handleRegisterBudgets)}>
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

                        <Label className="text-right" htmlFor="date">
                            Data do Vencimento
                        </Label>
                        <Input type="date" className="col-span-3" id="dataVencimento" {...register('dataVencimento')}/>
                        
                        <Label className="text-right" htmlFor="status">
                            Status
                        </Label>
                        <Controller 
                        name="status"
                        control={control}
                        render={({ field: { name, onChange, value, disabled} }) => {
                            return (
                                <Select
                                    defaultValue="all"
                                    name={name}
                                    onValueChange={onChange}
                                    value={value}
                                    disabled={disabled}
                                >
                                    <SelectTrigger className="w-[342px]">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="pendente">pendente</SelectItem>
                                        <SelectItem value="pago">Pago</SelectItem>
                                        <SelectItem value="vencido">Vencido</SelectItem>
                                    </SelectContent>
                                </Select>
                            )
                        }}
                    />
                    </div>
                </div>

                <DialogFooter>
                    <DialogClose asChild>
                        <Button 
                            variant="ghost"
                            type="button">
                                Cancelar
                        </Button>
                    </DialogClose>
                    <Button type="submit" variant="green" disabled={isSubmitting}>Salvar</Button>
                </DialogFooter>
            </form>
        </DialogContent>
    )
}