import { apiPrefix } from 'utils/config'

export default {
  queryRouteList: '/routes',
// 要存isinit，visit 是菜单，还有role 是admin
  queryUserInfo: '/inner/user/userInfo',

  loginUser: 'POST /inner/user/login',
  
  logoutUser: '/api/v1/user/logout',
  queryUser: '/user/:id',
  queryUserList: '/users',
  updateUser: 'Patch /user/:id',
  createUser: 'POST /user',
  removeUser: 'DELETE /user/:id',
  removeUserList: 'POST /users/delete',

  queryPostList: '/posts',

  queryDashboard: '/api/v1/dashboard',
  queryPageList:`/manager/article/search`,
  createBcPage:`POST /manager/article/search/add/:id`,
  removeBcPage: `DELETE /manager/article/search/delete/:id`,
}
