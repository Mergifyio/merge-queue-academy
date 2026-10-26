import { defineRouteMiddleware } from '@astrojs/starlight/route-data';

const SITE = 'https://merge-queue.academy';
const DEFAULT_IMAGE = `${SITE}/og-default.png`;

const MERGIFY = {
	'@type': 'Organization',
	name: 'Mergify',
	url: 'https://mergify.com',
};

type HeadEntry = { tag: string; attrs?: Record<string, string | boolean | undefined>; content?: string };

function findMeta(head: HeadEntry[], property: string) {
	return head.find((entry) => entry.tag === 'meta' && entry.attrs?.property === property);
}

// A lesson page is an article unless it is the splash homepage, it
// canonicals to mergify.com/learn (the overlap pages, whose structured data
// lives on the canonical target), or its frontmatter declares another
// og:type (the final quiz says "website").
function isArticle(route: App.Locals['starlightRoute']): boolean {
	const data = route.entry.data;
	if (data.template === 'splash') return false;
	const ownHead = (data.head ?? []) as HeadEntry[];
	const offsiteCanonical = ownHead.some(
		(entry) =>
			entry.tag === 'link' &&
			entry.attrs?.rel === 'canonical' &&
			!String(entry.attrs?.href ?? '').startsWith(SITE),
	);
	if (offsiteCanonical) return false;
	const ogType = findMeta(ownHead, 'og:type');
	return !ogType || ogType.attrs?.content === 'article';
}

export const onRequest = defineRouteMiddleware((context) => {
	const route = context.locals.starlightRoute;
	if (!isArticle(route)) return;

	const head = route.head as HeadEntry[];
	// Replace rather than mutate: the entry may come from the shared config
	// head, and mutating it would leak "article" onto every later page.
	const ogTypeIndex = head.findIndex((entry) => entry.tag === 'meta' && entry.attrs?.property === 'og:type');
	if (ogTypeIndex !== -1) {
		head[ogTypeIndex] = { tag: 'meta', attrs: { property: 'og:type', content: 'article' } };
	}

	const url = new URL(context.url.pathname, SITE).href;
	const image = String(findMeta(head, 'og:image')?.attrs?.content ?? DEFAULT_IMAGE);
	const schema = {
		'@context': 'https://schema.org',
		'@type': 'Article',
		headline: route.entry.data.title,
		description: route.entry.data.description,
		url,
		mainEntityOfPage: url,
		image,
		inLanguage: 'en',
		author: MERGIFY,
		publisher: MERGIFY,
		isPartOf: { '@type': 'WebSite', name: 'Merge Queue Academy', url: `${SITE}/` },
	};

	head.push({
		tag: 'script',
		attrs: { type: 'application/ld+json' },
		// Escape "<" so a title can never close the script tag.
		content: JSON.stringify(schema).replace(/</g, '\\u003c'),
	});
});
