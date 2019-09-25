<template>
  <div>
    <c-header @onLanguageChange="onLanguageChange"/>
    <div class="main">
      <div class="wrap">
        <div class="wrapConent">
          <div class="title">{{$t('router.index')}}</div>
          <div class="search">
            <c-search @onSearchChange="onSearchChange"/>
          </div>
        </div>
      </div>
      <div class="categories">
        <ul class="blocks-list">
          <!--<li class="blocks-item" v-for="(item,index) in categoriesList" :key="item.id">-->
          <li class="blocks-item"
              v-for="(item) in categoriesList"
              :key="item.id">
            <router-link class="blocks-item-link"
                         tag="a"
                         :to="{name: 'categories',params: {id: item.id}}">
              <h4 class="blocks-item-title">{{item.name}}</h4>
              <p class="blocks-item-description">{{item.subName}}</p>
            </router-link>
          </li>
        </ul>
      </div>
      <div class="articles">
        <p class="articles-title">{{$t('home.topQuestions')}}</p>
        <ul class="article-list">
          <li class="article-item"
              v-for="item in questionList"
              :key="item.id">
            <router-link class="article-item-link"
                         tag="a"
                         :to="{name: 'detail',params: {categoryId: item.categoryId,id: item.id}}">
              {{item.title}}
            </router-link>
          </li>
        </ul>
      </div>
      <div class="recent-activity">
        <div class="recent-activity-header">{{$t('home.recentActivity')}}</div>
        <ul class="recent-activity-list">
          <li class="recent-activity-item"
              v-for="item in recentActivityList"
              :key="item.id">
            <router-link class="recent-activity-item-parent"
                         tag="a"
                         :to="{name: 'list',params: {id: item.categoryId}}">
              {{item.categoryName}}
            </router-link>
            <router-link class="recent-activity-item-link"
                         tag="a"
                         :to="{name: 'detail',params: {categoryId: item.categoryId,id: item.id}}">
              {{item.title}}
            </router-link>
            <div class="recent-activity-item-meta">
              <div class="recent-activity-item-time">
                {{$t('home.creaateTime', {createTime: util.diaplayTime(item.createTime)})}}
              </div>
            </div>
          </li>
          <li class="recent-activity-item noBorder"
              v-if="!recentActivityList.length">{{$t('components.noData')}}
          </li>
        </ul>
        <div class="recent-activity-controls">
          <a href="javascript:;"
             v-if="isShowMore"
             class="recent-activity-controls-link"
             @click="getRecentActivityMore">{{$t('detail.seeAll')}}</a>
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

  @Component({
    name: 'Home'
  })
  export default class extends Vue {
    /**
     * @typedef {Object} Data
     * @property {Array} categoriesList - 主目录
     * @property {Array} questionList - 热门列表
     * @property {Array} recentActivityList - 最近的活动
     * @property {Number} recentActivityTime - 最近的活动-时间
     * @property {Boolean} isShowMore - 最近的活动-更多状态
     */
    util = util
    categoriesList: Array<any> = []
    questionList: Array<any> = []
    recentActivityList: Array<any> = []
    recentActivityTime: number = 0
    isShowMore: boolean = false

    get language(): string {
      return AppModule.language
    }

    /**
     * @desc 切换语言
     * @method onLanguageChange
     */
    public onLanguageChange(): void {
      this.recentActivityTime = 0
      this.isShowMore = false
      util.setTitle(this.$route.name)
      this.getData()
      this.getRecentActivity()
    }

    /**
     * @desc 更改查询内容 跳转
     * @method onSearchChange
     * @param {String} val - 查询内容
     */
    public onSearchChange(val: string): void {
      this.$router.push({
        name: 'search',
        query: {
          name: val
        }
      })
    }

    /**
     * @desc 获取数据
     * @method getData
     */
    public getData(): void {
      Promise.all([api.getCategories({ language: this.language }), api.promotedArticles({ language: this.language })]).then((res: any) => {
        let categoriesList = res[0] ? (res[0].list || []) : []
        this.categoriesList = categoriesList.map((key: any) => {
          if (!key.parentId) {
            return key
          }
        })
        this.questionList = res[1] ? (res[1].list || []) : []
      }).catch(() => {
        this.categoriesList = []
        this.questionList = []
      })
    }

    /**
     * @desc 最近的活动
     * @method getRecentActivity
     */
    public getRecentActivity(): void {
      api.getRecentActivity({ language: this.language }).then((res: any) => {
        const { list } = res
        if (list.length === setting.defaultPageSize) {
          this.isShowMore = true
        } else {
          this.isShowMore = false
        }
        this.recentActivityTime = list[list.length - 1]['createTime'] || 0
        this.recentActivityList = list || []
      }).catch(() => {
        this.isShowMore = false
      })
    }

    /**
     * @desc 最近的活动-更多
     * @method getRecentActivityMore
     */
    public getRecentActivityMore(): void {
      api.getRecentActivity({ language: this.language, searchTime: this.recentActivityTime }).then((res: any) => {
        const { list } = res
        if (list.length === setting.defaultPageSize) {
          this.isShowMore = true
        } else {
          this.isShowMore = false
        }
        this.recentActivityTime = list[list.length - 1]['createTime'] || 0
        this.recentActivityList = this.recentActivityList.concat(list || [])
      }).catch(() => {
        this.isShowMore = false
      })
    }

    mounted() {
      this.getData()
      this.getRecentActivity()
    }
  }
