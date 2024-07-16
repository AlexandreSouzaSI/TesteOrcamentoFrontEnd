import { useQuery } from '@tanstack/react-query'
import { HandCoins } from 'lucide-react'

import { getIncome } from '@/api/get-income'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function MonthIncomeCard() {
  const { data: resultIncome } = useQuery({
    queryKey: ['income'],
    queryFn: () => getIncome({}),
  })
  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base font-semibold">
          Total de Renda (mes)
        </CardTitle>
        <HandCoins className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent className="space-y-1">
        <span className="text-2xl font-bold tracking-tight">{`R$ ${resultIncome?.meta.totalValue.toLocaleString(
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
