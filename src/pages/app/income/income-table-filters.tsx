import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectItem, SelectContent, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";

export function IncomeTableFilters() {
    return (
        <form className="flex items-center gap-2">
            <span className="text-sm font-semibold">Filtros</span>
            <Input placeholder="ID do Orçamento" className="h-8 w-[320px]" />
            <Input placeholder="Nome do Orçamento" className="h-8 w-[320px]" />
            <Select>
                <SelectTrigger className="h-8 w-[180px]">
                    <SelectValue />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">Todos status</SelectItem>
                    <SelectItem value="paid">Pago</SelectItem>
                    <SelectItem value="overdue">Pendente</SelectItem>
                </SelectContent>
            </Select>

            <Button type="submit" variant="secondary" size="xs">
                <Search className="mr-2 h-4 w-4"/>
                Filtrar resultados
            </Button>

            <Button type="button" variant="outline" size="xs">
                <Search className="mr-2 h-4 w-4"/>
                Remover filtros
            </Button>
        </form>
    )
}