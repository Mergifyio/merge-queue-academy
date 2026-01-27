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
						fontFamily: 'IBM Plex Mono, SF Mono, monospace',
						themeVariables: {
							// Modern Editorial - warm dark theme
							fontFamily: 'IBM Plex Mono, SF Mono, monospace',
							// Backgrounds
							background: '#13151a',
							mainBkg: '#1a1d24',
							// Text
							primaryTextColor: '#f0f2f5',
							secondaryTextColor: '#13151a',
							tertiaryTextColor: '#13151a',
							textColor: '#f0f2f5',
							nodeTextColor: '#f0f2f5',
							// Primary accent - Amber
							primaryColor: '#f59e0b',
							primaryBorderColor: '#f59e0b',
							lineColor: '#5c6478',
							// Secondary - Blue
							secondaryColor: '#60a5fa',
							secondaryBorderColor: '#60a5fa',
							// Tertiary - Green
							tertiaryColor: '#4ade80',
							tertiaryBorderColor: '#4ade80',
							// Nodes and clusters
							nodeBorder: '#323846',
							nodeBkg: '#1a1d24',
							clusterBkg: '#21252e',
							clusterBorder: '#323846',
							titleColor: '#f0f2f5',
							edgeLabelBackground: '#1a1d24',
							// Sequence diagram
							actorBkg: '#1a1d24',
							actorBorder: '#323846',
							actorTextColor: '#f0f2f5',
							actorLineColor: '#323846',
							signalColor: '#5c6478',
							signalTextColor: '#f0f2f5',
							labelBoxBkgColor: '#1a1d24',
							labelBoxBorderColor: '#323846',
							labelTextColor: '#f0f2f5',
							loopTextColor: '#f0f2f5',
							noteBkgColor: '#fbbf24',
							noteTextColor: '#13151a',
							noteBorderColor: '#f59e0b',
							// State diagram
							labelColor: '#f0f2f5',
							// Gantt
							gridColor: '#323846',
							doneTaskBkgColor: '#4ade80',
							doneTaskBorderColor: '#22c55e',
							activeTaskBkgColor: '#f59e0b',
							activeTaskBorderColor: '#d97706',
							taskBkgColor: '#21252e',
							taskBorderColor: '#323846',
							taskTextColor: '#f0f2f5',
							taskTextDarkColor: '#f0f2f5',
							sectionBkgColor: '#1a1d24',
							sectionBkgColor2: '#21252e',
							todayLineColor: '#f87171',
							// Git graph
							git0: '#f59e0b',
							git1: '#60a5fa',
							git2: '#4ade80',
							git3: '#c084fc',
							git4: '#f87171',
							gitBranchLabel0: '#f0f2f5',
							gitBranchLabel1: '#f0f2f5',
							gitBranchLabel2: '#13151a',
							gitBranchLabel3: '#f0f2f5',
							commitLabelColor: '#f0f2f5',
							commitLabelBackground: '#1a1d24',
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
			components: {
				Header: './src/components/Header.astro',
				Footer: './src/components/Footer.astro',
			},
			customCss: ['./src/styles/custom-theme.css', './src/styles/mermaid.css'],
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
