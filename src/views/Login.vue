<template>
  <div class="container">
    <h2>Login</h2>

    <v-form
      @submit.prevent="submit"
    >
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
        Login
      </v-btn>   
    </v-form>
  </div>
</template>

<script>
import * as firebase from "firebase/app"
import "firebase/auth"

import { mapActions } from 'vuex'

export default {
  data() {
    return {
      form: {
        email: "",
        password: ""
      },
      error: null
    };
  },
  methods: {
    ...mapActions({
        setAlert  : 'alert/set',
    }),
   async submit() {

        try {
          
          await firebase.auth().signInWithEmailAndPassword(this.form.email, this.form.password)

          this.$router.replace({ name: 'Secret' })

          this.setAlert({
            status : true,
            color  : 'success',
            text  : 'Login Success',
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