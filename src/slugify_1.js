// frontend/src/utils/slugify.js
// MUST match backend/utils/slugify.js exactly.
// Use this whenever building a brand URL or comparing a slug.

export const slugify = (str) => {
  if (!str) return '';
  return str
    .toString()
    .toLowerCase()
    .trim()
    .normalize('NFD')                  // separates accents (é → e + ´)
    .replace(/[\u0300-\u036f]/g, '')   // removes accent marks
    .replace(/[^a-z0-9]+/g, '');       // removes anything that's not a letter/number
};

export default slugify;
