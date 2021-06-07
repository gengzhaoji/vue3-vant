module.exports = {
  root: true,
  env: {
    node: true
  },
  'extends': [
    'plugin:vue/vue3-essential',
    'eslint:recommended'
  ],
  parserOptions: {
    parser: 'babel-eslint'
  },
  rules: {
    "indent": 0,
    "vue/script-indent": 0,
    "vue/require-prop-type-constructor": 0,
    "vue/no-use-v-if-with-v-for": 0,
    "no-console": 0,
    "no-trailing-spaces": 0,
    "no-multiple-empty-lines": 0,
    "no-extra-boolean-cast": 0,
    "valid-jsdoc": 0,
    "one-var": 0,
    "semi": 0,
    "no-new": 0,
    "no-extra-semi": 0,
    "keyword-spacing": 0,
    "space-before-function-paren": 0,
    "arrow-parens": 0,
    "generator-star-spacing": 0,
    "no-mixed-operators": 0,
    "padded-blocks": 0,
    "eol-last": 0,
    "object-curly-spacing": 0,
    "quotes": 0,
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off'
  }
}
