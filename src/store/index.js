import { createStore } from 'vuex'
import VuexPersistence from 'vuex-persistedstate'

const modulesFiles = require.context('./modules', true, /\.js$/);
const modules = modulesFiles.keys().reduce((modules, modulePath) => {
  // set './app.js' => 'app'
  const moduleName = modulePath.replace(/^\.\/(.*)\.\w+$/, '$1')
  const value = modulesFiles(modulePath)
  modules[moduleName] = value.default
  return modules
}, {})

export default createStore({
  state: {
    states: 'turn-on',
    radio: '1',
    token: 'ceshi'
  },
  getters: {},
  mutations: {
    setTransition(state, item) {
      state.states = item
    },
    radio(state, item) {
      state.radio = item
    }
  },
  actions: {},
  modules,
  plugins: [
    VuexPersistence({
      storage: window.localStorage,
      // 配置缓存的内容
      reducer(val) {
        return {
          // user: {
          //   size: val.user.size,
          //   token: val.user.token,
          // },
          // guarder: {
          //   moduleName: val.guarder.moduleName,
          //   indexPath: val.guarder.indexPath,
          // }
        }
      }
    })
  ]
})
