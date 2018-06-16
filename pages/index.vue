<template>
  <b-container
    tag="main"
    fluid>
    <div class="text-center mb-5">
      <h1>Nimiq Mining Calculator</h1>
      <p>Discover your estimated cryptocurrency earnings</p>
    </div>
    <div class="row justify-content-md-center">
      <div class="col-md-5 col-lg-4 mb-3">
        <div class="card">
          <div class="card-header text-center">
            <strong>Calculator</strong>
          </div>
          <div class="card-body">
            <form
              autocomplete="off"
              novalidate>

              <div class="form-row form-group">
                <div class="col">
                  <label for="hashingPower">Hashing power</label>
                  <input
                    id="hashingPower"
                    v-model.number="hashingPower"
                    type="number"
                    class="form-control"
                    required>
                </div>
                <div class="col-auto">
                  <label
                    for="hashingPowerUnit"
                    class="invisible">Hash unit</label>
                  <select
                    id="hashingPowerUnit"
                    v-model="hashingPowerUnit"
                    class="form-control">
                    <option value="h">H/s</option>
                    <option value="kh">KH/s</option>
                    <option value="mh">MH/s</option>
                    <option value="gh">GH/s</option>
                    <option value="th">TH/s</option>
                  </select>
                </div>
              </div>

              <div class="form-row form-group align-items-center">
                <div class="col">
                  <div class="custom-control custom-checkbox">
                    <input
                      id="usingPool"
                      v-model="usingPool"
                      type="checkbox"
                      class="custom-control-input">
                    <label
                      class="custom-control-label"
                      for="usingPool">Using pool</label>
                  </div>
                </div>

                <div
                  :style="{ visibility: usingPool ? 'visible' : 'hidden' }"
                  class="col-auto form-row">
                  <label
                    for="poolFee"
                    class="col-auto col-form-label">Fee</label>
                  <div class="col-auto">
                    <div class="input-group">
                      <input
                        id="poolFee"
                        v-model="poolFee"
                        type="number"
                        class="form-control"
                        required>
                      <div class="input-group-append">
                        <span class="input-group-text">%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <hr class="mb-3">

              <p class="mb-0">
                <b-link
                  :class="showCollapse ? 'collapsed' : null"
                  :aria-expanded="showCollapse ? 'true' : 'false'"
                  aria-controls="advanced"
                  class="advanced-toggle"
                  @click="showCollapse = !showCollapse">
                  Advanced options
                </b-link>
              </p>
              <b-collapse
                id="advanced"
                v-model="showCollapse">
                <div class="custom-control custom-checkbox form-group pt-3">
                  <input
                    id="override"
                    v-model="override"
                    type="checkbox"
                    class="custom-control-input">
                  <label
                    class="custom-control-label"
                    for="override">Override real-time data</label>
                </div>

                <div class="form-row form-group">
                  <div class="col">
                    <label for="globalHashRate">Global hashrate</label>
                    <input
                      id="globalHashRate"
                      v-model.number="globalHashRate"
                      :disabled="!override"
                      type="number"
                      class="form-control"
                      required>
                  </div>
                  <div class="col-auto">
                    <label
                      for="globalHashUnit"
                      class="invisible">Hash unit</label>
                    <select
                      id="globalHashUnit"
                      v-model="globalHashUnit"
                      :disabled="!override"
                      class="form-control">
                      <option value="h">H/s</option>
                      <option value="kh">KH/s</option>
                      <option value="mh">MH/s</option>
                      <option value="gh">GH/s</option>
                      <option value="th">TH/s</option>
                    </select>
                  </div>
                </div>

                <div class="form-row form-group mb-0">
                  <div class="col-7">
                    <label for="blockReward">Block reward</label>
                    <div class="input-group">
                      <input
                        id="blockReward"
                        v-model="blockReward"
                        :disabled="!override"
                        type="number"
                        class="form-control"
                        required>
                      <div class="input-group-append">
                        <span class="input-group-text">NIM</span>
                      </div>
                    </div>
                  </div>
                  <div class="col-5">
                    <label for="blockTime">Block time</label>
                    <div class="input-group">
                      <input
                        id="blockTime"
                        v-model="blockTime"
                        :disabled="!override"
                        type="number"
                        class="form-control"
                        required>
                      <div class="input-group-append">
                        <span class="input-group-text">s</span>
                      </div>
                    </div>
                  </div>
                </div>
              </b-collapse>
            </form>
          </div>
        </div>
      </div>
      <div class="col-md-5 col-lg-4 mb-3 second-block">
        <b-card
          no-body
          header="Results"
          class="text-center">
          <div slot="header">
            <strong>Estimated earnings</strong>
          </div>
          <b-card-body class="position-relative text-center">
            <no-ssr>
              <nimiq-loader v-if="!override && !recentData"/>
            </no-ssr>

            <div v-show="!usingPool">
              <p class="mb-0">1 block every {{ results.solo }}
                <b-badge
                  v-if="results.oneHundred"
                  variant="warning">100%
                </b-badge>
              </p>
              <hr class="m-4">
            </div>

            <p>{{ results.hour.mined | nim }}/hour
              <b-badge
                v-if="results.oneHundred"
                variant="warning">100%
              </b-badge>
            </p>
            <p>{{ results.day.mined | nim }}/day
              <b-badge
                v-if="results.oneHundred"
                variant="warning">100%
              </b-badge>
            </p>
            <p class="mb-0">{{ results.month.mined | nim }}/month
              <b-badge
                v-if="results.oneHundred"
                variant="warning">100%
              </b-badge>
            </p>
          </b-card-body>
        </b-card>
      </div>
    </div>
  </b-container>
