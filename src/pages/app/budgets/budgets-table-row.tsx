import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { TableCell, TableRow } from "@/components/ui/table";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { FilePenIcon, Search, Trash2 } from "lucide-react";
import { BusgetsDetails } from "./budgets-details";

export function BudgetsTableRow() {
    return (
        <TableRow>
            <TableCell>
                <Dialog>
                    <DialogTrigger asChild>
                        <Button variant="outline" size="xs">
                            <Search className="h-3 w-3" />
                            <span className="sr-only">Detalhes do orçamento</span>
                        </Button>
                    </DialogTrigger>
                    <BusgetsDetails />
                </Dialog>
            </TableCell>
            <TableCell className="font-mono text-xs font-medium">2198372189ehwhd</TableCell>
            <TableCell className="font-medium">Aluguel</TableCell>
            <TableCell className="font-medium">R$ 1.000</TableCell>
            <TableCell className="font-medium">30/07/2024</TableCell>
            <TableCell>
                <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-slate-400"/>
                    <span className="font-medium text-muted-foreground">Pendente</span>
                </div>
            </TableCell>
            <TableCell>
                <Button variant="ghost" size="xs">
                    <FilePenIcon className="mr-2 h-3 w-3"/>
                    Editar
                </Button>
            </TableCell>
            <TableCell>
                <Button variant="ghost" size="xs">
                    <Trash2 className="mr-2 h-3 w-3 fill-red-400"/>
                    Excluir
                </Button>
            </TableCell>
        </TableRow>
    )
}