import { defineConfig } from 'astro/config';
import { remarkStripFirstH1, remarkStripFooter } from './src/lib/remark-article.mjs';

export default defineConfig({
  site: 'https://articles.cypresscommand.com',
  output: 'static',
  trailingSlash: 'always',
  build: { format: 'directory' },
  markdown: {
    remarkPlugins: [remarkStripFirstH1, remarkStripFooter],
  },
});
