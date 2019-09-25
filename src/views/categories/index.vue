<template>
  <div>
    <c-header @onLanguageChange="onLanguageChange"/>
    <div class="category">
      <div class="category-subNav hidden-sm-and-down">
        <div class="pull-right">
          <c-search @onSearchChange="onSearchChange"/>
        </div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{name: 'home'}">{{$t('router.index')}}</el-breadcrumb-item>
          <el-breadcrumb-item>{{currentCategoryName}}</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="category-container">
        <div class="category-content">
          <header class="page-header hidden-sm-and-down">
            <h1>{{currentCategoryName}}</h1>
            <p class="page-header-description">{{currentCategoryDescription}}</p>
          </header>
          <div class="section-tree">
            <section class="section" v-for="item in categoriesList" :key="item.categoryId">
              <h3 class="section-tree-title">
                <router-link class="section-tree-title-link" tag="a" :to="{name: 'list',params: {id: item.categoryId}}">
                  {{item.categoryName}}
                </router-link>
              </h3>
              <ul class="article-list" v-for="items in item.details" :key="items.id">
                <li class="article-item">
                  <router-link class="article-item-link" tag="a"
                               :to="{name: 'detail',params: {categoryId: item.categoryId,id: items.id}}">
                    {{items.title}}
                  </router-link>
                </li>
              </ul>
              <router-link class="see-all-articles" v-if="item.total > setting.defaultPageSize" tag="a"
                           :to="{name: 'list',params: {id: item.categoryId}}">
                {{ $t('categoriew.all',{num: item.total}) }}
              </router-link>
            </section>
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
    name: 'Categories'
  })
  export default class extends Vue {
    setting = setting
    currentCategoryName: string = ''
    currentCategoryDescription: string = ''
    categoriesList: Array<any> = []

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
      api.getAllChildCategoriesArticles({
        language: this.language,
        categoryId: this.$route.params['id']
      }).then((res: any) => {
        const { list } = res
        this.categoriesList = list || []
        this.currentCategoryName = this.categoriesList.length > 0 ? this.categoriesList[0].topCategoryName : ''
        this.currentCategoryDescription = this.categoriesList.length > 0 ? this.categoriesList[0].topCategorySubName : ''
      }).catch(() => {
        this.categoriesList = []
        this.currentCategoryName = ''
        this.currentCategoryDescription = ''
      })
    }

    mounted() {
      util.setTitle(this.$route.name)
      this.getData()
    }
  }
</script>

<style scoped lang="less">
  .category {
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
    .category-subNav {
      clear: both;
      margin: 0 auto;
      .pull-right {
        float: right;
        width: 200px;
      }
    }
    .category-container {
      display: flex;
      justify-content: flex-end;
      .category-content {
        flex: 1;
        @media (min-width: 1024px) {
          flex: 0 0 100%;
        }
        .page-header {
          display: flex;
          flex-direction: column;
          flex-wrap: wrap;
          justify-content: space-between;
          margin: 10px 0;
          h1 {
            color: @link-color;
            font-size: 32px;
            flex-grow: 1;
            margin-bottom: 10px;
          }
          .page-header-description {
            font-style: italic;
            font-weight: 300;
            margin: 0 0 30px 0;
            word-break: break-word;
            color: @description-color;
            @media (min-width: 768px) {
              flex-basis: 100%;
            }
          }
          @media (min-width: 768px) {
            align-items: baseline;
            flex-direction: row;
          }
        }
        .section-tree {
          display: flex;
          flex-direction: column;
          flex-wrap: wrap;
          justify-content: space-between;
          @media (min-width: 768px) {
            flex-direction: row;
          }
          .section {
            flex: initial;

            margin-bottom: 20px;
            @media (min-width: 768px) {
              flex: 0 0 45%;
              margin-bottom: 60px;
            }
            .section-tree-title {
              font-size: 18px;
              font-weight: 700;
              margin-bottom: 0;
              color: #111;
              word-break: break-word;
              .section-tree-title-link {
                color: @link-dark-color;
              }
            }
            .article-list {
              .article-item {
                border-bottom: 1px solid @footer-line;
                font-size: 14px;
                padding: 15px 0;
                .article-item-link {
                  color: @link-dark-color;
                  &:hover {
                    color: @link-light-color;
                  }
                }
              }
            }
            .see-all-articles {
              display: block;
              padding: 15px 0;
              color: @link-light-color;
            }
          }
        }
      }
    }
  }

</style>
