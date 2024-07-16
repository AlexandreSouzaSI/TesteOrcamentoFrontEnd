import { useQuery } from '@tanstack/react-query'
import { DollarSign } from 'lucide-react'

import { getDifference } from '@/api/get-difference'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function MonthRevenueCard() {
  const { data: resultDifference } = useQuery({
    queryKey: ['difference'],
    queryFn: () => getDifference(),
  })
  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base font-semibold">Total (mes)</CardTitle>
        <DollarSign className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent className="space-y-1">
        <span className="text-2xl font-bold tracking-tight">{`R$ ${resultDifference?.toLocaleString(
          'pt-BR',
          {
            style: 'currency',
            currency: 'BRL',
          },
        )}`}</span>
        <p>
          <span className="text-emerald-500 dark:text-emerald-400"> +2% </span>
          em relação ao mês passado
        </p>
      </CardContent>
    </Card>
  )
}
