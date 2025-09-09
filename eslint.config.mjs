import globals from 'globals'
import pluginJs from '@eslint/js'
import unusedImports from 'eslint-plugin-unused-imports'

export default [
  {
    ignores: [
      'src/config',
      'src/constants',
      'src/controllers',
      'src/exceptions',
      'src/middlewares',
      'src/migrations',
      'src/models',
      'src/routes',
      'src/seeders',
      'src/services',
      'src/storage',
      'src/utils',
      'src/validates'
    ]
  },
  {
    languageOptions: {
      globals: {
        ...globals.node,
        require: 'readonly',
        process: 'readonly',
        __dirname: 'readonly',
        module: 'readonly',
        __: 'readonly'
      }
    }
  },
  pluginJs.configs.recommended,
  {
    plugins: {
      'unused-imports': unusedImports
    },
    rules: {
      'no-unused-vars': ['warn', { argsIgnorePattern: '^(next|req|res)$' }],
      'no-undef': 'warn',
      eqeqeq: 'warn',
      'prefer-const': 'warn',
      'no-var': 'warn',
      'eol-last': ['warn', 'always'],
      'unused-imports/no-unused-imports': 'error'
    }
  }
]
