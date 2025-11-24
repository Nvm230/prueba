module.exports = {
  root: true,
  extends: ['universe/native', 'universe/shared/typescript-analysis'],
  rules: {
    'react-hooks/exhaustive-deps': 'warn'
  }
};
