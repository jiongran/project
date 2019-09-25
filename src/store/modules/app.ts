import { VuexModule, Module, Mutation, Action, getModule } from 'vuex-module-decorators'
import setting from '@/settings'
import { setLanguage } from '@/util/cookies'
import { getLocale } from '@/lang'
import api from '@/api'
import store from '@/store/index'

export interface IAppState {
  language: string
}

@Module({ dynamic: true, store, name: 'app' })
class App extends VuexModule implements IAppState {
  public language = getLocale()

  @Mutation
  private SET_LANGUAGE(language: string) {
    this.language = language
    setLanguage(this.language, setting.defaultStorageState)
  }

  @Action
  public SetLanguage(language: string) {
    this.SET_LANGUAGE(language)
  }

  @Action
  public getLanguageList() {
    return api.getLanguage()
  }
}

export const AppModule = getModule(App)
