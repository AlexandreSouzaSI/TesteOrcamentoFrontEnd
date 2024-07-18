import moment from 'moment'

export function formatDate(dateString: string) {
  const date = moment(dateString)
  return date.format('DD/MM/YYYY')
}

export function isDateToday(dateString: string) {
  const inputDate = moment(dateString).startOf('day')
  const today = moment().startOf('day')
  return inputDate.isSame(today, 'day')
}

export function isDateFuture(dateString: string) {
  const inputDate = moment(dateString).startOf('day')
  const today = moment().startOf('day')
  return inputDate.isAfter(today, 'day')
}
