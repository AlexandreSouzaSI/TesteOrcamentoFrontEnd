import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { TableCell, TableRow } from "@/components/ui/table";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { Check, FilePenIcon, Search, Trash2 } from "lucide-react";
import { IncomeDetails } from "./income-details";
import { Status } from "@/components/status";
import { format } from 'date-fns';
import { useState } from "react";
import { deleteIncome } from "@/api/delete-income";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { RendaResponse } from "@/api/get-income";
import { editIncome, EditIncomeParams } from "@/api/edit-income";
import { EditIncomeModal } from "@/components/edit-income";
import { toast } from "sonner";

export interface Renda {
        id: string;
        name: string;
        data: string | null;
        valor: number;
        status: 'vencido' | 'pago' | 'normal' | 'pendente';
        createdAt: Date;
        updatedAt: Date | null | undefined;
        userId: string;
}

export interface RendaTableRowProps {
  income: Renda;
}

export function IncomeTableRow({ income  }: RendaTableRowProps) {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const queryClient = useQueryClient()

    const { mutateAsync: deleteIncomeFn } = useMutation({
      mutationFn: deleteIncome,
      onSuccess: (_, { incomeId }) => {
        queryClient.invalidateQueries(['incomeId']);
        toast.success('Renda excluída com sucesso.');
    },
    onError: () => {
        toast.error('Falha ao excluir a renda. Tente novamente.');
    }
});

  const { mutateAsync: editIncomeFn } = useMutation({
      mutationFn: editIncome,
      onSuccess: () => {
        queryClient.invalidateQueries(['incomeId']);
        toast.success('Renda editada com sucesso.');
    },
    onError: () => {
        toast.error('Falha ao editar a renda. Tente novamente.');
    }
});

    return (
        <>
            <TableRow key={income.id}>
            <TableCell>
                <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
                    <DialogTrigger asChild>
                        <Button variant="outline" size="xs">
                            <Search className="h-3 w-3" />
                            <span className="sr-only">Detalhes da renda</span>
                        </Button>
                    </DialogTrigger>
                    <IncomeDetails open={isDetailsOpen} incomeId={income.id}/>
                </Dialog>
            </TableCell>
            <TableCell className="font-medium">{income.name}</TableCell>
            <TableCell className="font-medium">{`R$ ${income.valor.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                })}`}</TableCell>
            <TableCell>
                <div className="flex items-center gap-2">
                    <span className="font-medium text-muted-foreground">
                            <Status status={income.status ? income.status : 'vencido'} />
                    </span>
                </div>
            </TableCell>
            <TableCell>
                <Button onClick={() => editIncomeFn({ incomeId: income.id })} variant="ghost" size="xs">
                    <Check className="mr-2 h-3 w-3 fill-green-500"/>
                    Informar recebimento
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
                        <EditIncomeModal onClose={() => setIsEditOpen(false)} open={isEditOpen} incomeId={income.id}/>
                    </Dialog>
            </TableCell>
            <TableCell>
                <Button onClick={() => deleteIncomeFn({ incomeId: income.id })} disabled={!['vencido', 'normal', 'pendente'].includes(income.status)} variant="ghost" size="xs">
                    <Trash2 className="mr-2 h-3 w-3 fill-red-400"/>
                    Excluir
                </Button>
            </TableCell>
        </TableRow>
    </>
    )
}