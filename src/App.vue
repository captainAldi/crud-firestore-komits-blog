<template>
  <v-app>
    <v-app-bar
      app
      color="primary"
      dark
    >
      <div class="d-flex align-center">
        <v-img
          alt="Vuetify Logo"
          class="shrink mr-2"
          contain
          src="https://cdn.vuetifyjs.com/images/logos/vuetify-logo-dark.png"
          transition="scale-transition"
          width="40"
        />

        <v-img
          alt="Vuetify Name"
          class="shrink mt-1 hidden-sm-and-down"
          contain
          min-width="100"
          src="https://cdn.vuetifyjs.com/images/logos/vuetify-name-dark.png"
          width="100"
        />
      </div>


      <v-btn
        to="/"
        text
      >
        <span class="mr-1">Home</span>
      </v-btn>

      <template v-if="user.loggedIn">
        <div class="nav-item">{{user.data.displayName}}</div>
        
        <v-btn
          @click.prevent="signOut"
          text
        >
          <span class="mr-1">Sign Out</span>
        </v-btn>

        <v-btn
          to="/profile"
          text
        >
          <span class="mr-1">Profile</span>
        </v-btn>

      </template>

      <template v-else>
        <v-btn
          to="/login"
          text
        >
          <span class="mr-1">Login</span>
        </v-btn>
        <v-btn
          to="/register"
          text
        >
          <span class="mr-1">Register</span>
        </v-btn>
      </template>

      <v-btn
        to="/kegiatan"
        text
      >
        <span class="mr-1">Kegiatan</span>
      </v-btn> 

      <v-spacer></v-spacer>

      <v-btn
        href="https://github.com/vuetifyjs/vuetify/releases/latest"
        text
      >
        <span class="mr-2">Latest Release</span>
        <v-icon>mdi-open-in-new</v-icon>
      </v-btn>
    </v-app-bar>

    <v-content>
      <router-view/>
    </v-content>

    <alert />
  </v-app>
</template>

<script>
//import HelloWorld from './components/HelloWorld';
import { mapActions, mapGetters } from "vuex";
import * as firebase from  'firebase/app'
import 'firebase/auth'

export default {
  name: 'App',

  components: {
    Alert: () => import( /* webpackChunkName: "alert" */ '@/components/Alert.vue'),
  },

  data() {
    return {
      loggedIn: false
    }
  },

  computed: {
    ...mapGetters({
      user: 'autentikasi/user'
    }),

  },

  methods: {
    ...mapActions({
        setAlert  : 'alert/set',
        fetchUser : "autentikasi/fetchUser"
    }),
    async signOut() {
      try {
        await firebase.auth().signOut()
        this.$router.replace({name: 'login'})
        this.setAlert({
            status : true,
            color  : 'success',
            text  : 'Logged Out',
        })
      } catch (error) {
        this.setAlert({
          status : true,
          color  : 'error',
          text  : error.message,
        })
      }

    }
  }
};
</script>
