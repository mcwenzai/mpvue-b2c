import Vue from 'vue'
import App from './App'

import fly from "./utils/request";
import store from "./store"

import '../static/colorui/animation.wxss'
import '../static/colorui/main.wxss'
import '../static/colorui/icon.wxss'
import '../static/iconfont/iconfont.wxss'
import './style/main.css'
import qs from 'qs';
Vue.prototype.$qs = qs;

Vue.config.productionTip = false
Vue.prototype.$fly = fly;
Vue.prototype.$store = store
//Vue.prototype.$staticUrl = "http://static.golang365.com/";
App.mpType = 'app'
const app = new Vue(App)
app.$mount()
var backcolor = "#3197ed" //设置初始值
var background
globalData: {
  background: backcolor
}
