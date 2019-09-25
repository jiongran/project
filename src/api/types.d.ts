export interface ICategoriesData {
  language: string
}

export interface IRecentData extends ICategoriesData {
  searchTime?: number
}

export interface IPromotedArticlesData extends ICategoriesData {
}

export interface IAllChildCategoriesArticlesData extends ICategoriesData {
  categoryId: string
}

export interface IArticlesByCategoryData extends IAllChildCategoriesArticlesData {
  pageIndex: number
  pageSize: number
}

export interface IArticleDetailInfoData extends ICategoriesData {
  articleId: string
}

export interface IFullTextSearchData extends ICategoriesData {
  content: string,
  pageIndex: number
  pageSize: number
}
