import { useQuery } from '@tanstack/react-query'
import { Helmet } from 'react-helmet-async'
import { useSearchParams } from 'react-router-dom'
import { z } from 'zod'

import { getProduct } from '@/api/product/get-product'
import { Pagination } from '@/components/pagination'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

import { ProductTableFilters } from './product-table-filters'
import { ProductTableRow } from './product-table-row'

export function Product() {
  const [searchParams, setSearchParams] = useSearchParams()

  const name = searchParams.get('name')

  const pageIndex = z.coerce
    .number()
    .transform((pageIndex) => pageIndex - 1)
    .parse(searchParams.get('pageIndex') ?? '1')

  const { data: result } = useQuery({
    queryKey: ['product', pageIndex, name],
    queryFn: () => getProduct({ pageIndex, name }),
  })

  function handlePaginate(pageIndex: number) {
    setSearchParams((prev) => {
      prev.set('pageIndex', (pageIndex + 1).toString())
      return prev
    })
  }

  return (
    <div>
      <Helmet title="Produtos" />
      <div className="flex flex-col gap-4 p-10">
        <h1 className="text-3xl font-bold tracking-tight">Estoque</h1>
        <div className="space-y-2.5">
          <ProductTableFilters />
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[64px]"></TableHead>
                  <TableHead className="w-[232px]">Nome</TableHead>
                  <TableHead className="w-[232px]">Categoria</TableHead>
                  <TableHead className="w-[232px]">Quantidade Minima</TableHead>
                  <TableHead className="w-[232px]">
                    Quantidade em estoque
                  </TableHead>
                  <TableHead className="w-[132px]"></TableHead>
                  <TableHead className="w-[132px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {result?.produto && result.produto.length > 0 ? (
                  result.produto.map((produto) => (
                    <ProductTableRow key={produto.id} produto={produto} />
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="py-4 text-center">
                      Nenhum produto encontrado.
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
