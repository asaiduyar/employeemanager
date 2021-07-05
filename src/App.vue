<template>
  <div id="app">
    <Navbar />
    <div class="container">
      <keep-alive include="dashboard">
      <router-view></router-view>
    </keep-alive>
    </div>
  </div>
</template>

<script>
import Navbar from "./components/Navbar"
export default {
  name: 'App',
  components: {
    Navbar
  }
}
</script>

