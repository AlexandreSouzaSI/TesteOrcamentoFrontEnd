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
import { editBudgets } from "@/api/edit-status-budgets";

export interface DespesaTableRowProps {
    despesa: {
        id: string;
        name: string;
        data: Date | null;
        valor: number;
        status: 'vencido' | 'pago' | 'normal' | 'pendente';
        dataVencimento: Date | null;
        createdAt: Date;
        updatedAt: Date | null | undefined;
        userId: string;
    }
}

export function BudgetsTableRow({ despesa }: DespesaTableRowProps) {
    const [isDetailsOpen, setIsDetailsOpen] = useState(false)
    const queryClient = useQueryClient()

    const { mutateAsync: deleteBudgetsFn } = useMutation({
        mutationFn: deleteBudgets,
        onSuccess(_, { budgetsId }) {
          const cached = queryClient.getQueriesData<DespesaResponse>({
            queryKey: ['budgets'] 
          });
      
          cached.forEach(([cachedKey, cachedData]) => {
            if (!cachedData) {
              return;
            }
            window.location.reload();
            
            queryClient.setQueryData<DespesaResponse>(cachedKey, {
              ...cachedData,
              value: {
                ...cachedData.value,
                despesas: cachedData.value.despesas.filter(despesa => despesa.id !== budgetsId),
              },
            });
          });
        },
      });

    const { mutateAsync: editBudgetsFn } = useMutation({
        mutationFn: editBudgets,
        onSuccess(_, { budgetsId }) {
          const cached = queryClient.getQueriesData<DespesaResponse>({
            queryKey: ['budgets'] 
          });
      
          cached.forEach(([cachedKey, cachedData]) => {
            if (!cachedData) {
              return;
            }
            window.location.reload();
            
            queryClient.setQueryData<DespesaResponse>(cachedKey, {
              ...cachedData,
              value: {
                ...cachedData.value,
                despesas: cachedData.value.despesas.map((despesa) => {
                    if (despesa.id === budgetsId) {
                        return { ...despesa }
                    }

                    return despesa
                })
              },
            });
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
                {/* <TableCell className="font-mono text-xs font-medium">{budget.id}</TableCell> */}
                <TableCell className="font-medium">{despesa.name}</TableCell>
                <TableCell className="font-medium">{`R$ ${despesa.valor.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                })}`}</TableCell>
                <TableCell className="font-medium">{despesa.dataVencimento ? format((despesa.dataVencimento), 'dd/MM/yyyy') : '-'}</TableCell>
                <TableCell>
                    <div className="flex items-center gap-2">
                        <span className="font-medium text-muted-foreground">
                            <Status status={despesa.status ? despesa.status : 'pendente'} />
                        </span>
                    </div>
                </TableCell>
                <TableCell>
                    <Button onClick={() => editBudgetsFn({ budgetsId: despesa.id })} variant="ghost" size="xs">
                        <Check className="mr-2 h-3 w-3 fill-green-500"/>
                        Informar pagamento
                    </Button>
                </TableCell>
                <TableCell>
                    <Button variant="ghost" size="xs">
                        <FilePenIcon className="mr-2 h-3 w-3"/>
                        Editar
                    </Button>
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
