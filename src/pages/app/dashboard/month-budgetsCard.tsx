import { useQuery } from '@tanstack/react-query'
import { NotebookPen } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import { getBudgetsValueSum } from '@/api/get-budgetsValueSum'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function MonthBudgetsCard() {
  const { data: result } = useQuery({
    queryKey: ['budgets'],
    queryFn: () => getBudgetsValueSum({}),
  })

  const navigate = useNavigate()

  const handleCardClick = () => {
    navigate(`/budgets`)
  }

  return (
    <Card onClick={handleCardClick} className="cursor-pointer">
      <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base font-semibold">
          Total de Desesas (mes)
        </CardTitle>
        <NotebookPen className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent className="space-y-1">
        <span className="text-2xl font-bold tracking-tight">{`R$ ${result?.meta.totalValue.toLocaleString(
          'pt-BR',
          {
            style: 'currency',
            currency: 'BRL',
          },
        )}`}</span>
        <p>
          <span className="text-rose-500 dark:text-rose-400"> -5% </span>
          em relação ao mês passado
        </p>
      </CardContent>
    </Card>
  )
}
