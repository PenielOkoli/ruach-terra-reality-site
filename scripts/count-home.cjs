const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');
const { createLoader } = require('./ts-test-loader.cjs');

const Link = ({ children }) => React.createElement('a', null, children);
const SitePhoto = ({ number, caption }) => React.createElement('figure', null, React.createElement('figcaption', null, number, ' ', caption));
const load = createLoader({
  'next/image': { default: () => null },
  'next/link': { default: Link },
  '@/components/site-photo': { SitePhoto },
});

function count(file) {
  const html = renderToStaticMarkup(React.createElement(load(file).default));
  const text = html.replace(/<[^>]*>/g, ' ').replace(/&(?:amp|quot|#x27|lt|gt);/g, ' ').replace(/\s+/g, ' ').trim();
  return text.split(' ').length;
}
console.log(JSON.stringify({
  methodology: 'Homepage main content only; excludes shared navigation/footer. Static HTML text tokens, split on whitespace.',
  before: count('artifacts/design-review/home-before.tsx'),
  after: count('app/page.tsx'),
}, null, 2));
