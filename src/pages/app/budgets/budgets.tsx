import { useQuery } from '@tanstack/react-query'
import { Helmet } from 'react-helmet-async'
import { useSearchParams } from 'react-router-dom'
import { z } from 'zod'

import { getBudgets } from '@/api/budgets/get-budgets'
import { Pagination } from '@/components/pagination'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

import { BudgetsTableFilters } from './budgets-table-filters'
import { BudgetsTableRow } from './budgets-table-row'

export function Budgets() {
  const [searchParams, setSearchParams] = useSearchParams()

  const name = searchParams.get('name')
  const status = searchParams.get('status')

  const pageIndex = z.coerce
    .number()
    .transform((pageIndex) => pageIndex - 1)
    .parse(searchParams.get('pageIndex') ?? '1')

  const { data: result } = useQuery({
    queryKey: ['budgets', pageIndex, name, status],
    queryFn: () => getBudgets({ pageIndex, name, status }),
  })

  function handlePaginate(pageIndex: number) {
    setSearchParams((prev) => {
      prev.set('pageIndex', (pageIndex + 1).toString())
      return prev
    })
  }

  return (
    <div>
      <Helmet title="Orçamentos" />
      <div className="flex flex-col gap-4 p-10">
        <h1 className="text-3xl font-bold tracking-tight">Custos</h1>
        <div className="space-y-2.5">
          <BudgetsTableFilters />
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[64px]"></TableHead>
                  <TableHead className="w-[264px]">Nome</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Quantidade</TableHead>
                  <TableHead>Valor Unitario</TableHead>
                  <TableHead className="w-[240px]">Valor</TableHead>
                  <TableHead className="w-[240px]">
                    Data de Vencimento
                  </TableHead>
                  <TableHead className="w-[140px]">Status</TableHead>
                  <TableHead className="w-[164px]"></TableHead>
                  <TableHead className="w-[132px]"></TableHead>
                  <TableHead className="w-[132px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {result?.despesas && result.despesas.length > 0 ? (
                  result.despesas.map((despesa) => (
                    <BudgetsTableRow key={despesa.id} despesa={despesa} />
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="py-4 text-center">
                      Nenhuma despesa encontrada.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          {result && (
            <Pagination
              pageIndex={result.meta.pageIndex}
              totalCount={result.meta.totalCount}
              perPage={result.meta.perPage}
              onPageChange={handlePaginate}
            />
          )}
        </div>
      </div>
    </div>
  )
}