</template>

<script>
  import NimiqLoader from '~/components/NimiqLoader.vue'
  import {mapFields} from 'vuex-map-fields'

  /* global Nimiq */
  export default {
    components: {
      NimiqLoader
    },
    filters: {
      nim: function (value) {
        if (typeof value !== "number") {
          return value
        }
        if (value >= 1000000000) {
          value = (value / 1000000000).toFixed(1).replace(/\.0$/, '') + 'B'
        }
        else if (value >= 1000000) {
          value = (value / 1000000).toFixed(1).replace(/\.0$/, '') + 'M'
        }
        else if (value >= 1000) {
          value = (value / 1000).toFixed(1).replace(/\.0$/, '') + 'K'
        }
        else if (value <= 0) {
          value = 0
        }
        else {
          value = value.toFixed(2).replace(/\.0$/, '')
        }
        return `${value} NIM`
      }
    },
    data() {
      return {
        title: 'Nimiq Mining Calculator',
        description: 'Mining calculator for Nimiq (NIM) cryptocurrency. Discover your estimated earnings in solo or pool mining using real-time data from blockchain.',
        recentData: false
      }
    },
    head() {
      return {
        titleTemplate: `${this.title} | %s`,
        meta: [
          {hid: 'description', name: 'description', content: this.description}
        ]
      }
    },
    computed: {
      ...mapFields([
        'status',
        'lastBlockHeight',
        'lastBlockHashrate',
        'lastBlockTimestamp',
        'form.hashingPower',
        'form.hashingPowerUnit',
        'form.usingPool',
        'form.globalHashRate',
        'form.globalHashUnit',
        'form.blockReward',
        'form.blockTime',
        'form.poolFee',
        'form.override',
        'form.showCollapse'
      ]),
      results: function () {
        let _hashRate = this.convertHashrate(this.hashingPower, this.hashingPowerUnit)
        const myWinProbability = _hashRate / this.convertHashrate(parseFloat(this.globalHashRate), this.globalHashUnit)
        const expectedHashTime = (1 / myWinProbability) * parseFloat(this.blockTime)
        const numWinning = (3600 / expectedHashTime)

        let minedPerHour = parseFloat(numWinning) * parseFloat(this.blockReward)
        let poolFeePerHour = parseFloat(minedPerHour) * parseFloat(this.poolFee) / 100

        if (this.usingPool) {
          minedPerHour -= poolFeePerHour
        }

        // Max NIM.
        let oneHundred = false
        const max = 3600 / parseFloat(this.blockTime) * parseFloat(this.blockReward)
        if (minedPerHour > max) {
          minedPerHour = max
          oneHundred = true
        }

        // Expected single block mining time.
        let soloBlockMined
        if (!Number.isFinite(expectedHashTime)) {
          soloBlockMined = '∞ years'
        }
        else {
          let timesteps = [
            {unit: 'minutes', factor: 60},
            {unit: 'hours', factor: 60},
            {unit: 'days', factor: 24},
            {unit: 'months', factor: 365 / 12},
            {unit: 'years', factor: 12},
            {unit: 'decades', factor: 10}
          ]
          let convertedTime = expectedHashTime
          let unit = 'seconds'
          for (let i = 0; i < timesteps.length; ++i) {
            let timestep = timesteps[i]
            if (convertedTime / timestep.factor < 1) {
              break
            }
            else {
              convertedTime /= timestep.factor
              unit = timestep.unit
            }
          }

          // Min blockMined.
          if (unit === 'seconds' && convertedTime < parseFloat(this.blockTime)) {
            convertedTime = this.blockTime
          }

          let fraction = 1
          if (unit === 'seconds' || unit === 'minutes') {
            convertedTime = Math.round(convertedTime)
          }
          else {
            convertedTime = convertedTime.toFixed(fraction)
          }

          soloBlockMined = convertedTime + ' ' + unit
        }

        return {
          hour: {
            mined: minedPerHour || 0,
          },
          day: {
            mined: minedPerHour * 24 || 0,
          },
          week: {
            mined: minedPerHour * 24 * 7 || 0,
          },
          month: {
            mined: minedPerHour * 24 * 30 || 0,
          },
          year: {
            mined: minedPerHour * 24 * 365 || 0,
          },
          solo: soloBlockMined,
          oneHundred: oneHundred
        }
      }
    },
    watch: {
      lastBlockHeight: function () {
        this.setRealTimeData()
      },
      override: function (value) {
        if (!value) {
          this.setRealTimeData()
        }
      }
    },
    created() {
      // If it's been less than 30 minutes, don't allow seeing results while syncing.
      if (this.lastBlockTimestamp > (Date.now() - (30 * 60 * 1000))) {
        this.recentData = true
      }

      // Show collapse if real-time data is overridden.
      this.showCollapse = this.override

      // Update data when navigating form another route.
      this.setRealTimeData()
    },
    methods: {
      setRealTimeData() {
        if (this.lastBlockHashrate) {
          let hashrate = this.lastBlockHashrate
          const blockHeight = this.lastBlockHeight

          if (!this.override) {
            // Set hashrate.
            let steps = ['kh', 'mh', 'gh', 'th']
            let unit
            // eslint-disable-next-line
            for (let i = 0, step; step = steps[i]; ++i) {
              if (hashrate / 1000 < 1) {
                break
              } else {
                hashrate /= 1000
                unit = step
              }
            }

            this.globalHashRate = hashrate.toFixed(2)
            this.globalHashUnit = unit

            if (Nimiq.Policy !== undefined) {
              const currentSupply = Nimiq.Policy.supplyAfter(blockHeight - 1)
              this.blockReward = Nimiq.Policy._blockRewardAt(currentSupply, blockHeight) / 100000
              this.blockTime = Nimiq.Policy.BLOCK_TIME
            }
          }
        }
      },
      convertHashrate(hashrate, unit) {
        hashrate = parseFloat(hashrate)

        switch (unit) {
          case 'h':
            return hashrate
          case 'kh':
            return hashrate * 1000
          case 'mh':
            return hashrate * 1000000
          case 'gh':
            return hashrate * 1000000000
          case 'th':
            return hashrate * 1000000000000000
        }
      },
      formatNumber(num, price) {
        let _num = num

        if (price) {
          if (Math.abs(_num) >= 0.009) {
            _num = num.toFixed(2)
          }

          if (Math.abs(_num) < 0.009) {
            _num = num.toFixed(6)
          }

          if (_num === 0) {
            _num = 0
          }
        }
        else {
          if (Math.abs(_num) < 1) {
            _num = parseFloat(num.toFixed(6))
          }

          if (Math.abs(_num) > 1) {
            _num = parseFloat(num.toFixed(0))
          }
        }
        return _num
      }
    }
  }
