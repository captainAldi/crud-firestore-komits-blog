import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import firebase from "firebase/app"
import 'firebase/auth'
import vuetify from './plugins/vuetify'

Vue.config.productionTip = false

const configOptions = {
  apiKey: "AIzaSyDvjWkV-7bWnEwo0WcWE3cPT6x5p7JhYJU",
  authDomain: "komits-blog.firebaseapp.com",
  databaseURL: "https://komits-blog.firebaseio.com",
  projectId: "komits-blog",
  storageBucket: "komits-blog.appspot.com",
  messagingSenderId: "116903385417",
  appId: "1:116903385417:web:c92ef40117921e7474a298",
  measurementId: "G-SC7EBE79RG"
};

firebase.initializeApp(configOptions);

// firebase.auth().onAuthStateChanged(user => {
//   store.dispatch("autentikasi/fetchUser", user);
// });

let app

firebase.auth().onAuthStateChanged(user => {
  store.dispatch("autentikasi/fetchUser", user);

  if(!app) {
    app = new Vue({
      router,
      store,
      vuetify,
      render: h => h(App)
    }).$mount('#app')
  }
})


