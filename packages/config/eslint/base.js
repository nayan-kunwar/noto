// Shared ESLint flat-config base. Apps extend this.
// Keep framework-independent; apps add react/expo plugins locally.
export default {
  languageOptions: { ecmaVersion: 2022, sourceType: 'module' },
  rules: {
    'no-unused-vars': 'off'
  }
};
