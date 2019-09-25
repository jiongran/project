import Cookies from 'js-cookie'
import settings from '@/settings'

const languageKey = 'language'
export const getLanguage = (flag: boolean = settings.defaultStorageState) => {
  if (flag) {
    return Cookies.get(settings.defaultSystemName + languageKey)
  } else {
    return localStorage.getItem(settings.defaultSystemName + languageKey)
  }
}
export const setLanguage = (language: string, flag: boolean = settings.defaultStorageState) => {
  if (flag) {
    Cookies.set(settings.defaultSystemName + languageKey, language)
  } else {
    localStorage.setItem(settings.defaultSystemName + languageKey, language)
  }
}
const tokenKey = 'token'
export const getToken = (flag: boolean = settings.defaultStorageState) => {
  if (flag) {
    Cookies.get(settings.defaultSystemName + tokenKey)
  } else {
    localStorage.getItem(settings.defaultSystemName + tokenKey)
  }
}
export const setToken = (token: string, flag: boolean = settings.defaultStorageState) => {
  if (flag) {
    Cookies.set(settings.defaultSystemName + tokenKey, token)
  } else {
    localStorage.setItem(settings.defaultSystemName + tokenKey, token)
  }
}
