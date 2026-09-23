import { defineConfig } from 'astro/config';
import { unified } from '@astrojs/markdown-remark';
import { remarkStripFirstH1, remarkStripFooter, remarkPlates } from './src/lib/remark-article.mjs';

export default defineConfig({
  site: 'https://articles.cypresscommand.com',
  output: 'static',
  trailingSlash: 'always',
  build: { format: 'directory' },
  markdown: {
    processor: unified({ remarkPlugins: [remarkStripFirstH1, remarkStripFooter, remarkPlates] }),
  },
});
