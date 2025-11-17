const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseUrl: "http://localhost:8000",
    specPattern: "cypress/e2e/**/*.spec.{js,jsx,ts,tsx}",
    supportFile: false,
    viewportWidth: 1280,
    viewportHeight: 800,
  },
});
