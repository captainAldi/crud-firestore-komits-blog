import Vue from 'vue'
import Vuex from 'vuex'
import autentikasi from '../store/autentikasi'
import alert from '../store/alert'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
    autentikasi,
    alert
  }
})
