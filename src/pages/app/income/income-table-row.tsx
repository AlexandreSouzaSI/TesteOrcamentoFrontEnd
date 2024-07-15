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
import { editIncome } from "@/api/edit-status-income";

export interface RendaTableRowProps {
    income: {
        id: string;
        name: string;
        data: Date | null;
        valor: number;
        status: 'vencido' | 'pago' | 'normal' | 'pendente';
        createdAt: Date;
        updatedAt: Date | null | undefined;
        userId: string;
    }
}

export function IncomeTableRow({ income }: RendaTableRowProps) {
    const [isDetailsOpen, setIsDetailsOpen] = useState(false)
    const queryClient = useQueryClient()

    const { mutateAsync: deleteIncomeFn} = useMutation({
        mutationFn: deleteIncome,
        onSuccess(_, { incomeId }) {
            const cached = queryClient.getQueriesData<RendaResponse>({
              queryKey: ['income'] 
            });
        
            cached.forEach(([cachedKey, cachedData]) => {
              if (!cachedData) {
                return;
              }
              window.location.reload();
              
              queryClient.setQueryData<RendaResponse>(cachedKey, {
                ...cachedData,
                value: {
                  ...cachedData.value,
                  renda: cachedData.value.renda.filter(renda => renda.id !== incomeId),
                },
              });
            });
          },
        });

    const { mutateAsync: editIncomeFn } = useMutation({
        mutationFn: editIncome,
        onSuccess(_, { incomeId }) {
          const cached = queryClient.getQueriesData<RendaResponse>({
            queryKey: ['budgets'] 
          });
      
          cached.forEach(([cachedKey, cachedData]) => {
            if (!cachedData) {
              return;
            }
            window.location.reload();
            
            queryClient.setQueryData<RendaResponse>(cachedKey, {
              ...cachedData,
              value: {
                ...cachedData.value,
                renda: cachedData.value.renda.map((renda) => {
                    if (renda.id === incomeId) {
                        return { ...renda }
                    }

                    return renda
                })
              },
            });
          });
        },
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
            <TableCell className="font-medium">{income.data ? format((income.data), 'dd/MM/yyyy') : '-'}</TableCell>
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
                <Button variant="ghost" size="xs">
                    <FilePenIcon className="mr-2 h-3 w-3"/>
                    Editar
                </Button>
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