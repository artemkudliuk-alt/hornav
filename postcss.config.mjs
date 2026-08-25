import tailwindcss from '@tailwindcss/postcss';
import purgecss from '@fullhuman/postcss-purgecss';

export default {
  plugins: [
    tailwindcss(),
    purgecss({
      content: [
        './*.html',
        './index.html',
        './fleet.html',
        './vessel.html',
        './contacts.html',
        './src/**/*.html',
        './src/**/*.js',
        './src/**/*.ts',
        './src/**/*.jsx',
        './src/**/*.tsx'
      ],
      defaultExtractor: content => {
        return content.match(/[\w-/.:\[\]\(\)_#%]+(?<!:)/g) || [];
      },
      variables: true,
      safelist: {
        standard: ['active', 'visible', 'loading', 'error'],
        deep: [/^data-magnetic/]
      }
    })
  ]
};