</script>

<style>
  main.container-fluid {
    max-width: 1140px;
  }

  #poolFee {
    width: 50px;
  }

  .btn-primary {
    background-color: #9C58CB !important;
    background-image: linear-gradient(30deg, #3023AE, #9C58CB);
  }

  .btn-primary:not(:disabled):not(.disabled).active,
  .btn-primary:not(:disabled):not(.disabled):active,
  .show > .btn-primary.dropdown-toggle {
    background-image: none;
  }

  hr {
    border-top: none;
    height: 1px;
    background: linear-gradient(to right, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.2) 50%, rgba(0, 0, 0, 0) 100%);
  }

  hr.m-4 {
    margin-top: 26px !important;
    margin-bottom: 26px !important;
  }

  .card-header {
    text-transform: uppercase;
    background: #3023AE;
    color: white;
    font-size: .9em;
  }

  .card {
    border-color: #3023AE;
  }

  .second-block .card-header {
    background: #9C58CB;
  }

  .second-block .card {
    border-color: #9C58CB;
  }

  .advanced-toggle {
    padding-left: 15px;
    background-repeat: no-repeat;
    background-position: left center;
    background-image: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 8 8"><path fill="%233023AE" d="M2 0v8l4-4-4-4z"></path></svg>');
  }

  .advanced-toggle.collapsed {
    background-image: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 8 8"><path fill="%233023AE" d="M0 2l4 4 4-4h-8z"></path></svg>');
  }
</style>
