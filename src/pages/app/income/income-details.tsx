import { DialogContent, DialogDescription, DialogHeader } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { DialogTitle } from "@radix-ui/react-dialog";

export function IncomeDetails() {
    return (
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Renda: 02137982137</DialogTitle>
                <DialogDescription>Detalhes da renda</DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
                <Table>
                    <TableBody>
                        <TableRow>
                            <TableCell className="text-muted-foreground">Status</TableCell>
                            <TableCell className="flex justify-end">
                            <div className="flex items-center gap-2">
                                <span className="h-2 w-2 rounded-full bg-slate-400"/>
                                <span className="font-medium text-muted-foreground">Pendente</span>
                            </div>
                            </TableCell>
                        </TableRow>

                        <TableRow>
                            <TableCell className="text-muted-foreground">Nome</TableCell>
                            <TableCell className="flex justify-end">
                                Aluguel
                            </TableCell>
                        </TableRow>

                        <TableRow>
                            <TableCell className="text-muted-foreground">Valor</TableCell>
                            <TableCell className="flex justify-end">
                                R$ 1.000
                            </TableCell>
                        </TableRow>

                        <TableRow>
                            <TableCell className="text-muted-foreground">Data</TableCell>
                            <TableCell className="flex justify-end">
                                30/07/2024
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </div>
        </DialogContent>
    )
}