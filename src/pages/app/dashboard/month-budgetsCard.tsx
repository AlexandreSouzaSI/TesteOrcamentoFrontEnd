import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { NotebookPen } from "lucide-react";

export function MonthBudgetsCard() {
    return (
        <Card>
            <CardHeader className="flex-row space-y-0 items-center justify-between pb-2">
                <CardTitle className="text-base font-semibold">
                    Total de Desesas (mes)
                </CardTitle>
                <NotebookPen className="h-4 w-4 text-muted-foreground"/>
            </CardHeader>
            <CardContent className="space-y-1">
                <span className="text-2xl font-bold tracking-tight">R$ 230,00</span>
                <p>
                    <span className="text-rose-500 dark:text-rose-400"> -5% </span>
                    em relação ao mês passado
                </p>
            </CardContent>
        </Card>
    )
}