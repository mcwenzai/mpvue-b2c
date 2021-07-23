import Vue from 'vue'
import Vuex from 'vuex'

import createPersistedState from "vuex-persistedstate";

import actions from "./actions.js";
import getters from "./getters.js";
// import mutations from './mutations.js'

Vue.use(Vuex)

const state = {
  isLogin: false,
  userInfo: {
    nickName: "",
    avatarUrl: ""
  },
  loginData: {},
  cart: 0,
  cartList: [],
  orderGoods: [],
  cartPrice: 0,
  cartCount: () => {
    let sum = 0
    // state.cartList.forEach(item => {
    //   sum += item.count;
    // });
    return sum
  } 
};

export default new Vuex.Store({
  state,
  getters,
  actions,
  mutations: {
    update(state, config) {
      Object.keys(config).map((item, key) => {
        state[item] = config[item]
      })
    }
  },
  plugins: [
    createPersistedState({
      storage: {
        getItem: key => wx.getStorageSync(key),
        setItem: (key, value) => wx.setStorageSync(key, value),
        removeItem: key => wx.removeStorageSync(key)
      }
    })
  ]
});