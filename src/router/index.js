import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Kegiatan from '../views/Kegiatan.vue'
import Login from '../views/Login.vue'
import Secret from '../views/Secret.vue'
import Register from '../views/Register.vue'
import Profile from '../views/Profile.vue'

import store from '../store/index'

Vue.use(VueRouter)

  const routes = [
  {
    path: '/kegiatan',
    name: 'Kegiatan',
    component: Kegiatan,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/secret',
    name: 'Secret',
    component: Secret,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/profile',
    name: 'Profile',
    component: Profile,
    meta: {
      requiresAuth: true
    }
  },
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
    component: Home
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  }
]

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {

  //Jika routing perlu login
  if (to.matched.some(record => record.meta.requiresAuth)) {
    //Jika User blm login
    if (!store.getters['autentikasi/user'].loggedIn) {
      // tampilkan pesan bahwa harus login dulu
      store.dispatch('alert/set', {
        status: true,
        text: 'Login first',
        color: 'error',
      })
      //redirect ke form login
      next('/login')
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router
