<template>
  <header class="header hidden-sm-and-down">
    <div class="header-wrap">
      <router-link class="logo" tag="a" :to="{name: 'home'}">
        <img src="./logo.png"/>
      </router-link>
      <div class="pull-right hidden-sm-and-down">
        <el-dropdown @command="handleCommand">
        <span class="el-dropdown-link">
          {{languageName}}<i class="el-icon-arrow-down el-icon--right"></i>
        </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item v-for="(item,index) in languageList" :key="index" :command="item.key"
                              :disabled="language===item.key">{{ item.name }}
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
  </header>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator'
  import { AppModule } from '@/store/modules/app'
  import util from '@/util/index'

  @Component({
    name: 'CHeader'
  })
  export default class extends Vue {
    languageList: Array<any> = []

    get language() {
      return AppModule.language
    }

    get languageName() {
      return util.getLange(this.language)
    }

    public handleCommand(lang: string) {
      AppModule.SetLanguage(lang)
      this.$i18n.locale = lang
      this.$emit('onLanguageChange')
    }

    mounted() {
      AppModule.getLanguageList().then((res: any) => {
        const { list } = res
        this.languageList = list || []
      })
    }
  }
</script>

<style scoped lang="less">
  .header {
    border-bottom: 1px solid @footer-line;

    .header-wrap {
      max-width: @max-width;
      margin: 0 auto;
      padding: 10px 0;
      position: relative;
      justify-content: space-between;

      &:after, &:before {
        display: table;
        content: "";
      }

      &:after {
        clear: both;
      }

      @media (min-width: 1160px) {
        width: 90%;
      }

      .logo {
        height: 40px;
        display: inline-block;

        img {
          height: 100%;
        }
      }

      .pull-right {
        vertical-align: middle;
        margin-top: 12px;
        float: right;
      }
    }
  }
</style>
