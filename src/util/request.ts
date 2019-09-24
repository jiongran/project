import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'
import { Message, Loading } from 'element-ui'

/**
 * @desc 接口访问注册和拦截
 * @type {AxiosInstance}
 * @constructor
 * @return {Promise<any>}
 *
 * @version 0.1.0
 * @copyright 2019
 *
 */

const http = axios.create()

let loadingInstance: any = null

/**
 *
 * @type {CancelTokenStatic}
 */
const CancelToken = axios.CancelToken

/**
 * 请求队列
 * @type {Array}
 */
const pending: Array<any> = []

/**
 *  根据config返回请求URL和对象数据
 * @param config
 * @return {string}
 */
const getURL = (config: AxiosRequestConfig) => {
    return config.method === 'get' ? encodeURIComponent(config.url + JSON.stringify(config.params)) : encodeURIComponent(config.url + JSON.stringify(config.data))
}

/**
 * 移除已存在的队友并且执行取
 * @param ever
 */
const removePending = (ever: AxiosRequestConfig) => {
    for (let p in pending) {
        if (pending[p].u === getURL(ever)) { // 当当前请求在数组中存在时执行函数体
            pending[p].f() // 执行取消操作
            pending.splice((p as any), 1) // 把这条记录从数组中移除
        }
    }
}

/**
 * @desc respone  基本配置
 * @return {Object|Promise<any>}
 * @memberof http
 */
http.interceptors.request.use(config => {
    loadingInstance = Loading.service({ fullscreen: true })
    removePending(config)
    config.cancelToken = new CancelToken((c) => {
        var url = getURL(config)
        pending.push({ u: url, f: c })
    })
    config.timeout = 10000
    return config
}, error => {
    return Promise.reject(error)
})

/**
 * @desc respone 拦截器
 * @return {Promise<any>}
 * @memberof http
 */
http.interceptors.response.use(
    (response): any => {
        loadingInstance.close()
        removePending(response.config)
        const { code } = response.data
        if (code === 0) {
            return Promise.resolve(processRes(response))
        } else {
            Message({
                message: 'Error',
                type: 'error',
                duration: 5 * 1000
            })
            return Promise.resolve(processRes(response.data))
        }
    }, (error: any) => {
        loadingInstance.close()
        return Promise.reject(error.response)
    }
)

/**
 * @desc 过滤成功数据
 * @member {Function}
 * @memberof http
 * @param res
 * @returns {Object}
 */
function processRes(res: AxiosResponse) {
    const data = res.data.data
    if (data instanceof Array) {
        const obj = {
            list: data
        }
        for (const key in res.data) {
            ['code', 'result', 'data'].indexOf(key) === -1 && ((obj as any)[key] = res.data[key])
        }
        res.data.data = obj
    }
    return res
}

export default http
