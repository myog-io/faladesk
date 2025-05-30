const createExpoWebpackConfigAsync = require('@expo/webpack-config');
const path = require('path');

module.exports = async (env, argv) => {
  const config = await createExpoWebpackConfigAsync(env, argv);

  // Locate babel-loader and extend its include paths
  const rules = config.module.rules.flatMap((rule) => rule.oneOf || [rule]);
  const babelLoader = rules.find((rule) => {
    const use = rule.use;
    if (!use) return false;
    if (Array.isArray(use)) {
      return use.some((u) => u.loader && u.loader.includes('babel-loader'));
    }
    return use.loader && use.loader.includes('babel-loader');
  });

  if (babelLoader) {
    babelLoader.include = [
      babelLoader.include,
      // Transpile all gluestack-ui packages
      path.join(__dirname, 'node_modules/@gluestack-ui'),
    ];
  }

  return config;
};
