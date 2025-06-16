// src/styles/import-all-css.js

// Import semua file .css dari subfolder styles
const cssModules = import.meta.glob('./**/*.css', { eager: true });
