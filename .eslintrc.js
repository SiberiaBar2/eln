module.exports = {
  extends: [
    "plugin:@typescript-eslint/recommended",
    "prettier",
    "plugin:prettier/recommended",
  ],
  rules: {
    "prettier/prettier": ["error"],
    "max-len": [
      "error",
      {
        ignoreComments: true,
        code: 140,
      },
    ],
    "no-cond-assign": ["error", "always"],
    "accessor-pairs": "error",
    "guard-for-in": "error",
  },
};
