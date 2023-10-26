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
  },

  {
    id: '7',
    name: 'support文章后台看板',
    zh: {
      name: 'support文章后台看板'
    },
    'pt-br': {
      name: 'support文章后台看板'
    },
    icon: 'dashboard',
    route: '/supportpage',
  },
  {
    id: '8',
    name: 'faq文章后台看板',
    zh: {
      name: 'faq文章后台看板'
    },
    'pt-br': {
      name: 'faq文章后台看板'
    },
    icon: 'dashboard',
    route: '/question',
  },
]

export default {
  menus: database
}