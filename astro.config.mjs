// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import rehypeMermaid from 'rehype-mermaid';

// https://astro.build/config
export default defineConfig({
	markdown: {
		rehypePlugins: [
			[
				rehypeMermaid,
				{
					strategy: 'inline-svg',
					mermaidConfig: {
						theme: 'base',
						themeVariables: {
							// Nord Dark theme
							// Polar Night (backgrounds)
							background: '#2E3440',
							mainBkg: '#3B4252',
							// Snow Storm (text)
							primaryTextColor: '#ECEFF4',
							secondaryTextColor: '#2E3440',
							tertiaryTextColor: '#2E3440',
							textColor: '#ECEFF4',
							nodeTextColor: '#ECEFF4',
							// Frost (primary accents - blues)
							primaryColor: '#88C0D0',
							primaryBorderColor: '#88C0D0',
							lineColor: '#D8DEE9',
							// Aurora (secondary/tertiary)
							secondaryColor: '#A3BE8C',
							secondaryBorderColor: '#A3BE8C',
							tertiaryColor: '#EBCB8B',
							tertiaryBorderColor: '#EBCB8B',
							// Nodes and clusters
							nodeBorder: '#88C0D0',
							nodeBkg: '#3B4252',
							clusterBkg: '#2E3440',
							clusterBorder: '#4C566A',
							titleColor: '#ECEFF4',
							edgeLabelBackground: '#3B4252',
							// Sequence diagram
							actorBkg: '#3B4252',
							actorBorder: '#88C0D0',
							actorTextColor: '#ECEFF4',
							actorLineColor: '#4C566A',
							signalColor: '#D8DEE9',
							signalTextColor: '#ECEFF4',
							labelBoxBkgColor: '#3B4252',
							labelBoxBorderColor: '#81A1C1',
							labelTextColor: '#ECEFF4',
							loopTextColor: '#ECEFF4',
							noteBkgColor: '#EBCB8B',
							noteTextColor: '#2E3440',
							noteBorderColor: '#EBCB8B',
						},
					},
				},
			],
		],
	},
	integrations: [
		starlight({
			title: 'Merge Queue Academy',
			social: [],
			customCss: ['./src/styles/nord-theme.css', './src/styles/mermaid.css'],
			head: [
				{
					tag: 'script',
					attrs: { src: '/scripts/mermaid-zoom.js', defer: true },
				},
			],
			sidebar: [
				{
					label: 'Introduction',
					autogenerate: { directory: 'introduction' },
				},
				{
					label: 'Do You Need One?',
					autogenerate: { directory: 'decision' },
				},
				{
					label: 'Features',
					autogenerate: { directory: 'features' },
				},
				{
					label: 'Use Cases',
					autogenerate: { directory: 'use-cases' },
				},
				{
					label: 'Real World',
					autogenerate: { directory: 'real-world' },
				},
				{
					label: 'Getting Started',
					autogenerate: { directory: 'getting-started' },
				},
				{
					label: 'Best Practices',
					autogenerate: { directory: 'best-practices' },
				},
			],
		}),
	],
});
