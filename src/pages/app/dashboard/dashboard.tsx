import { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

import { MonthBudgetsCard } from './month-budgetsCard'
import { MonthIncomeCard } from './month-IncomeCard'
import { MonthOverdueConstanciesCard } from './month-overdueConstancies'
import { MonthPaymentsTodayCard } from './month-paymentsTodayCard'
import { MonthRevenueCard } from './month-revenueCard'
import { PopularBudgetsChart } from './popular-budgets-chart'
import { RevenueChart } from './revenue-chart'

export function Dashboard() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const hideModal = localStorage.getItem('hideDashboardIntro')
    if (!hideModal) {
      setOpen(true)
    }
  }, [])

  function handleClose() {
    setOpen(false)
  }

  function handleDontShowAgain() {
    localStorage.setItem('hideDashboardIntro', 'true')
    setOpen(false)
  }

  return (
    <>
      <Helmet title="Dashboard" />

      {/* Modal explicativo */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Bem-vindo ao sistema 🎉</DialogTitle>
            <DialogDescription>
              Aqui você acompanha suas receitas, despesas e relatórios em tempo real.
              <br />
              ➝ No topo, você encontra os cards resumidos do mês: total de receitas, total de despesas e a diferença entre eles.
              <br />
              ➝ Logo abaixo, estão os gráficos de desempenho.
              <br />
              ➝ Ao final, você verá as constâncias, os pagamentos do dia e as contas vencidas.
              <br />
              <br />
              ➝ Na parte superior, no menu de navegação, você tem acesso a: Custos, Receitas, Categorias, Despesas e Estoque.
              <br />
              ➝ <strong>Categorias:</strong> Crie categorias, por exemplo: Imposto, Produto para Revenda, Carro, Salário.
              <br />
              ➝ <strong>Despesas:</strong> Registre uma despesa, por exemplo: Simples, Coca-Cola, Manutenção.
              <br />
              ➝ <strong>Custos:</strong> Após criar categorias e despesas, você pode cadastrar um custo. Basta escolher a despesa já criada e informar o valor e a data de vencimento.
              <br />
              ➝ <strong>Receitas:</strong> Após criar uma categoria, você poderá cadastrar uma receita com nome, valor, data e categoria. Exemplo: Salário.
            </DialogDescription>

          </DialogHeader>

          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={handleDontShowAgain}>
              Não mostrar novamente
            </Button>
            <Button onClick={handleClose}>Entendi</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Conteúdo da página */}
      <div className="flex flex-col gap-4 p-10">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>

        <div className="grid grid-cols-3 gap-4">
          <MonthIncomeCard />
          <MonthBudgetsCard />
          <MonthRevenueCard />
        </div>
        <div className="grid grid-cols-9 gap-4">
          <RevenueChart />
          <PopularBudgetsChart />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <MonthPaymentsTodayCard />
          <MonthOverdueConstanciesCard />
        </div>
      </div>
    </>
  )
}
