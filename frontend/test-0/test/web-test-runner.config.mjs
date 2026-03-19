import {importMapsPlugin} from '@web/dev-server-import-maps'
// import { playwrightLauncher } from '@web/test-runner-playwright'

const testImportMappings = {
  // Add import maps here, in each test folder
}

const plugins = [
  importMapsPlugin({
    inject: {
      importMap: {
        imports: testImportMappings,
      },
    },
  }),
]

export default {
  plugins,
  nodeResolve: true,
  browserStartTimeout: 60000,
  testFramework: {
    config: {
      timeout: 3000,
    },
  },
  // browsers: [
  //   playwrightLauncher({product: 'chromium'}),
  // ],
  files: ['test/**/*.test.js'],
  // Add polyfills for fetch and other browser APIs
  polyfills: {
    fetch: true,
  },
  // Enable experimental features for better MSW support
  experimental: {
    modernWeb: true,
  },

}