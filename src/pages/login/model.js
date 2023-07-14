import { history } from 'umi'
const { pathToRegexp } = require("path-to-regexp")
import api from 'api'
import store from 'store'
const { loginUser } = api

export default {
  namespace: 'login',

  state: {},
  // subscriptions: {
  //   setup({ dispatch, history }) {
  //     history.listen(location => {
  //       if (pathToRegexp('/login').exec(location.pathname)) {
  //       }
  //     })
  //   },
  // },
  effects: {
    *login({ payload }, { put, call, select }) {
      const data = yield call(loginUser, payload)
      const { locationQuery } = yield select(_ => _.app)
      if (data.success) {
        const { token } = data.data
        store.set('Token', token)
        const { from } = locationQuery
        yield put({ type: 'app/query' })
        if (!pathToRegexp('/login').exec(from)) {
          if (['', '/'].includes(from)) history.push('/pagecontrol')
          else history.push(from)
        } else {
          history.push('/pagecontrol')
        }
      } else {
        throw data
      }
    },
  },
}
