import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { DollarSign } from "lucide-react";

export function MonthRevenueCard() {
    return (
        <Card>
            <CardHeader className="flex-row space-y-0 items-center justify-between pb-2">
                <CardTitle className="text-base font-semibold">
                    Total (mes)
                </CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground"/>
            </CardHeader>
            <CardContent className="space-y-1">
                <span className="text-2xl font-bold tracking-tight">R$ 2.000,00</span>
                <p>
                    <span className="text-emerald-500 dark:text-emerald-400"> +2% </span>
                    em relação ao mês passado
                </p>
            </CardContent>
        </Card>
    )
}