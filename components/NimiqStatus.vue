<template>
  <span v-if="status !== 'established'">
    Status: <strong>{{ status }}</strong><nimiq-ellipsis v-if="status !== 'lost'"/>
    <span v-if="status === 'lost'"> &middot; <b-link @click="reloadPage">Reload page</b-link></span>
  </span>
  <span
    v-else
    class="nowrap">
    Global hashrate: <strong>{{ lastBlockHashrate | friendlyHashrate }}</strong> (#{{ lastBlockHeight }})
  </span>
</template>

<script>
  import {mapFields} from 'vuex-map-fields'
  import NimiqEllipsis from '~/components/NimiqEllipsis.vue'

  export default {
    components: {
      NimiqEllipsis
    },
    computed: {
      ...mapFields([
        'status',
        'lastBlockHeight',
        'lastBlockHashrate'
      ])
    },
    methods: {
      reloadPage() {
        if (process.browser) {
          window.location.reload(true)
        }
      }
    }
  }
</script>
