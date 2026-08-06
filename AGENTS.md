## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

## Constraints

`public/_headers` sets a strict CSP: `script-src 'self'`, with no `'unsafe-inline'`. Inline
`<script>` blocks are refused by the browser in production. This does not show up during
development, because `astro dev` does not apply `_headers` — put page logic in a file under
`public/scripts/` and load it with `src` instead.

Wrangler v4 `kv` commands read and write **local** storage unless told otherwise. Pass
`--remote` to reach the real namespace:

```
npx wrangler kv key list --binding BITAQAT_KV --prefix "nlsub:" --remote
```

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)
