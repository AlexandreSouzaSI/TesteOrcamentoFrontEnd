import { RendaResponse } from "@/api/get-income";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { HandCoins } from "lucide-react";

export function MonthIncomeCard({ value }: RendaResponse) {
    return (
        <Card>
            <CardHeader className="flex-row space-y-0 items-center justify-between pb-2">
                <CardTitle className="text-base font-semibold">
                    Total de Renda (mes)
                </CardTitle>
                <HandCoins className="h-4 w-4 text-muted-foreground"/>
            </CardHeader>
            <CardContent className="space-y-1">
                <span className="text-2xl font-bold tracking-tight">{`R$ ${value.meta.totalValue.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                })}`}</span>
                <p>
                    <span className="text-emerald-500 dark:text-emerald-400"> +10% </span>
                    em relação ao mês passado
                </p>
            </CardContent>
        </Card>
    )
}