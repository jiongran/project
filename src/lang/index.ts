import Vue from 'vue'
import VueI18n from 'vue-i18n'

import setting from '@/settings'
import { getLanguage } from '@/util/cookies'

// element-ui built-in lang
import elementEnLocale from 'element-ui/lib/locale/lang/en'
import elementZhLocale from 'element-ui/lib/locale/lang/zh-CN'
import elementZhTWLocale from 'element-ui/lib/locale/lang/zh-TW'

// User defined lang
import enLocale from './en'
import zhLocale from './zh'
import zhtwLocale from './zh-tw'

Vue.use(VueI18n)

const messages = {
  en: {
    ...enLocale,
    ...elementEnLocale
  },
  zhchs: {
    ...zhLocale,
    ...elementZhLocale
  },
  zhtw: {
    ...zhtwLocale,
    ...elementZhTWLocale
  }
}

export const getLocale = () => {
  const cookieLanguage:any = getLanguage(setting.defaultStorageState)
  if (cookieLanguage) {
    return cookieLanguage
  }

  const language = navigator.language.toLowerCase()
  const locales = Object.keys(messages)
  for (const locale of locales) {
    if (language.indexOf(locale) > -1) {
      return locale
    }
  }

  return setting.defaultLanguage
}

const i18n = new VueI18n({
  locale: getLocale(),
  messages
})

export default i18n
