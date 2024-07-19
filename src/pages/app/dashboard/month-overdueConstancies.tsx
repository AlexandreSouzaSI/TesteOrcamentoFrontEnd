import { useQuery } from '@tanstack/react-query'
import { HandCoins } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import { getBudgetsValueSumStatus } from '@/api/get-budgetsValueSumStatus'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function MonthOverdueConstanciesCard() {
  const { data: resultBudgets } = useQuery({
    queryKey: ['budgets', { status: 'vencido' }],
    queryFn: () => getBudgetsValueSumStatus({ status: 'vencido' }),
  })

  const navigate = useNavigate()

  const handleCardClick = () => {
    navigate(`/budgets?status=${'vencido'}`)
  }

  const despesa = resultBudgets || 0
  const formattedDespesa = despesa.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })

  return (
    <Card onClick={handleCardClick} className="cursor-pointer">
      <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base font-semibold text-rose-500">
          Despesas Vencidas (mes)
        </CardTitle>
        <HandCoins className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent className="space-y-1">
        <span className="text-2xl font-bold tracking-tight">
          {formattedDespesa}
        </span>
        <p>
          <span className="text-emerald-500 dark:text-emerald-400"> +10% </span>
          em relação ao mês passado
        </p>
      </CardContent>
    </Card>
  )
}
