import axios from 'axios'
import { cloneDeep } from 'lodash'
const { parse, compile } = require("path-to-regexp")
import { message } from 'antd'
import { CANCEL_REQUEST_MESSAGE } from 'utils/constant'
import store from 'store'
const { CancelToken } = axios
window.cancelRequest = new Map()

export default function request(options) {
  let { data, url , headers = {}} = options
  const cloneData = cloneDeep(data)

  try {
    let domain = ''
    const urlMatch = url.match(/[a-zA-z]+:\/\/[^/]*/)
    if (urlMatch) {
      ;[domain] = urlMatch
      url = url.slice(domain.length)
    }

    const match = parse(url)
    url = compile(url)(data)

    for (const item of match) {
      if (item instanceof Object && item.name in cloneData) {
        delete cloneData[item.name]
      }
    }
    url = domain + url
  } catch (e) {
    message.error(e.message)
  }
  const setToken = () => {
    const xToken = store.get('Token')
    headers['Token'] = xToken || `eyJhbGciOiJIUzUxMiJ9.eyJpZCI6ODYwOTY1LCJhcHBfdmVyc2lvbiI6IjEiLCJjaGFubmVsIjoyfQ.ftI5WJeKzU6asQAX3QPnIPKQxFeK24kJ7LAWJAchJZ4qeO9Cb1pNmnyrw_auB0a6OMVLGdpOmR7LAYgDhQ84sA`;
    return headers
  }
  options.url = url
  options.cancelToken = new CancelToken(cancel => {
    window.cancelRequest.set(Symbol(Date.now()), {
      pathname: window.location.pathname,
      cancel,
    })
  })

  options.headers = setToken();

  // 解决get方法不显示参数的问题
  console.log(options,'.options');
  if (options.method && options.method.toUpperCase() === 'GET') {
    options.params = data;
  }
  return axios(options)
    .then(response => {
      const { statusText, status, data } = response

      let result = {}
      if (typeof data === 'object') {
        result = data
        if (Array.isArray(data)) {
          result.list = data
        }
      } else {
        result.data = data
      }
      // success 都是true
      //包含两种， 1.接口报错 2.接口含错误信息 ======== 

      if ( data.success) {
        return Promise.resolve({
            success: true,
            message: data.msg,
            statusCode: status,
            ...result,
        })
      } else {
          message.error(data.msg)
          return Promise.reject({
              success: false,
              statusCode: data.code,
              message: data.msg,
          })
      }
    })
    .catch(error => {
      console.log(error,'error');
      const { response, message,statusCode } = error

      if (String(message) === CANCEL_REQUEST_MESSAGE) {
        return {
          success: false,
        }
      }

      let msg = message

      // if (response && response instanceof Object) {
      //   const { data, statusText } = response
      //   statusCode = response.status
      //   msg = data.message || statusText
        
      // } else {
      //   statusCode = 600
      //   msg = error.message || 'Network Error'
      // }
//全局弹错误信息
      /* eslint-disable */
      return Promise.reject({
        success: false,
        statusCode,
        message: msg,
      })
    })
}
