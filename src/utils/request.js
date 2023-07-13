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

      return Promise.resolve({
        success: true,
        message: statusText,
        statusCode: status,
        ...result,
      })
    })
    .catch(error => {
      const { response, message } = error

      if (String(message) === CANCEL_REQUEST_MESSAGE) {
        return {
          success: false,
        }
      }

      let msg
      let statusCode

      if (response && response instanceof Object) {
        const { data, statusText } = response
        statusCode = response.status
        msg = data.message || statusText
      } else {
        statusCode = 600
        msg = error.message || 'Network Error'
      }

      /* eslint-disable */
      return Promise.reject({
        success: false,
        statusCode,
        message: msg,
      })
    })
}
