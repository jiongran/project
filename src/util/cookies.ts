import Cookies from 'js-cookie'
import setting from '@/settings'

const languageKey = 'language'
export const getLanguage = (flag: boolean = setting.defaultStorageState) => {
  if (flag) {
    Cookies.get(setting.defaultSystemName + languageKey)
  } else {
    localStorage.getItem(setting.defaultSystemName + languageKey)
  }
}
export const setLanguage = (language: string, flag: boolean = setting.defaultStorageState) => {
  if (flag) {
    Cookies.set(setting.defaultSystemName + languageKey, language)
  } else {
    localStorage.setItem(setting.defaultSystemName + languageKey, language)
  }
}
const tokenKey = 'token'
export const getToken = (flag: boolean = setting.defaultStorageState) => {
  if (flag) {
    Cookies.get(setting.defaultSystemName + tokenKey)
  } else {
    localStorage.getItem(setting.defaultSystemName + tokenKey)
  }
}
export const setToken = (token: string, flag: boolean = setting.defaultStorageState) => {
  if (flag) {
    Cookies.set(setting.defaultSystemName + tokenKey, token)
  } else {
    localStorage.setItem(setting.defaultSystemName + tokenKey, token)
  }
}
