<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script lang="ts">
  import { Component, Watch, Vue } from 'vue-property-decorator'

  @Component({
    name: 'App'
  })
  export default class extends Vue {
    isRouterAlive: boolean = true

    reload() {
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
