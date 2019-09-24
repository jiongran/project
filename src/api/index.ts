import request from '@/util/request'
let prefixerForProxy: string = ''

if (process.env.NODE_ENV === 'development') {
  prefixerForProxy = 'http://searchapi.ledx.xyz'
}

export const getLanguage = () =>
  request({
    url: `${prefixerForProxy}/api/Common/GetLanguages`,
    method: 'get'
  })

export const getCategories = (data: any) =>
  request({
    url: `${prefixerForProxy}/api/Common/GetCategories`,
    method: 'post',
    data
  })

export const recentActivity = (data: any) =>
  request({
    url: `${prefixerForProxy}/api/Common/recentActivity`,
    method: 'post',
    data
  })

export const promotedArticles = (data: any) =>
  request({
    url: `${prefixerForProxy}/api/Articles/PromotedArticles`,
    method: 'post',
    data
  })

export const getAllChildCategoriesArticles = (data: any) =>
  request({
    url: `${prefixerForProxy}/api/Articles/getAllChildCategoriesArticles`,
    method: 'post',
    data
  })

export const getArticlesByCategory = (data: any) =>
  request({
    url: `${prefixerForProxy}/api/Articles/getArticlesByCategory`,
    method: 'post',
    data
  })

export const getArticleDetailInfo = (data: any) =>
  request({
    url: `${prefixerForProxy}/api/Articles/getArticleDetailInfo`,
    method: 'post',
    data
  })

export const fullTextSearch = (data: any) =>
  request({
    url: `${prefixerForProxy}/api/Articles/fullTextSearch`,
    method: 'post',
    data
  })
