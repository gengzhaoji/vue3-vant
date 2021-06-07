<template>
  <div id="app">
    <router-view v-slot="{ Component }">
      <transition :name="$store.state.states">
        <component
          :is="Component"
          v-if="!$route.meta.keepAlive"
        />
        <keep-alive v-else>
          <component :is="Component" />
        </keep-alive>
      </transition>
    </router-view>
  </div>
</template>

<script>
export default {
  name: "App",
  mounted() {
    var _this = this;
    window.addEventListener(
      "popstate",
      function(e) {
        _this.$store.commit("setTransition", "turn-off");
      },
      false
    );
  }
};
</script>

<style lang="scss">
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  width: 100%;
  height: 100%;
  overflow: hidden;
}
.turn-on-enter {
  transform: translate3d(100%, 0, 0);
}

.turn-on-enter-active,
.turn-on-leave-active {
  transition: transform 0.4s ease;
}
.turn-off-leave-to {
  transform: translate3d(100%, 0, 0);
}
.turn-off-enter-active,
.turn-off-leave-active {
  transition: transform 0.4s ease;
}
.turn-off-leave-active {
  z-index: 2;
}
</style>
