import Vue from 'vue'
import Vuex from 'vuex'
import * as actions from './actions'
import * as getters from './getters'
import state from './state'
import mutations from './mutations'
import createLogger from 'vuex/dist/logger'  // 通过mutation修改state时，会在控制台自动打印state的日志

Vue.use(Vuex);

const debug = process.env.NODE_ENV !== 'production' // 生产环境时关闭调试

export default new Vuex.Store({
  actions,
  getters,
  state,
  mutations,
  strict: debug, // 是否开启vuex严格模式(开启后如果state的修改不是经过mutation，就会报错)
  plugins:debug ? [createLogger()] : []
})
