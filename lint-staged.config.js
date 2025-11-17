// @ts-check

/** @type {import("lint-staged").Configuration} */
const config = {
  "*.{js,jsx,ts,tsx}": [() => "tsc -b", "eslint . --fix --no-warn-ignored"],
  "*.{js,jsx,ts,tsx,md,html,css,json}": "prettier --write",
};
export default config;