</script>
<style scoped lang="less">
  .main {
    line-height: 1.5;
    min-height: 65vh;

    .wrap {
      background: #35afe4 linear-gradient(#53cef0, #35afe4);
      background-image: none;
      padding: 60px 0 40px 0;

      .wrapConent {
        max-width: 610px;
        margin: 0 auto;

        .title {
          text-align: center;
          font-size: 28px;
          color: #fff;
        }

        .search {
          width: 80%;
          margin: 20px auto;
        }
      }
    }

    .categories {
      margin: 20px auto;
      max-width: @max-width;
      @media (min-width: 1160px) {
        width: 90%;
      }
      @media (max-width: 768px) {
        padding: 0 10px;
      }

      .blocks-list {
        display: flex;
        flex-wrap: wrap;
        justify-content: flex-start;
        list-style: none;
        padding: 0;
        @media (max-width: 768px) {
          margin: 0;
        }

        .blocks-item {
          border: 2px solid #c1d8d6;
          border-radius: 4px;
          box-sizing: border-box;
          display: flex;
          flex: 1 0 340px;
          flex-direction: column;
          justify-content: center;
          margin: 0 20px 20px 0;
          max-width: 100%;
          text-align: center;

          &:hover {
            border-color: @link-light-hover-color;
          }

          @media (max-width: 768px) {
            margin: 0 0 20px 0;
          }

          .blocks-item-link {
            padding: 25px 20px;

            .blocks-item-title {
              color: @link-color;
              margin: 0;
            }

            .blocks-item-description {
              color: @description-color;
              margin: 0;
              margin-top: 10px;
            }
          }
        }
      }
    }

    .articles {
      margin: 0 auto;
      max-width: @max-width;
      @media (min-width: 1160px) {
        width: 90%;
      }
      @media (max-width: 768px) {
        padding: 0 10px;
      }

      .articles-title {
        color: @link-color;
        font-size: 18px;
        font-weight: 400;
      }

      .article-list {
        display: flex;
        flex-direction: column;
        flex-wrap: wrap;
        @media (min-width: 768px) {
          flex-direction: row;
        }

        .article-item {
          flex: 1 0 auto;
          @media (min-width: 768px) {
            align-self: flex-end;
            flex: 0 0 auto;
            padding-right: 10px;
            width: 32%;
          }

          .article-item-link {
            color: @link-dark-color;
            display: block;
            padding: 20px 0;

            &:hover {
              color: @link-light-color;
            }
          }
        }
      }
    }

    .recent-activity {
      padding: 30px 0;
      margin: 0 auto;
      margin-top: 30px;
      max-width: @max-width;
      border-top: 1px solid @footer-line;
      @media (min-width: 1160px) {
        width: 90%;
      }
      @media (max-width: 768px) {
        padding: 30px 10px;
      }

      .recent-activity-header {
        margin-bottom: 10px;
        text-align: center;
      }

      .recent-activity-list {
        .recent-activity-item {
          border-bottom: 1px solid @footer-line;
          overflow: auto;
          padding: 20px 0;

          &.noBorder {
            border-bottom: none;
          }

          .recent-activity-item-parent {
            margin: 6px 0;
            color: @link-color;
            display: inline-block;
            width: 100%;
            font-weight: 700;
            font-size: 16px;
            @media (min-width: 768px) {
              width: 70%;
              margin: 0;
            }
          }

          .recent-activity-item-link {
            color: @link-dark-color;
            display: inline-block;
            font-size: 14px;
            font-weight: 300;
            @media (min-width: 768px) {
              width: 70%;
              margin: 0;
            }

            &:hover {
              color: @link-light-color;
            }
          }

          .recent-activity-item-meta {
            margin: 20px 0 0 0;
            float: none;
            @media (min-width: 768px) {
              margin: 0;
              float: right;
            }

            .recent-activity-item-time {
              color: @description-color;
              display: inline-block;
              font-size: 13px;
              font-weight: 300;
            }
          }
        }
      }

      .recent-activity-controls {
        padding-top: 20px;

        .recent-activity-controls-link {
          color: @link-light-color;
        }
      }
    }
  }
</style>
