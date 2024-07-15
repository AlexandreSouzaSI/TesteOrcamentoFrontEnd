import { useMutation } from "@tanstack/react-query";
import { Button } from "./ui/button";
import { DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { registerIncome } from "@/api/register-income";

const incomeBodyForm = z.object({
    name: z.string(),
    valor: z.coerce.number(),
    status: z.string(),
})

type IncomeBodySchema = z.infer<typeof incomeBodyForm>

export function RegisterIncomeModal() {
    const { register, handleSubmit, formState: {isSubmitting}, control } = useForm<IncomeBodySchema>()

    const { mutateAsync: registerIncomeFn } = useMutation({
        mutationFn: registerIncome
    })

    async function handleRegisterIncome(data: IncomeBodySchema) {
        try {
            await registerIncomeFn({
                name: data.name,
                valor: data.valor,
                status: data.status, 
            })

            toast.success('Renda Criada com sucesso')
        } catch (error) {
            toast.error('Falha ao criar renda tente novamente')
        }
    }

    return (
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Cadastrar Renda</DialogTitle>
                <DialogDescription>
                    Painel para adicionar uma renda
                </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit(handleRegisterIncome)}>
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

                        {/* <Label className="text-right" htmlFor="date">
                            Data
                        </Label>
                        <Input type="date" className="col-span-3" id="dataVencimento" {...register('data')}/> */}
                        
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