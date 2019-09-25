<template>
  <div>
    <c-header @onLanguageChange="onLanguageChange"/>
    <div class="list">
      <div class="list-subNav hidden-sm-and-down">
        <div class="pull-right">
          <c-search @onSearchChange="onSearchChange"/>
        </div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{name: 'home'}">{{$t('router.index')}}</el-breadcrumb-item>
          <el-breadcrumb-item :to="{name: 'categories',params: {id: topCategoryId}}">{{topCategoryName}}
          </el-breadcrumb-item>
          <el-breadcrumb-item>{{currentCategoryName}}</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="list-container">
        <div class="list-content">
          <header class="page-header hidden-sm-and-down">
            <h1>{{currentCategoryName}}</h1>
          </header>
          <ul class="article-list">
            <li class="article-item" v-for="item in categoriesList" :key="item.id">
              <router-link class="article-item-link" tag="a"
                           :to="{name: 'detail',params: {categoryId: item.categoryId,id: item.id}}">
                {{item.title}}
              </router-link>
            </li>
          </ul>
          <el-pagination class="pagi" v-if="pcFlag"
                         @size-change="handleSizeChange"
                         @current-change="handleCurrentChange"
                         :current-page.sync="pageIndex"
                         :page-size="pageSize"
                         layout="prev, pager, next"
                         :total="total">
          </el-pagination>
        </div>
      </div>
    </div>
    <c-footer/>
  </div>
</template>

<script lang="ts">
  /**
   *
   * @module views/list/index
   * @desc 项目列表
   *
   * @version 0.1.0
   * @copyright 2019
   *
   */
  import { Component, Vue } from 'vue-property-decorator'
  import { AppModule } from '@/store/modules/app'
  import api from '@/api'
  import util from '@/util/index'
  import setting from '@/settings'

  @Component({
    name: 'List'
  })
  export default class extends Vue {
    /**
     * @typedef {Object} Data
     * @property {Boolean} isPc - 是否PC端
     * @property {Number} pageIndex - 当前页码
     * @property {Number} pageSize - 每页长度
     * @property {Number} total - 总条数
     * @property {Array} categoriesList - 列表
     * @property {String} topCategoryId - 总分类ID
     * @property {String} topCategoryName - 总分类名称
     * @property {String} currentCategoryName - 当前分类名称
     */
    isPc:number= util.getAppdown()
    pageIndex:number= 1
    pageSize:number=setting.defaultPageSize
    total:number= 0
    categoriesList:Array<any>= []
    topCategoryId:string= ''
    topCategoryName:string= ''
    currentCategoryName:string= ''

    get language():string {
      return AppModule.language
    }
    get pcFlag ():boolean {
      let flag = false
      if (!this.isPc) {
        if (this.total && this.total > setting.defaultPageSize) {
          flag = true
        }
      }
      return flag
    }

    /**
     * @desc 切换语言
     * @method onLanguageChange
     */
    onLanguageChange ():void {
      util.setTitle(this.$route.name)
      this.pageSize = setting.defaultPageSize
      this.pageIndex = 1
      this.getData()
    }

    /**
     * @desc 更改查询内容 跳转
     * @method onSearchChange
     * @param {String} val - 查询内容
     */
    onSearchChange (val:string):void {
      this.$router.push({
        name: 'search',
        query: {
          name: val
        }
      })
    }
    /**
     * @desc 更改每页长度 重新查询
     * @method handleSizeChange
     * @param {Number} val - 每页长度
     */
    handleSizeChange (val:number):void {
      this.pageSize = val
      this.pageIndex = 1
      this.getData()
    }

    /**
     * @desc 更改页码 重新查询
     * @method handleCurrentChange
     * @param {Number} val - 页码
     */
    handleCurrentChange (val:number):void {
      this.pageIndex = val
      this.getData()
    }

    /**
     * @desc 获取数据
     * @method getData
     */
    getData ():void {
      api.getArticlesByCategory({
        language: this.language,
        categoryId: this.$route.params['id'],
        pageIndex: this.pageIndex,
        pageSize: !this.isPc ? this.pageSize : this.pageSize * 5
      }).then((res: any) => {
        const { list, total } = res
        this.total = total
        this.categoriesList = list || []
        this.topCategoryId = this.categoriesList.length > 0 ? this.categoriesList[0].topCategoryId : ''
        this.topCategoryName = this.categoriesList.length > 0 ? this.categoriesList[0].topCategoryName : ''
        this.currentCategoryName = this.categoriesList.length > 0 ? this.categoriesList[0].categoryName : ''
      }).catch(() => {
        this.total = 0
        this.categoriesList = []
        this.topCategoryId = ''
        this.topCategoryName = ''
        this.currentCategoryName = ''
      })
    }

    mounted () {
      util.setTitle(this.$route.name)
      this.getData()
    }
  }
  </script>

<style scoped lang="less">
.list {
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
  .list-subNav {
    clear: both;
    margin: 0 auto;
    .pull-right {
      float: right;
      width: 200px;
    }
  }
  .list-container {
    display: flex;
    justify-content: flex-end;
    .list-content {
      flex: 1;
      .page-header {
        display: flex;
        flex-direction: column;
        flex-wrap: wrap;
        justify-content: space-between;
        margin: 10px 0;
        h1 {
          font-size: 32px;
          flex-grow: 1;
          color: #39414a;
          font-weight: 600;
          margin-bottom: 10px;
        }
      }
      .article-list {
        .article-item {
          border-bottom: 1px solid @footer-line;
          font-size: 14px;
          padding: 15px 0;
          @media (min-width: 768px) {
            width: 48%;
            margin-right: 20px;
            display: inline-block;
          }
          @media (max-width: 768px) {
            width: 100%;
            display: block;
          }
          .article-item-link {
            color: @link-dark-color;
            &:hover {
              color: @link-light-color;
            }
          }
        }
      }
      .pagi {
        text-align: center;
        margin: 20px auto;
      }
    }
  }
}

</style>
