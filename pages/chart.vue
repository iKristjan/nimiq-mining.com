<template>
  <b-container tag="main">
    <div class="text-center mb-5">
      <h1>Nimiq Global Hashrate Chart</h1>
      <p>Last 7 hours in real-time – Straight Outta Blockchain</p>
    </div>
    <div class="position-relative">
      <nimiq-loader/>
      <line-chart
        :chart-data="chartData"
        :height="200"/>
    </div>
  </b-container>
</template>

<script>
  import LineChart from '~/components/LineChart.js'
  import NimiqLoader from '~/components/NimiqLoader.vue'
  import {mapFields} from 'vuex-map-fields'

  export default {
    components: {
      LineChart,
      NimiqLoader
    },
    data() {
      return {
        title: 'Nimiq Global Hashrate Chart',
        description: 'Nimiq blockchain global hashrate chart for the last 7 hours in real-time.',
        chartData: null,
        gradient: null
      }
    },
    head () {
      return {
        titleTemplate: `${this.title} | %s`,
        meta: [
          { hid: 'description', name: 'description', content: this.description }
        ]
      }
    },
    computed: {
      ...mapFields(['lastBlockHeight'])
    },
    watch: {
      lastBlockHeight: function() {
        this.fillData()
      }
    },
    created: function() {
      this.fillData()
    },
    methods: {
      fillData() {
        this.chartData = {
          labels: this.$nimiqTimestamps,
          datasets: [
            {
              label: 'Global hashrate',
              backgroundColor: this.gradient,
              borderColor: '#3023AE',
              pointRadius: 0,
              hoverRadius: 0,
              hitRadius: 0,
              data: this.$nimiqHashrates
            }
          ]
        }
      },
      padNumber(number, digits) {
        let result = '' + number
        while (result.length < digits) {
          result = '0' + result
        }
        return result
      },
      friendlyHashrate(x, y) {
        let value = typeof x === "number" ? x : y.yLabel
        return this.$options.filters.friendlyHashrate(value)
      }
    }
  }
</script>
