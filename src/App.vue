<template>
  <div id="app">
    <i18n path="components.names" :locale="language" tag="div" class="div">
      <a href="/" target="_blank">{{ $t('components.search') }}</a>
    </i18n>
    <router-view/>
  </div>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator'
  import { AppModule } from '@/store/modules/app'

  @Component({
    name: 'App'
  })
  export default class extends Vue {
    isRouterAlive: boolean = true

    get language(): string {
      return AppModule.language
    }

    reload():void {
      this.isRouterAlive = false
      this.$nextTick(() => (this.isRouterAlive = true))
    }
  }
</script>

<style lang="less">
  #app {
    height: 100%;
    font-size: 1rem;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
    -ms-flex-direction: column;
    flex-direction: column;
  }
</style>
