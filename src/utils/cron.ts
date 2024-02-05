import cronstrue from 'cronstrue'
import 'cronstrue/locales/zh_CN'

export const formatCron = (cron: string) => {
  return cronstrue.toString(cron, {
    use24HourTimeFormat: true,
    verbose: true,
    locale: 'zh_CN'
  })
}

export const weekConverter = (week: number) => {
  const map = ['一', '二', '三', '四', '五', '六', '日']
  return `周${map[week]}`
}

export const genCron = (
  { frequency, time, day, week } = {
    frequency: 'daily',
    time: 0,
    day: 1,
    week: 1
  }
) => {
  time = time === 24 ? 0 : time
  let cron = ''
  if (frequency === 'daily') {
    cron = `0 ${time} * * *`
  } else if (frequency === 'weekly') {
    cron = `0 ${time} * * ${week}`
  } else if (frequency === 'monthly') {
    cron = `0 ${time} ${day} * *`
  }
  return cron
}
