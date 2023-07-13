import modelExtend from 'dva-model-extend'
const { pathToRegexp } = require("path-to-regexp")
import api from 'api'
import { pageModel } from 'utils/model'

const {
  queryPageList,
  createBcPage,
  removeBcPage
} = api

export default modelExtend(pageModel, {
  namespace: 'pagecontrol',

  state: {
    currentItem: {},
    modalOpen: false,
    modalType: 'create',
    selectedRowKeys: [],
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(location => {
        if (pathToRegexp('/pagecontrol').exec(location.pathname)) {
          const payload = { ...location.query, currentPage: 1, size: 10 } || { currentPage: 1, size: 10 };
          dispatch({
            type: 'query',
            payload,
          })
        }
      })
    },
  },

  effects: {
    *query({ payload = {} }, { call, put }) {
    
      const data = yield call(queryPageList, payload)
      console.log(data,'....');
      if (data && data.success) {
        yield put({
          type: 'querySuccess',
          payload: {
            list: data.data.data || [],
            pagination: {
              current: Number(payload.currentPage) || 1,
              pageSize: Number(payload.size) || 10,
              total: data.data.totalCount,
            },
          },
        })
      }
    },

    *delete({ payload }, { call, put, select }) {
      const data = yield call(removeBcPage, { id: payload })
      const { selectedRowKeys } = yield select(_ => _.user)
      if (data.success) {
        yield put({
          type: 'updateState',
          payload: {
            selectedRowKeys: selectedRowKeys.filter(_ => _ !== payload),
          },
        })
      } else {
        throw data
      }
    },


    *create({ payload }, { call, put }) {
      const data = yield call(createBcPage, payload)
      if (data.success) {
        yield put({ type: 'hideModal' })
      } else {
        throw data
      }
    },

    *update({ payload }, { select, call, put }) {
      const id = yield select(({ user }) => user.currentItem.id)
      const newUser = { ...payload, id }
      const data = yield call(createBcPage, newUser)
      if (data.success) {
        yield put({ type: 'hideModal' })
      } else {
        throw data
      }
    },
  },

  reducers: {
    showModal(state, { payload }) {
      return { ...state, ...payload, modalOpen: true }
    },

    hideModal(state) {
      return { ...state, modalOpen: false }
    },
  },
})
