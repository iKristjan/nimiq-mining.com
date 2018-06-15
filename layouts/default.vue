<template>
  <div>
    <b-navbar
      tag="header"
      toggleable="md"
      type="dark"
      sticky>
      <b-navbar-brand href="/">Nimiq-Mining.com</b-navbar-brand>
      <b-navbar-toggle target="nav-collapse"/>

      <b-collapse
        id="nav-collapse"
        is-nav>
        <b-navbar-nav>
          <b-nav-item
            to="/"
            exact>Calculator</b-nav-item>
          <b-nav-item to="/chart">Chart</b-nav-item>
        </b-navbar-nav>

        <b-nav-text class="d-none d-md-inline-block ml-auto">
          <nimiq-status/>
        </b-nav-text>
      </b-collapse>
    </b-navbar>

    <b-navbar
      tag="header"
      toggleable="md"
      type="dark"
      class="navbar-second d-md-none">
      <b-nav-text class="m-auto">
        <nimiq-status/>
      </b-nav-text>
    </b-navbar>

    <nuxt/>

    <footer class="footer text-muted text-center mx-2 mt-4 mb-5">
      <div class="container">
        Built on top of the <a
          href="https://nimiq.com/"
          class="nowrap">Nimiq Blockchain</a>.<br class="d-block d-md-none">
        Community project by <a href="https://github.com/iKristjan">@iKristjan</a>. <br class="d-block d-md-none">
        <a href="https://github.com/iKristjan/nimiq-mining.com">Open Source</a>
      </div>
    </footer>
  </div>
</template>

<script>
  import Vue from 'vue'
  import {mapFields} from 'vuex-map-fields'
  import NimiqStatus from '~/components/NimiqStatus.vue'

  Vue.prototype.$nimiqHashrates = []
  Vue.prototype.$nimiqTimestamps = []
  Vue.prototype.$gradient = null

  /* global Nimiq */
  const $nimiq = {}
  export default {
    components: {
      NimiqStatus
    },
    computed: {
      ...mapFields([
        'status',
        'lastBlockHeight',
        'lastBlockHashrate',
        'lastBlockTimestamp'
      ])
    },
    created() {
      if (process.browser) {
        let vm = this
        Nimiq.init(async function() {
          vm.status = 'syncing'

          Nimiq.GenesisConfig.main()

          $nimiq.consensus = await Nimiq.Consensus.nano()
          $nimiq.blockchain = $nimiq.consensus.blockchain
          $nimiq.network = $nimiq.consensus.network

          $nimiq.consensus.on('established', () => vm.onConsensusEstablished())
          $nimiq.consensus.on('lost', () => vm.onConsensusLost())
          $nimiq.blockchain.on('head-changed', () => vm.onHeadChanged())

          $nimiq.network.connect()
        }, function(code) {
          switch (code) {
            case Nimiq.ERR_WAIT:
              alert('Error: Already open in another tab or window.')
              break
            case Nimiq.ERR_UNSUPPORTED:
              alert('Error: Browser not supported')
              break
            default:
              alert('Error: Nimiq initialization error')
              break
          }
        })
      }
    },
    methods: {
      trimData() {
        // Trim blocks to last 7 hours and keep it every 5 minutes.
        let i = this.$nimiqTimestamps.length
        const max = i - 1
        const cutTimestamp = this.$nimiqTimestamps[max] - (7 * 60 * 60 * 1000)
        let lastTimestamp = false
        while (i--) {
          let keep = false

          const timestamp = this.$nimiqTimestamps[i]
          const lastTimestampDate = lastTimestamp ? new Date(lastTimestamp) : false
          const lastTimestampMinutes = lastTimestampDate ? new Date(lastTimestampDate).getMinutes() : -1

          // Keep the ones that round up to 5 minutes or if it's already more than 6 minutes from last,
          // but not if it's the same minute as last one was, and fit into last 7 hours.
          const minutes = new Date(timestamp).getMinutes()
          if (((minutes % 5 === 0) || lastTimestamp > timestamp + (5 * 60 * 1000)) && lastTimestampMinutes !== minutes && cutTimestamp < timestamp) {
            keep = true
          }

          // Keep the last.
          if (!keep && i === max && lastTimestampMinutes !== minutes) {
            keep = true
          }

          // Keep and set variable.
          if (keep) {
            lastTimestamp = timestamp

            // If this is round 5 minutes and last one was in less than 2 minutes ago, remove that.
            /*const lastI = i+1
            if (lastI !== max && minutes % 5 === 0 && lastTimestamp > timestamp + (2 * 60 * 1000)) {
              this.$nimiqHashrates.splice(lastI, 1)
              this.$nimiqTimestamps.splice(lastI, 1)
            }*/
          }
          // Remove everything else.
          else {
            this.$nimiqHashrates.splice(i, 1)
            this.$nimiqTimestamps.splice(i, 1)
          }
        }

        this.onHeadChanged(true)
      },
      onConsensusEstablished() {
        this.status = 'established'
        this.trimData()
      },
      onConsensusLost() {
        this.status = 'lost'
      },
      onHeadChanged(first) {
        const block = $nimiq.blockchain.head
        const nBits = block.header.nBits
        const difficulty = Nimiq.BlockUtils.compactToDifficulty(nBits)
        const hashrate = difficulty * Math.pow(2, 16) / Nimiq.Policy.BLOCK_TIME
        const timestamp = block.timestamp * 1000

        if (!first) {
          this.$nimiqHashrates.push(hashrate)
          this.$nimiqTimestamps.push(timestamp)
        }

        if (this.status === 'established') {
          this.updateTitle(hashrate)
          if (!first) {
            this.trimData()
          }
          this.lastBlockHeight = block.height
          this.lastBlockHashrate = hashrate
          this.lastBlockTimestamp = timestamp
        }
      },
      updateTitle(hashrate) {
        hashrate = this.$options.filters.friendlyHashrate(hashrate)
        let suffix = document.title
        const parts = document.title.split('|')
        if (parts.length > 1) {
          suffix = parts[1].trim()
        }
        document.title = hashrate + ' | ' + suffix
      }
    }
  }
