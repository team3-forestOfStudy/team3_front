module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    "react-app",
    "react-app/jest",
    "plugin:prettier/recommended"
  ],
  rules: {
    "prettier/prettier": "warn",
    "no-unused-vars": "warn"
  },
};