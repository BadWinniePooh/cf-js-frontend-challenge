// Contract test against the real IndexedDB — no import map needed.
export default {
  nodeResolve: true,
  browserStartTimeout: 60000,
  testFramework: {
    config: {
      timeout: 5000,
    },
  },
  files: ['test/session-store.contract.test.js'],
}
