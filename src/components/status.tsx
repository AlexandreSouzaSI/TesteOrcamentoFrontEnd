type Status =
  | 'vencido'
  | 'pago'
  | 'normal'
  | 'pendente'

interface StatusProps {
  status: Status
}

const StatusMap: Record<Status, string> = {
  vencido: 'vencido',
  pago: 'pago',
  normal: 'normal',
  pendente: 'pendente'
}

export function Status({ status }: StatusProps) {
  return (
    <div className="flex items-center gap-2">
      {status === 'normal' && (
        <span className="h-2 w-2 rounded-full bg-slate-400" />
      )}

      {status === 'vencido' && (
        <span className="h-2 w-2 rounded-full bg-rose-500" />
      )}

      {status === 'pago' && (
        <span className="h-2 w-2 rounded-full bg-emerald-500" />
      )}

      {['pendente'].includes(status) && (
        <span className="h-2 w-2 rounded-full bg-amber-500" />
      )}

      <span className="font-medium text-muted-foreground">
        {StatusMap[status]}
      </span>
    </div>
  )
}