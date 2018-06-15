import Vuex from 'vuex'
import { getField, updateField } from 'vuex-map-fields'

const createStore = () => {
  return new Vuex.Store({
    strict: true,
    state: {
      status: 'initializing',
      lastBlockHeight: null,
      lastBlockHashrate: null,
      lastBlockTimestamp: null,
      form: {
        hashingPower: 10,
        hashingPowerUnit: 'kh',
        usingPool: false,
        globalHashRate: 750,
        globalHashUnit: 'mh',
        blockReward: 4300,
        blockTime: 60,
        poolFee: 1,
        override: false,
        showCollapse: false
      },

    },
    mutations: {
      setStatus (state, value) {
        state.status = value
      },
      updateField
    },
    getters: {
      getField,
    }
  })
}

export default createStore
