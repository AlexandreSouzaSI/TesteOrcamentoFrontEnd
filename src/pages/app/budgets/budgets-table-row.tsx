import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { TableCell, TableRow } from "@/components/ui/table";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { Check, FilePenIcon, Search, Trash2 } from "lucide-react";
import { BusgetsDetails } from "./budgets-details";
import { Status } from "@/components/status";
import { format } from "date-fns";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteBudgets } from "@/api/delete-budgets";
import { DespesaResponse } from "@/api/get-budgets";
import { editBudgets, EditBudgetsParams } from "@/api/edit-budgets";
import { EditBudgetsModal } from "@/components/edit-budgets";

export interface Despesa {
    id: string;
    name: string;
    data: string | null;
    valor: number;
    status: 'vencido' | 'pago' | 'normal' | 'pendente';
    dataVencimento: string | null;
    createdAt: Date;
    updatedAt: Date | null | undefined;
    userId: string;
}

export interface DespesaTableRowProps {
    despesa: Despesa;
}

export function BudgetsTableRow({ despesa }: DespesaTableRowProps) {
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const queryClient = useQueryClient();

    const { mutateAsync: deleteBudgetsFn } = useMutation({
        mutationFn: deleteBudgets,
        onSuccess: (_, { budgetsId }) => {
            queryClient.setQueryData<DespesaResponse>(['budgets'], old => {
                if (!old) return old;
                return {
                    ...old,
                    value: {
                        ...old.value,
                        despesas: old.value.despesas.filter(despesa => despesa.id !== budgetsId)
                    }
                };
            });
        },
    });

    const { mutateAsync: editBudgetsFn } = useMutation({
        mutationFn: editBudgets,
        onSuccess: (_, { budgetsId, status, data, name, valor, dataVencimento }) => {
            queryClient.setQueryData<EditBudgetsParams>(['budgets'], old => {
                if (!old) return old;
                return {
                    ...old,
                    value: {
                        ...old,
                        budgetsId,
                        name,
                        valor,
                        status,
                        dataVencimento,
                        data
                    }
                };
            });
        },
    });

    return (
        <>
            <TableRow key={despesa.id}>
                <TableCell>
                    <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
                        <DialogTrigger asChild>
                            <Button variant="outline" size="xs">
                                <Search className="h-3 w-3" />
                                <span className="sr-only">Detalhes do orçamento</span>
                            </Button>
                        </DialogTrigger>
                        <BusgetsDetails open={isDetailsOpen} budgetsId={despesa.id} />
                    </Dialog>
                </TableCell>
                <TableCell className="font-medium">{despesa.name}</TableCell>
                <TableCell className="font-medium">{`R$ ${despesa.valor.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                })}`}</TableCell>
                <TableCell className="font-medium">{despesa.dataVencimento ? format(new Date(despesa.dataVencimento), 'dd/MM/yyyy') : '-'}</TableCell>
                <TableCell>
                    <div className="flex items-center gap-2">
                        <span className="font-medium text-muted-foreground">
                            <Status status={despesa.status ? despesa.status : 'pendente'} />
                        </span>
                    </div>
                </TableCell>
                <TableCell>
                    <Button onClick={() => editBudgetsFn({ budgetsId: despesa.id, status: 'pago' })} variant="ghost" size="xs">
                        <Check className="mr-2 h-3 w-3 fill-green-500"/>
                        Informar pagamento
                    </Button>
                </TableCell>
                <TableCell>
                    <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                        <DialogTrigger asChild>
                            <Button onClick={() => setIsEditOpen} variant="ghost" size="xs">
                                <FilePenIcon className="mr-2 h-3 w-3"/>
                                Editar
                            </Button>
                        </DialogTrigger>
                        <EditBudgetsModal onClose={() => setIsEditOpen(false)} open={isEditOpen} budgetsId={despesa.id}/>
                    </Dialog>
                </TableCell>
                <TableCell>
                    <Button onClick={() => deleteBudgetsFn({ budgetsId: despesa.id })} disabled={!['vencido', 'normal', 'pendente'].includes(despesa.status)} variant="ghost" size="xs">
                        <Trash2 className="mr-2 h-3 w-3 fill-red-400"/>
                        Excluir
                    </Button>
                </TableCell>
            </TableRow>
        </>
    );
}
