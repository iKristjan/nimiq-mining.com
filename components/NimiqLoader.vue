<template>
  <transition name="fade">
    <div
      v-if="status !== 'established' && status !== 'lost'"
      class="d-flex nimiq-loader">
      <div class="flex-fill align-self-center text-center">
        <ball-scale-ripple-loader
          color="#3023AE"/>
        <div>{{ status }}</div>
      </div>
    </div>
  </transition>
</template>

<script>
  import Vuex from 'vuex'
  import 'vue-loaders/dist/vue-loaders.css'
  import {BallScaleRippleLoader} from 'vue-loaders'

  export default {
    components: {
      BallScaleRippleLoader
    },
    computed: {
      ...Vuex.mapState(['status'])
    }
  }
</script>

<style>
  .nimiq-loader {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background: rgba(255, 255, 255, .9);
    z-index: 2;
    color: #3023AE;
    text-transform: capitalize;
  }

  .fade-enter-active, .fade-leave-active {
    transition: opacity .5s;
  }

  .fade-enter, .fade-leave-to {
    opacity: 0;
  }
</style>
