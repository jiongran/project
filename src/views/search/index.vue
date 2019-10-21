<template>
  <div>
    <c-header @onLanguageChange="onLanguageChange"/>
    <div class="search">
      <div class="search-subNav hidden-sm-and-down">
        <div class="pull-right">
          <c-search @onSearchChange="onSearchChange" :valueData="name"/>
        </div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{name: 'home'}">{{$t('router.index')}}</el-breadcrumb-item>
          <el-breadcrumb-item>{{$t('search.result')}}</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="search-subNav-mobil">
        <div class="searchwrap">
          <c-search @onSearchChange="onSearchChange" :valueData="name"/>
        </div>
      </div>
      <div class="search-page-header">
        <h2 class="search-page-header-title hidden-sm-and-down">{{$t('search.result')}}</h2>
        <p class="search-page-header-info">{{$t('search.resultInfo',{num: total,name: name})}}</p>
      </div>
      <ul class="search-results-list" v-if="total">
        <li class="search-results-item" v-for="(item,index) in list" :key="index">
          <router-link class="search-results-item-link" tag="a" v-html="item.title"
                       :to="{name: 'detail',params: {categoryId: item.categoryId,id: item.id}}">
          </router-link>

          <div>
            <el-breadcrumb class="el-icon-arrow-right hidden-sm-and-down">
              <el-breadcrumb-item :to="{name: 'categories' ,params: {id: item.topCategoryId}}">{{item.topCategoryName}}
              </el-breadcrumb-item>
              <el-breadcrumb-item :to="{name: 'list',params: {id: item.categoryId}}">{{item.categoryName}}
              </el-breadcrumb-item>
            </el-breadcrumb>
          </div>
          <span class="search-results-item-description  hidden-sm-and-down" v-html='item.abstract'></span>
        </li>
      </ul>
      <el-pagination class="pagi hidden-sm-and-down" v-if="pcFlag"
                     @size-change="handleSizeChange"
                     @current-change="handleCurrentChange"
                     :current-page.sync="pageIndex"
                     :page-size="pageSize"
                     layout="prev, pager, next"
                     :total="total">
      </el-pagination>
      <div v-if="!total">

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
   * @module views/search/index
   * @desc 项目查询
   *
   * @version 0.1.0
   * @copyright 2019
   *
   */
  @Component({
    name: 'Search'
  })
  export default class extends Vue {
    /**
     * @typedef {Object} Data
     * @property {Boolean} isPc - 是否PC端
     * @property {String} name - 输入内容
     * @property {Number} pageIndex - 页码
     * @property {Number} pageSize - 每页长度
     * @property {Number} total - 总条数
     * @property {Array} list - 列表
     * @property {Any} timer - 计时器
     */
    isPc: number = util.getAppdown()
    name: any = ''
    pageIndex: number = 1
    pageSize: number = setting.defaultPageSize
    total: number = 0
    list: Array<any> = []
    timer: any = null

    get language(): string {
      return AppModule.language
    }

    get pcFlag(): boolean {
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
    onLanguageChange(): void {
      util.setTitle(this.$route.name)
      if (this.$route.name) {
        this.getList()
      }
    }

    /**
     * @desc 获取数据
     * @method getList
     */
    getList() {
      let data = {
        content: this.name,
        language: this.language,
        pageSize: this.pageSize,
        pageIndex: this.pageIndex
      }
      api.fullTextSearch(data).then((res: any) => {
        const { list, total } = res
        // this.list = [].concat(this.changeColor(list || []))
        this.list = [...(this.changeColor(list))]
        this.total = total
      }).catch(() => {
        this.list = []
        this.total = 0
      })
    }

    /**
     * @desc 数据字符串替换
     * @method changeColor
     * @param {Object|Array} dataList - 列表数据
     * @return {Object|Array} list - 列表数据
     */
    changeColor(dataList: Array<any>): Array<any> {
      let list = []
      list = dataList.map((key, val) => {
        if (key && (this.name && this.name.length > 0)) {
          let replaceReg = new RegExp(this.name, 'g')
          // 高亮替换v-html值
          let replaceString = '<span class="search-text">' + this.name + '</span>'
          let item = util.clone(key)
          item['title'] = item['title'].replace(replaceReg, replaceString)
          item['abstract'] = item['abstract'].replace(replaceReg, replaceString)
          return item
        }
      })
      return list
    }

    /**
     * @desc 更改查询内容 重新查询
     * @method onSearchChange
     * @param {String} val - 查询内容
     */
    onSearchChange(val: string): void {
      if (val) {
        this.name = val
        this.fnThrottle(this.getList, 500, 2000)
      } else {
        this.$message({ message: (this.$t('components.searchContext') as string), type: 'warning' })
      }
    }

    /**
     * @desc 节流请求
     * @method fnThrottle
     * @param {Function} method - 执行函数
     * @param {Number} delay - 延迟时间
     * @param {Number} duration - 间隔时间
     */
    fnThrottle(method = function() {
    }, delay = 500, duration = 2000) {
      const that = this
      let timer = this.timer
      let begin = new Date().getTime()
      return function() {
        let current = new Date().getTime()
        clearTimeout(timer)
        if (current - begin >= duration) {
          method()
          begin = current
        } else {
          that.timer = setTimeout(function() {
            method()
          }, delay)
        }
      }
    }

    /**
     * @desc 更改每页长度 重新查询
     * @method handleSizeChange
     * @param {Number} val - 每页长度
     */
    handleSizeChange(val: number): void {
      this.pageSize = val
      this.pageIndex = 1
      this.getList()
    }

    /**
     * @desc 更改页码 重新查询
     * @method handleCurrentChange
     * @param {Number} val - 页码
     */
    handleCurrentChange(val: number): void {
      this.pageIndex = val
      this.getList()
    }

    mounted() {
      util.setTitle(this.$route.name)
      this.name = this.$route.query.name
      if (this.name) {
        this.getList()
      }
    }
  }
</script>
<style scoped lang="less">
  .search {
    line-height: 1.5;
    margin: 0 auto;
    margin-top: 20px;
    max-width: @max-width;
    min-height: 65vh;
    @media (min-width: 1160px) {
      width: 90%;
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

    .search-subNav {
      clear: both;
      margin: 0 auto;

      .pull-right {
        float: right;
        width: 200px;
      }
    }

    .search-subNav-mobil {
      @media (max-width: 768px) {
        background: #35afe4 linear-gradient(#53cef0, #35afe4);
        background-image: none;
        padding: 30px 0 20px 0;
        display: block;
        .searchwrap {
          width: 90%;
          margin: 0 auto;
        }
      }
      @media (min-width: 768px) {
        display: none;
      }
    }

    .search-page-header {
      margin: 10px 0;
      @media (min-width: 768px) {
        margin: 10px 0;
        padding: 0 10px;
      }
      @media (max-width: 768px) {
        padding: 0 10px;
      }

      .search-page-header-title {
        font-size: 32px;
        margin-bottom: 10px;
      }

      .search-page-header-info {
        font-weight: 300;
        margin: 0 0 30px 0;
        word-break: break-word;
        @media (max-width: 768px) {
          margin: 0 0 10px 0;
        }
      }
    }

    .search-results-list {
      margin-bottom: 25px;
      @media (max-width: 768px) {
        padding: 0 10px;
      }

      .search-results-item {
        border-bottom: 1px solid @footer-line;
        padding: 20px 0;

        .search-results-item-link {
        }

        .search-results-item-description {
          margin-top: 15px;
        }

      }
    }

    .pagi {
      text-align: center;
      margin: 20px auto;
    }
  }
</style>
