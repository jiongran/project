<template>
  <div class="">
    <c-header @onLanguageChange="onLanguageChange"/>
    <div class="detail">
      <div class="detail-subNav hidden-sm-and-down">
        <div class="pull-right">
          <c-search @onSearchChange="onSearchChange"/>
        </div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{name: 'home'}">{{$t('router.index')}}</el-breadcrumb-item>
          <el-breadcrumb-item :to="{name: 'categories',params: {id: articleDetail.topCategoryId}}">
            {{articleDetail.topCategoryName}}
          </el-breadcrumb-item>
          <el-breadcrumb-item :to="{name: 'list',params: {id: articleDetail.categoryId}}">
            {{articleDetail.categoryName}}
          </el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="detail-container">
        <div class="detail-sidebar">
          <div class="collapsible-sidebar">
            <h3 class="collapsible-sidebar-title" v-if="categoriesList.length">{{$t('detail.otherActicle')}}</h3>
            <ul>
              <li class="sidenav-item" v-for="item in categoriesList" :key="item.id">
                <router-link class="sidenav-item-link" :class="{'current': item.id === $route.params.id}" tag="a"
                             :to="{name: 'detail',params: {categoryId: item.categoryId,id: item.id}}">
                  {{item.title}}
                </router-link>
              </li>
            </ul>
            <p class="collapsible-sidebar-sapce"></p>
            <router-link class="see-all-articles" v-if="categoriesTotle>setting.defaultPageSize" tag="a"
                         :to="{name: 'list',params: {id: articleDetail.categoryId}}">
              {{$t('detail.seeAll')}}
            </router-link>
          </div>
        </div>
        <div class="detail-content">
          <div class="detail-content-header">
            <h1 class="detail-content-header-title">{{articleDetail.title}}</h1>
            <p class="detail-content-header-time">
              {{ articleDetail.createTime?$moment(articleDetail.createTime*1000).format('YYYY-MM-DD HH:mm:ss'):''}}
            </p>
          </div>
          <div class="detail-content-info" v-html="articleDetail.content">
          </div>
        </div>
      </div>
    </div>
    <c-footer/>
  </div>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator'
  import { AppModule } from '@/store/modules/app'
  import api from '@/api'
  import util from '@/util/index'
  import setting from '@/settings'

  /**
   *
   * @module views/categories/index
   * @desc 项目分类
   *
   * @version 0.1.0
   * @copyright 2019
   *
   */
  @Component({
    name: 'Detail'
  })
  export default class extends Vue {
    /**
     * @typedef {Object} Data
     * @property {String} categoryId - 类型ID
     * @property {String} id - 文章ID
     * @property {Array} categoriesList - 当前项目父类列表
     * @property {Number} categoriesTotle - 当前项目父类列表总长度
     * @property {Object} articleDetail - 项目详细
     */
    setting = setting
    categoryId: string = ''
    id: string = ''
    categoriesList: Array<any> = []
    categoriesTotle: number = 0
    articleDetail: any = {}

    get language(): string {
      return AppModule.language
    }

    /**
     * @desc 切换语言
     * @method onLanguageChange
     */
    onLanguageChange(): void {
      util.setTitle(this.$route.name)
      this.getData()
    }

    /**
     * @description 输入框查询
     * @param {String} val 内容
     * @method onSearchChange
     */
    onSearchChange(val: string): void {
      this.$router.push({
        name: 'search',
        query: {
          name: val
        }
      })
    }

    /**
     * @description 获取数据
     * @method getData
     */
    getData(): void {
      Promise.all([api.getArticlesByCategory({
        language: this.language,
        categoryId: this.categoryId,
        pageIndex: 1,
        pageSize: setting.defaultPageSize
      }), api.getArticleDetailInfo({ language: this.language, articleId: this.id })]).then((res: any) => {
        this.categoriesList = res[0].list || []
        this.categoriesTotle = res[0].total
        this.articleDetail = res[1]
      }).catch(() => {
        this.categoriesList = []
        this.categoriesTotle = 0
        this.articleDetail = {}
      })
    }

    created() {
      util.setTitle(this.$route.name)
      this.categoryId = this.$route.params['categoryId']
      this.id = this.$route.params['id']
      this.getData()
    }

    beforeRouteUpdate(to: any, from: any, next: any) {
      this.categoryId = to.params.categoryId
      this.id = to.params.id
      this.getData()
      next()
    }
  }
</script>

<style>
  .detail-content-info img {
    display: inline-block;
    max-width: 100%;
    height: auto;
    margin: 20px auto;
  }
</style>
<style scoped lang="less">
  .detail {
    line-height: 1.5;
    margin: 0 auto;
    margin-top: 20px;
    max-width: @max-width;
    min-height: 65vh;
    @media (min-width: 1160px) {
      width: 90%;
    }
    @media (max-width: 768px) {
      padding: 0 10px;
    }

    /deep/ .el-breadcrumb {
      line-height: 2;

      .is-link {
        cursor: pointer;
        color: @link-light-color;
      }
    }

    p, h1, h2, h3, h4 {
      margin: 0;
      padding: 0
    }

    .detail-subNav {
      clear: both;
      margin: 0 auto;

      .pull-right {
        float: right;
        width: 200px;
      }
    }

    .detail-container {
      display: flex;
      flex-direction: column;
      margin-top: 20px;
      @media (min-width: 1024px) {
        flex-direction: row;
      }
      @media (max-width: 768px) {
        flex-direction: column-reverse;
      }

      .detail-sidebar {
        flex: 1 0 auto;
        margin-bottom: 20px;
        padding: 0;
        @media (min-width: 1024px) {
          border: 0;
          flex: 0 0 17%;
          height: auto;
        }

        .collapsible-sidebar {
          flex: 1;
          padding: 10px 0;
          position: relative;
          @media (min-width: 1024px) {
            max-height: none;
            padding: 0;
          }

          .collapsible-sidebar-title {
            font-weight: 600;
            font-size: 15px;
            position: relative;
            margin-top: 0;
          }

          .sidenav-item {
            border-bottom: 1px solid @footer-line;

            .sidenav-item-link {
              border-radius: 4px;
              color: @link-dark-color;
              display: block;
              padding: 10px;

              &:hover, &.current {
                color: @link-light-color;
              }
            }
          }

          .collapsible-sidebar-sapce {
            height: 20px;
          }

          .see-all-articles {
            font-size: 12px;
            text-align: center;
            padding: 5px 15px;
            background-color: @link-light-color;
            color: #fff;
          }
        }
      }

      .detail-content {
        flex: 1 0 auto;
        @media (min-width: 1024px) {
          flex: 1 0 66%;
          max-width: 66%;
          min-width: 640px;
          padding: 0 30px;
        }

        .detail-content-header {
          align-items: flex-start;
          display: flex;
          flex-direction: column;
          flex-wrap: wrap;
          justify-content: space-between;
          margin-bottom: 20px;
          margin-top: 20px;
          @media (min-width: 768px) {
            flex-direction: row;
            margin-top: 0;
          }

          .detail-content-header-title {
            font-size: 32px;
            @media (min-width: 768px) {
              flex-basis: 100%;
            }
          }

          .detail-content-header-time {
            color: @link-dark-color;
          }
        }

        .detail-content-info {
          line-height: 1.6;
          margin: 20px 0;
          word-wrap: break-word;

        }
      }
    }
  }

</style>
