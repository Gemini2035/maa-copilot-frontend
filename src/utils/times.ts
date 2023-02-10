import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(relativeTime)
dayjs.locale('zh-cn')

export type DayjsInput = string | number | dayjs.Dayjs | Date | null | undefined

export function formatRelativeTime(input: DayjsInput) {
  input = dayjs(input)
  return +input > +dayjs() ? input.toNow() : input.fromNow()
}

export function formatDateTime(input: DayjsInput) {
  return dayjs(input).format('YYYY-MM-DD HH:mm:ss')
}

export function formatDuration(milliseconds: number) {
  const hours = ~~(milliseconds / (60 * 60 * 1000))

  milliseconds -= hours * 60 * 60 * 1000

  const minutes = ~~(milliseconds / (60 * 1000))

  milliseconds -= minutes * 60 * 1000

  const seconds = ~~(milliseconds / 1000)

  milliseconds -= seconds * 1000

  if (hours > 0) {
    return `${hours}h${minutes}m`
  } else if (minutes > 0) {
    return `${minutes}m${seconds}s`
  } else if (seconds > 0) {
    return `${seconds + milliseconds / 1000}s`
  } else {
    return `${milliseconds}ms`
  }
}
