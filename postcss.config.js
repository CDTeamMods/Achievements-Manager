// PostCSS Configuration - Achievements Manager

module.exports = {
  plugins: [
    require('autoprefixer')({
      overrideBrowserslist: ['last 2 Chrome versions'],
      grid: true,
      flexbox: 'no-2009',
    }),

    ...(process.env.NODE_ENV === 'production'
      ? [
          require('cssnano')({
            preset: [
              'default',
              {
                discardComments: {
                  removeAll: true,
                },
                normalizeWhitespace: true,
                colormin: true,
                convertValues: true,
                discardDuplicates: true,
                discardEmpty: true,
                mergeIdents: false,
                mergeRules: true,
                minifyFontValues: true,
                minifyGradients: true,
                minifyParams: true,
                minifySelectors: true,
                normalizeCharset: true,
                normalizeDisplayValues: true,
                normalizePositions: true,
                normalizeRepeatStyle: true,
                normalizeString: true,
                normalizeTimingFunctions: true,
                normalizeUnicode: true,
                normalizeUrl: true,
                orderedValues: true,
                reduceIdents: false,
                reduceInitial: true,
                reduceTransforms: true,
                svgo: true,
                uniqueSelectors: true,
              },
            ],
          }),
        ]
      : []),
  ],
};
