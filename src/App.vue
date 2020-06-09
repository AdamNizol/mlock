<template>
  <div id="app">
    <lock/>
  </div>
</template>

<script>
import lock from './components/lock.vue'

export default {
  name: 'App',
  components: {
    lock
  },
  mounted(){
    document.addEventListener('contextmenu', event => event.preventDefault());
  }
}
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  background-color: rgb(60,60,65);
}
body, html {
  padding: 0;
  margin: 0;
}
</style>
