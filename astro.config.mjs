// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeWrap from 'rehype-wrap';
import rehypeExternalLinks from 'rehype-external-links';

import mdx from '@astrojs/mdx';
import icon from 'astro-icon';
import expressiveCode from 'astro-expressive-code';

import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://koteiou.pages.dev/',
  markdown: {
    remarkPlugins: [remarkMath],
    rehypePlugins: [
      rehypeKatex,
      [
        rehypeWrap,
        {
          selector: 'table',
          wrapper: 'div.overflow-x-auto',
        },
      ],
      [
        rehypeExternalLinks,
        {
          target: '_blank',
          rel: ['noopener', 'noreferrer'],
        },
      ],
    ],
  },

  vite: {
    // @ts-ignore
    plugins: [tailwindcss()],
  },

  integrations: [expressiveCode({
    themes: ['github-dark'],
    styleOverrides: {
      borderRadius: '0',
      codeFontSize: '0.85rem',
      codePaddingInline: '1rem',
      frames: {
        editorActiveTabIndicatorTopColor: '#1a784f',
      },
    },
  }), mdx(), icon(), sitemap()],
});