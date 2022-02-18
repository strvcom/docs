/* eslint-disable node/no-unsupported-features/es-syntax */
import commonjs from '@rollup/plugin-commonjs'
import typescript from '@rollup/plugin-typescript'
import copy from 'rollup-plugin-copy'

import pkg from './package.json'

const config = [
  // CommonJS (for Node) and ES module (for bundlers) build.
  // (We could have three entries in the configuration array
  // instead of two, but it's quicker to generate multiple
  // builds from a single configuration where possible, using
  // an array for the `output` option, where we can specify
  // `file` and `format` for each target)
  {
    input: 'src/index.ts',
    output: [
      { file: pkg.main, format: 'cjs' },
      { file: pkg.module, format: 'es' },
    ],
    plugins: [
      copy({ targets: [{ src: 'src/static', dest: 'dist' }] }),
      commonjs(),
      typescript({ tsconfig: './tsconfig.json' }),
    ],
  },
]

export default config
