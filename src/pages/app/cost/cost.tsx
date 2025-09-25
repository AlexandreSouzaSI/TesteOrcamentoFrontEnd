import { useQuery } from '@tanstack/react-query'
import { Helmet } from 'react-helmet-async'
import { useSearchParams } from 'react-router-dom'
import { z } from 'zod'

import { getCosts } from '@/api/costs/get-costs'
import { Pagination } from '@/components/pagination'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

import { CostTableFilters } from './cost-table-filters'
import { CostTableRow } from './cost-table-row'

export function Cost() {
  const [searchParams, setSearchParams] = useSearchParams()

  const name = searchParams.get('name')
  // const descricao = searchParams.get('descricao')

  const pageIndex = z.coerce
    .number()
    .transform((pageIndex) => pageIndex - 1)
    .parse(searchParams.get('pageIndex') ?? '1')

  const { data: result } = useQuery({
    queryKey: ['costs', pageIndex, name],
    queryFn: () => getCosts({ pageIndex, name }),
  })

  function handlePaginate(pageIndex: number) {
    setSearchParams((prev) => {
      prev.set('pageIndex', (pageIndex + 1).toString())
      return prev
    })
  }

  return (
    <div>
      <Helmet title="Custos" />
      <div className="flex flex-col gap-4 p-10">
        <h1 className="text-3xl font-bold tracking-tight">Custos</h1>
        <div className="space-y-2.5">
          <CostTableFilters />
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[64px]"></TableHead>
                  <TableHead className="w-[232px]">Nome</TableHead>
                  <TableHead className="w-[232px]">Categoria</TableHead>
                  <TableHead className="w-[232px]">Descrição</TableHead>
                  <TableHead className="w-[132px]"></TableHead>
                  <TableHead className="w-[132px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {result?.custo && result.custo.length > 0 ? (
                  result.custo.map((custo) => (
                    <CostTableRow key={custo.id} custo={custo} />
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="py-4 text-center">
                      Nenhum custo encontrado.
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
