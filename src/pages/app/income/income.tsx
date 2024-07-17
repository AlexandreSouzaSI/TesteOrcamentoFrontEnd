import { useQuery } from '@tanstack/react-query'
import { Helmet } from 'react-helmet-async'
import { useSearchParams } from 'react-router-dom'
import { z } from 'zod'

import { getIncome } from '@/api/get-income'
import { Pagination } from '@/components/pagination'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

import { IncomeTableFilters } from './income-table-filters'
import { IncomeTableRow } from './income-table-row'

export function Income() {
  const [searchParams, setSearchParams] = useSearchParams()

  const name = searchParams.get('name')
  const status = searchParams.get('status')

  const pageIndex = z.coerce
    .number()
    .transform((pageIndex) => pageIndex - 1)
    .parse(searchParams.get('pageIndex') ?? '1')

  const { data: result, isLoading: isLoadingIncome } = useQuery({
    queryKey: ['income', pageIndex, name, status],
    queryFn: () => getIncome({ pageIndex, name, status }),
  })

  if (isLoadingIncome) {
    return <div>Loading...</div>
  }

  function handlePaginate(pageIndex: number) {
    setSearchParams((prev) => {
      prev.set('pageIndex', (pageIndex + 1).toString())
      return prev
    })
  }

  return (
    <>
      <Helmet title="Renda" />
      <div className="flex flex-col gap-4 p-10">
        <h1 className="text-3xl font-bold tracking-tight">Renda</h1>
        <div className="space-y-2.5">
          <IncomeTableFilters />
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[64px]"></TableHead>
                  <TableHead>Nome</TableHead>
                  <TableHead className="w-[240px]">Valor</TableHead>
                  <TableHead className="w-[240px]">Data</TableHead>
                  <TableHead className="w-[140px]">Status</TableHead>
                  <TableHead className="w-[164px]"></TableHead>
                  <TableHead className="w-[132px]"></TableHead>
                  <TableHead className="w-[132px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {result?.renda && result.renda.length > 0 ? (
                  result.renda.map((income) => (
                    <IncomeTableRow key={income.id} income={income} />
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="py-4 text-center">
                      Nenhuma renda encontrada.
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
    </>
  )
}
