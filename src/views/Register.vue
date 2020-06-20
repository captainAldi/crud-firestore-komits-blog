<template>
  <div class="container">
    <h2>Register</h2>

    <v-form
      @submit.prevent="submit"
    >

      <v-text-field
        label="Name"
        type="text"
        v-model="form.name"
      ></v-text-field>

      <br>

     <v-text-field
        label="E-Mail"
        type="email"
        v-model="form.email"
      ></v-text-field>

      <br>

      <v-text-field
        label="Password"
        type="password"
        v-model="form.password"
      ></v-text-field>   

      <br>

      <v-btn
        type="submit"
      >
        Register
      </v-btn>   
    </v-form>


  </div>
</template>


<script>
import * as firebase from "firebase/app"
import 'firebase/auth'

import { mapActions } from 'vuex'

export default {
  data() {
    return {
      form: {
        name: "",
        email: "",
        password: ""
      },
      error: null
    };
  },
  methods: {
    ...mapActions({
        setAlert  : 'alert/set',
        fetchUser: 'autentikasi/fetchUser'
    }),

    async submit() {

      try {
        const data = await firebase.auth().createUserWithEmailAndPassword(this.form.email, this.form.password)
        
        await data.user
          .updateProfile({
            displayName: this.form.name
          })

        await firebase.auth().onAuthStateChanged(user => {
          this.fetchUser(user)
        })

        this.setAlert({
            status : true,
            color  : 'success',
            text  : 'Register Success',
        })

        this.$router.replace({name: 'Profile'})

      } catch (error) {
        this.error = error.message

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