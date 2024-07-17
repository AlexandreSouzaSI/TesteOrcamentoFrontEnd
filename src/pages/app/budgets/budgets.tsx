import { useQuery } from '@tanstack/react-query'
import { Helmet } from 'react-helmet-async'
import { useSearchParams } from 'react-router-dom'
import { z } from 'zod'

import { getBudgets } from '@/api/get-budgets'
import { Pagination } from '@/components/pagination'
import {
  Table,
  TableBody,
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

  const { data: result, isLoading: isLoadingBudgets } = useQuery({
    queryKey: ['budgets', pageIndex, name, status],
    queryFn: () => getBudgets({ pageIndex, name, status }),
  })

  if (isLoadingBudgets) {
    return <div>Loading...</div>
  }

  if (!result?.despesas || result.despesas.length === 0) {
    return <div></div>
  }

  function handlePaginate(pageIndex: number) {
    setSearchParams((prev) => {
      prev.set('pageIndex', (pageIndex + 1).toString())

      return prev
    })
  }
  return (
    <>
      <Helmet title="Orçamentos" />
      <div className="flex flex-col gap-4 p-10">
        <h1 className="text-3xl font-bold tracking-tight">Orçamentos</h1>
        <div className="space-y-2.5">
          <BudgetsTableFilters />
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[64px]"></TableHead>
                  <TableHead>Nome</TableHead>
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
                {result &&
                  result.despesas.map((despesa) => {
                    return (
                      <BudgetsTableRow key={despesa.id} despesa={despesa} />
                    )
                  })}
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
    </>
  )
}
