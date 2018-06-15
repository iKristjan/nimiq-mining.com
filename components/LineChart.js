import {Line, mixins} from 'vue-chartjs'

const {reactiveProp} = mixins

export default {
  extends: Line,
  mixins: [reactiveProp],
  data() {
    return {
      options: {
        legend: {
          display: false
        },
        scales: {
          xAxes: [{
            type: 'time',
            display: true,
            time: {
              tooltipFormat: 'MM/DD/YYYY HH:mm',
              unit: 'hour'
            }
          }],
          yAxes: [{
            display: true,
            /*scaleLabel: {
              display: true,
              labelString: 'Hashrate'
            },*/
            ticks: {
              beginAtZero: true,
              suggestedMax: 1000000000,
              callback: this.friendlyHashrate
            }
          }]
        },
        tooltips: {
          mode: 'index',
          intersect: false,
          displayColors: false,
          callbacks: {
            label: this.friendlyHashrate
          }
        },
        responsive: true
      }
    }
  },
  mounted() {
    const gradient = this.$refs.canvas.getContext('2d').createLinearGradient(0, 0, 0, 600)
    gradient.addColorStop(0, '#3023AE')
    gradient.addColorStop(1, 'rgba(255,255,255,0)')
    this.$parent.gradient = gradient
    this.chartData.datasets[0].backgroundColor = gradient

    // this.chartData is created in the mixin.
    this.renderChart(this.chartData, this.options)
  },
  methods: {
    friendlyHashrate(input) {
      let value, percision
      if (typeof input === 'number') {
        value = input
        percision = 0
      }
      else {
        value = input.yLabel
        percision = 2
      }
      return this.$options.filters.friendlyHashrate(value, percision)
    }
  }
}
