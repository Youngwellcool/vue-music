import 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import router from './router'
import fastclick from 'fastclick'

import 'common/stylus/index.styl'
Vue.config.productionTip = false

fastclick.attach(document.body) // 将fastclick应用到body上，可以消除body下面的元素3秒延迟点击的问题
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
