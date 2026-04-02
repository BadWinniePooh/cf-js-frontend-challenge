import { importMapsPlugin } from '@web/dev-server-import-maps'

const testImportMappings = {
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
