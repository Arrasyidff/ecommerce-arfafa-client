import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Transaction from '../views/Transaction.vue'
import Charts from '../views/Charts.vue'
import Products from '../views/Products.vue'
import Detail from '../views/Detail.vue'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import NotFound from '../views/NotFound.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/register',
    name: 'Register',
    component: Register
  },
  {
    path: '/',
    name: 'Home',
    redirect: '/products',
    component: Home,
    children: [
      {
        path: 'products',
        name: 'Products',
        component: Products
      },
      {
        path: 'transaction',
        name: 'Transaction',
        component: Transaction
      },
      {
        path: 'charts',
        name: 'Charts',
        component: Charts
      },
      {
        path: 'product-:id',
        name: 'Product Detail',
        component: Detail
      }
    ]
  },
  {
    path: '*',
    name: 'NotFound',
    component: NotFound
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('access_token')
  if (to.name === 'Charts' && !isAuthenticated) next({ name: 'Login' })
  if (to.name === 'Transaction' && !isAuthenticated) next({ name: 'Products' })
  if (to.name === 'Login' && isAuthenticated) next({ name: 'Products' })
  if (to.name === 'Register' && isAuthenticated) next({ name: 'Products' })
  else next()
})

export default router
