import { importMapsPlugin } from '@web/dev-server-import-maps'

const testImportMappings = {
  "../step-4/session-store.js": "./test/helpers/fake-session-store.js",
  "/__wds-outside-root__/1/step-4/session-store.js": "./test/helpers/fake-session-store.js",
  // Schema files import from the bare 'chai' specifier; remap to the browser-compatible build
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
  files: ['test/**/*.test.js', 'contracts/**/*.test.js'],
}
