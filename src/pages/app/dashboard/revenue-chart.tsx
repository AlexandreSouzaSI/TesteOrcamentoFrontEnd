import { useQuery } from '@tanstack/react-query'
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from 'recharts'
import colors from 'tailwindcss/colors'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'

import { getIncomeValueSum } from '@/api/income/get-income-valueSum'
import { getBudgetsValueSum } from '@/api/budgets/get-budgetsValueSum'

export function RevenueChart() {
  const { data: incomeResult } = useQuery({
    queryKey: ['income'],
    queryFn: () => getIncomeValueSum({}),
  })

  const { data: budgetsResult } = useQuery({
    queryKey: ['budgets'],
    queryFn: () => getBudgetsValueSum({}),
  })

  if (!incomeResult || !budgetsResult) {
    return <Card className="col-span-6 p-4">Carregando dados...</Card>
  }

  // Total acumulado do backend
  const incomeTotal = incomeResult.meta.totalValue
  const budgetsTotal = budgetsResult.meta.totalValue
  const differenceTotal = incomeTotal - budgetsTotal

  // Número de pontos para suavizar a linha
  const points = 10

  // Cria pontos intermediários para o gráfico
  const chartData = Array.from({ length: points + 1 }, (_, i) => {
    const factor = i / points
    return {
      date: `Dia ${i + 1}`,
      income: incomeTotal * factor,
      budgets: budgetsTotal * factor,
      difference: differenceTotal * factor,
    }
  })

  return (
    <Card className="col-span-6">
      <CardHeader className="flex-row items-center justify-between pb-8">
        <div className="space-y-1">
          <CardTitle className="text-base font-medium">Total no Período</CardTitle>
          <CardDescription>Total diário acumulado</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={240}>
          <LineChart data={chartData} style={{ fontSize: 12 }}>
            <XAxis dataKey="date" tickLine={false} axisLine={false} dy={16} />
            <YAxis
              stroke="#888"
              axisLine={false}
              tickLine={false}
              width={88}
              tickFormatter={(value: number) =>
                value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
              }
            />
            <CartesianGrid vertical={false} className="stroke-muted" />
            <Tooltip
              formatter={(value: number) =>
                value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
              }
            />
            <Legend verticalAlign="top" height={36} />
            <Line
              type="linear"
              dataKey="income"
              stroke={colors.violet[500]}
              strokeWidth={2}
              dot={{ r: 2 }}
              name="Renda"
            />
            <Line
              type="linear"
              dataKey="budgets"
              stroke={colors.red[500]}
              strokeWidth={2}
              dot={{ r: 2 }}
              name="Despesas"
            />
            <Line
              type="linear"
              dataKey="difference"
              stroke={colors.emerald[500]}
              strokeWidth={2}
              dot={{ r: 2 }}
              name="Diferença"
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
