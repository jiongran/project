import setting from '@/settings'
import i18n from '@/lang'

const getLange = (language: string = setting.defaultLanguage) => {
  const stringEmum: any = {
    'zhchs': '简体中文',
    'en': 'English'
  }
  return stringEmum[language] || stringEmum[setting.defaultLanguage]
}

const getAppdown = (): number => {
  let mobileSystem = 0
  let ua = navigator.userAgent
  if (/(iPhone|iPad|iPod|iOS)/i.test(ua)) {
    mobileSystem = 1
  } else if (/(Android)/i.test(ua)) {
    mobileSystem = 2
  }
  return mobileSystem
}

const clone = (obj: any): any => {
  if (typeof obj === 'object' && obj !== null) {
    let o = Object.prototype.toString.call(obj).slice(8, -1) === 'Array' ? [] : {}
    for (let k in obj) {
      if (typeof obj[k] === 'object' && obj[k] !== null) {
        (o as any)[k] = clone(obj[k])
      } else {
        (o as any)[k] = obj[k]
      }
    }
    return o
  } else {
    return obj
  }
}

const diaplayTime = (dateTimeStamp: number): string => {
  let result: string = ''
  const minute = 1000 * 60
  const hour = minute * 60
  const day = hour * 24
  const month = day * 30
  const now: number = new Date().getTime()
  const curTime: number = dateTimeStamp * 1000
  const diffValue: number = now - curTime
  const monthC: number = diffValue / month
  const weekC: number = diffValue / (7 * day)
  const dayC: number = diffValue / day
  const hourC: number = diffValue / hour
  const minC: number = diffValue / minute
  if (diffValue >= 0) {
    if (monthC >= 1) {
      if (monthC <= 12) {
        result = monthC + (i18n.t('components.monthLater') as string)
      } else {
        result = monthC / 12 + (i18n.t('components.yearLater') as string)
      }
    } else if (weekC >= 1) {
      result = weekC + (i18n.t('components.weekLater') as string)
    } else if (dayC >= 1) {
      result = dayC + (i18n.t('components.dayLater') as string)
    } else if (hourC >= 1) {
      result = hourC + (i18n.t('components.hourLater') as string)
    } else if (minC >= 1) {
      result = minC + (i18n.t('components.minsLater') as string)
    } else {
      result = i18n.t('components.just') as string
    }
  }
  return result
}

const setTitle = (val: string = 'index'): void => {
  let str = val
  document.title = (i18n.t('router.' + str) as string)
}

export default {
  getLange,
  getAppdown,
  clone,
  diaplayTime,
  setTitle
}
