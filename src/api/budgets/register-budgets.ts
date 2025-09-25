import { api } from '@/lib/axios';
import { getUserIdFromToken } from '@/lib/getUserIdFromToken';

export interface RegisterBudgetsBody {
  name: string;
  valor: number;
  status?: string | null;
  quantidade?: number | null;
  valorUnitario?: number | null;
  dataVencimento?: string | null;
  categoriaId?: string | null;
  produtoId?: string | null;
  custoId?: string | null;
}

export async function registerBudgets({
  name,
  valor,
  status,
  quantidade,
  valorUnitario,
  dataVencimento,
  categoriaId,
  produtoId,
  custoId
}: RegisterBudgetsBody) {

  const token = localStorage.getItem('token')
  const userId = getUserIdFromToken(token)

  if (!userId) {
    throw new Error('User ID not found in token')
  }

  const quantidadeNum = parseFloat(quantidade?.toString() ?? '0');
  const valorUnitarioNum = parseFloat(valorUnitario?.toString() ?? '0');
  let valorNum = parseFloat(valor?.toString() ?? '0');

  if (quantidadeNum > 0 && valorUnitarioNum > 0) {
    valorNum = quantidadeNum * valorUnitarioNum;
  }

  console.log("Cadastrando despesas para userId: ", userId)

  await api.post('/despesa', {
    userId,
    name,
    valor: valorNum,
    status,
    quantidade: quantidadeNum,
    valorUnitario: valorUnitarioNum,
    dataVencimento,
    categoriaId,
    produtoId,
    custoId
  });
}
