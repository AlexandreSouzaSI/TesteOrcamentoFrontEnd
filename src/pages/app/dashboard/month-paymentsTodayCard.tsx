import { useQuery } from '@tanstack/react-query'
import { HandCoins } from 'lucide-react'

import { getBudgetsValueSum } from '@/api/get-budgetsValueSum'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function MonthPaymentsTodayCard() {
  const { data: resultBudgets } = useQuery({
    queryKey: ['budgets'],
    queryFn: () => getBudgetsValueSum({ status: 'hoje' }),
  })
  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base font-semibold text-violet-500">
          Pagamentos para hoje
        </CardTitle>
        <HandCoins className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent className="space-y-1">
        <span className="text-2xl font-bold tracking-tight">{`R$ ${resultBudgets?.meta.totalValue.toLocaleString(
          'pt-BR',
          {
            style: 'currency',
            currency: 'BRL',
          },
        )}`}</span>
        <p>
          <span className="text-emerald-500 dark:text-emerald-400"> +10% </span>
          em relação ao mês passado
        </p>
      </CardContent>
    </Card>
  )
}