</script>

<style>
  html,
  body {
    font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-rendering: optimizeLegibility;
  }

  a,
  a:hover {
    color: #3023AE;
  }

  main {
    margin-top: 3rem;
  }

  .navbar {
    padding: .625rem 1rem;
    background-color: #3023AE;
    background-image: linear-gradient(30deg, #3023AE, #9C58CB);
  }

  .navbar-second {
    padding-left: .62rem;
    padding-right: .62rem;
  }

  .navbar-toggler {
    padding: .25rem .5rem;
  }

  .nowrap {
    white-space: nowrap;
  }

  .navbar-brand {
    padding-left: 48px;
    background-repeat: no-repeat;
    background-size: 34px 30px;
    background-position: left center;
    background-image: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="499" height="440"><path fill="%23FFC107" fill-rule="evenodd" d="M389 21c-6-12-23-21-36-21H145c-13 0-29 9-36 21L5 199c-6 11-6 30 0 41l104 178c7 12 23 21 36 21h208c14 0 30-9 36-21l104-178c7-11 7-30 0-41L389 21zM273 347v42h-39v-40c-24-3-52-13-70-30l25-39c21 15 38 23 57 23 23 0 33-9 33-28 0-40-106-39-106-111 0-38 23-65 61-73V51h39v40c25 3 44 16 59 32l-29 33c-15-13-27-20-44-20-19 0-29 8-29 26 0 37 105 34 105 110 0 37-21 67-62 75z"/></svg>');
    font-size: 17px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 1px;
    align-items: center;
    color: white;
  }

  @media (max-width: 991px) {
    .navbar-brand {
      margin-right: 0;
    }
  }

  .footer {
    font-size: 85%;
  }

  .footer a {
    font-weight: 500;
    color: #495057;
  }

  .footer a:hover {
    color: #3023AE;
  }
</style>
