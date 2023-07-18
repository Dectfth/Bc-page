import { Constant } from './_utils'
const { ApiPrefix } = Constant

const database = [

  {
    id: '6',
    name: 'Bcpage',
    zh: {
      name: 'BC文章后台看板'
    },
    'pt-br': {
      name: 'BC文章后台看板'
    },
    icon: 'dashboard',
    route: '/pagecontrol',
  }
]

export default {
  menus: database
}