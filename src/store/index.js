import Vue from 'vue'
import Vuex from 'vuex'
import Axios from '../config/axiosInstance'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    products: [],
    charts: [],
    transactions: []
  },
  mutations: {
    fetchProducts (state, payload) {
      state.products = payload
    },
    fetchCharts (state, payload) {
      state.charts = payload
    },
    fetchTransactions (state, payload) {
      state.transactions = payload
    }
  },
  actions: {
    fetchProducts (context) {
      Axios({
        url: 'products',
        method: 'GET'
      })
        .then(res => {
          // console.log(res.data)
          context.commit('fetchProducts', res.data)
        })
        .catch(err => {
          context.commit('fetchProducts', err.response.data)
          // console.log(err.response.data)
        })
    },
    fetchCharts (context) {
      Axios({
        url: 'charts',
        method: 'GET',
        headers: {
          access_token: localStorage.getItem('access_token')
        }
      })
        .then(res => {
          // console.log(res.data)
          context.commit('fetchCharts', res.data)
        })
        .catch(err => {
          context.commit('fetchCharts', err.response.data)
          // console.log(err.response.data)
        })
    },
    fetchTransactions (context) {
      Axios({
        url: 'transactions/user',
        method: 'GET',
        headers: {
          access_token: localStorage.getItem('access_token')
        }
      })
        .then(res => {
          // console.log(res.data)
          context.commit('fetchTransactions', res.data)
        })
        .catch(err => {
          context.commit('fetchTransactions', err.response.data)
          // console.log(err.response.data)
        })
    }
  },
  modules: {
  }
})
