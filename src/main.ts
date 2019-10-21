import Vue from 'vue'
import { Component } from 'vue-property-decorator'
import App from './App.vue'
import ElementUI from 'element-ui'
import store from '@/store/index'
import router from '@/router/index'
import i18n from '@/lang'
import setting from '@/settings'
import moment from 'moment'
import 'element-ui/lib/theme-chalk/index.css'
import 'element-ui/lib/theme-chalk/display.css'

import CHeader from '@/components/c-header/index.vue'
import CFooter from '@/components/c-footer/index.vue'
import CSearch from '@/components/c-search/index.vue'

Vue.use(ElementUI, {
  size: setting.defaultSize,
  i18n: (key: string, value: string) => i18n.t(key, value)
})

Vue.config.productionTip = false

Vue.component('c-header', CHeader)
Vue.component('c-footer', CFooter)
Vue.component('c-search', CSearch)

Vue.prototype.$moment = moment

Component.registerHooks([
  'beforeRouteEnter',
  'beforeRouteLeave',
  'beforeRouteUpdate'
])

new Vue({
  store,
  router,
  i18n,
  render: h => h(App)
}).$mount('#app')
