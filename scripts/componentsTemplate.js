const fs = require('fs')
const path = require('path')
const basePath = path.resolve(__dirname, '../src')

const dirName = process.argv[2]
const capPirName = dirName.substring(0, 1).toUpperCase() + dirName.substring(1)
if (!dirName) {
  console.log('文件夹名称不能为空！')
  process.exit(0)
}

/**
 * @msg: vue页面模版
 */
const VueTep = `<template>
  <div class="${dirName}">
  </div>
</template>

<script lang="ts">

import { Component, Vue } from 'vue-property-decorator'
import { AppModule } from '@/store/modules/app'
import api from '@/api'
import util from '@/util/index'
import setting from '@/settings'

@Component({
    name: ${dirName}
})
export default class extends Vue {
  get language() {
      return AppModule.language
    }
    
  mounted() {
    //
  }
}
</script>

<style lang="less">
</style>

`

fs.mkdirSync(`${basePath}/components/${dirName}`) // mkdir
process.chdir(`${basePath}/components/${dirName}`) // cd views
fs.writeFileSync(`${dirName}.vue`, VueTep) // vue
process.exit(0)
