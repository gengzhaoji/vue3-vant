import VueModule from './login'

VueModule.install = function (Vue) {
  Vue.component(VueModule.name, VueModule)
}
export default VueModule
