import createPersistedState from 'vuex-persistedstate'

export default ({store}) => {
  createPersistedState({
    paths: [
      'form',
      'lastBlockHeight',
      'lastBlockHashrate',
      'lastBlockTimestamp'
    ]
  })(store)
}
