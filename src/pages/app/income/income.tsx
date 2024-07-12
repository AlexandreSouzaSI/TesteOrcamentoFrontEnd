import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Helmet } from "react-helmet-async";
import { Pagination } from "@/components/pagination";
import { IncomeTableFilters } from "./income-table-filters";
import { IncomeTableRow } from "./income-table-row";

export function Income() {
    return (
        <>
            <Helmet title="Orçamentos"/>
            <div className="flex flex-col gap-4 p-10">
                <h1 className="text-3xl font-bold tracking-tight">Renda</h1>
                <div className="space-y-2.5">
                    <IncomeTableFilters />
                    <div className="border rounded-md">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[64px]"></TableHead>
                                    <TableHead className="w-[340px]">Identificador</TableHead>
                                    <TableHead>Nome</TableHead>
                                    <TableHead className="w-[240px]">Valor</TableHead>
                                    <TableHead className="w-[240px]">Data</TableHead>
                                    <TableHead className="w-[240px]">Status</TableHead>
                                    <TableHead className="w-[164px]"></TableHead>
                                    <TableHead className="w-[132px]"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {Array.from({ length: 10 }).map((_, i) => {
                                    return (
                                        <IncomeTableRow key={i}/>
                                    )
                                })}
                            </TableBody>
                        </Table>
                    </div>
                    <Pagination pageIndex={0} totalCount={105} perPage={10} />
                </div>
            </div>
        </>
    )
}