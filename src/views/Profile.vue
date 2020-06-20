<template>
  <div>
    <h2>Profile</h2>
    {{user.data}}
  </div>
</template>

<script>

import {mapGetters} from 'vuex'

export default {
  computed: {
  ...mapGetters({
    user: 'autentikasi/user'
  })
},
}
</script>

<style>

</style>