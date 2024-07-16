import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { NotebookPen } from "lucide-react";
import { getBudgets } from "@/api/get-budgets";
import { useQuery } from "@tanstack/react-query";

export function MonthBudgetsCard() {
    const { data: result, isLoading: isLoadingBudgets } = useQuery({
        queryKey: ['budgets'],
        queryFn: () => getBudgets({})
    });
    return (
        <Card>
            <CardHeader className="flex-row space-y-0 items-center justify-between pb-2">
                <CardTitle className="text-base font-semibold">
                    Total de Desesas (mes)
                </CardTitle>
                <NotebookPen className="h-4 w-4 text-muted-foreground"/>
            </CardHeader>
            <CardContent className="space-y-1">
                <span className="text-2xl font-bold tracking-tight">{`R$ ${result?.meta.totalValue.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                })}`}</span>
                <p>
                    <span className="text-rose-500 dark:text-rose-400"> -5% </span>
                    em relação ao mês passado
                </p>
            </CardContent>
        </Card>
    )
}