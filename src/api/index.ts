import request from '@/util/request'
import {
  ICategoriesData,
  IRecentData,
  IPromotedArticlesData,
  IAllChildCategoriesArticlesData,
  IArticlesByCategoryData,
  IArticleDetailInfoData,
  IFullTextSearchData
} from './types'

let prefixerForProxy: string = ''

if (process.env.NODE_ENV === 'development') {
  prefixerForProxy = 'http://searchapi.ledx.xyz'
} else {
  if (process.env.VUE_APP_TITLE === 'alpha') {
    prefixerForProxy = 'http://searchapi.ledx.xyz'
  } else if (process.env.VUE_APP_TITLE === 'beta') {
    prefixerForProxy = 'https://hsapi.aoo.world'
  }
}

const getLanguage = () =>
request({
  url: `${prefixerForProxy}/api/Common/GetLanguages`,
  method: 'get'
})

const getCategories = (data: ICategoriesData) =>
request({
  url: `${prefixerForProxy}/api/Common/GetCategories`,
  method: 'post',
  data
})

const getRecentActivity = (data: IRecentData) =>
request({
  url: `${prefixerForProxy}/api/Common/recentActivity`,
  method: 'post',
  data
})

const promotedArticles = (data: IPromotedArticlesData) =>
request({
  url: `${prefixerForProxy}/api/Articles/PromotedArticles`,
  method: 'post',
  data
})

const getAllChildCategoriesArticles = (data: IAllChildCategoriesArticlesData) =>
request({
  url: `${prefixerForProxy}/api/Articles/getAllChildCategoriesArticles`,
  method: 'post',
  data
})

const getArticlesByCategory = (data: IArticlesByCategoryData) =>
request({
  url: `${prefixerForProxy}/api/Articles/getArticlesByCategory`,
  method: 'post',
  data
})

const getArticleDetailInfo = (data: IArticleDetailInfoData) =>
request({
  url: `${prefixerForProxy}/api/Articles/getArticleDetailInfo`,
  method: 'post',
  data
})

const fullTextSearch = (data: IFullTextSearchData) =>
request({
  url: `${prefixerForProxy}/api/Articles/fullTextSearch`,
  method: 'post',
  data
})

export default {
  namespaced: true,
  getLanguage,
  getCategories,
  getRecentActivity,
  promotedArticles,
  getAllChildCategoriesArticles,
  getArticlesByCategory,
  getArticleDetailInfo,
  fullTextSearch
}
