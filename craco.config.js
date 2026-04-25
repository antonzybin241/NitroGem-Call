const path = require('path');

/** Transpile this package with the app Babel preset (not dependencies-only). */
const TRANSPILE_PACKAGES = [
  'wallet-connect-modal',
  '@rive-app/canvas',
];

module.exports = {
  webpack: {
    configure(webpackConfig) {
      const oneOf = webpackConfig.module.rules.find((r) => r.oneOf)?.oneOf;
      if (!oneOf) return webpackConfig;

      const mainBabelRule = oneOf.find(
        (rule) =>
          rule.loader &&
          rule.loader.includes('babel-loader') &&
          rule.options &&
          Array.isArray(rule.options.presets) &&
          rule.options.presets.some((preset) => {
            const p = Array.isArray(preset) ? preset[0] : preset;
            return (
              typeof p === 'string' &&
              p.includes('babel-preset-react-app') &&
              !p.includes('dependencies')
            );
          })
      );

      if (!mainBabelRule || !mainBabelRule.include) return webpackConfig;

      const extra = TRANSPILE_PACKAGES.map((name) =>
        path.resolve(__dirname, 'node_modules', name)
      );

      mainBabelRule.include = Array.isArray(mainBabelRule.include)
        ? [...mainBabelRule.include, ...extra]
        : [mainBabelRule.include, ...extra];

      // @rive-app/canvas ships `||=` / `&&=` / `??=`; CRA4 Babel parser needs this.
      const logicalAssign = require.resolve(
        '@babel/plugin-proposal-logical-assignment-operators'
      );
      mainBabelRule.options.plugins = [
        logicalAssign,
        ...(mainBabelRule.options.plugins || []),
      ];

      return webpackConfig;
    },
  },
};
