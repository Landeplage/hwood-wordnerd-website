# Wordnerd 3D — website

Static marketing site for Wordnerd 3D. Jekyll under the hood, hosted on GitHub Pages.

## Running locally

Requires Docker Desktop.

```sh
docker compose up
```

Then open <http://localhost:4000>.

- File changes trigger a Jekyll rebuild; the browser auto-reloads via livereload on port 35729.
- First run takes ~2 minutes (apt packages + bundle install). After that, restarts are seconds — gems are cached in a named Docker volume.
- `Ctrl+C` to stop the dev server.
- `docker compose down` to remove the container (the gem cache survives in the named volume).
- `docker compose down -v` if you want to wipe the gem cache too and rebuild from scratch.

File watching uses `--force_polling` to work across the Windows ↔ Linux bind mount, so rebuilds can be a beat slower than native, but they do fire on save.

## Deploying

Push to `main`. GitHub Pages rebuilds automatically — no separate CI step.

## Adding a page

- HTML page: drop `<name>/index.html` with `layout: default` front matter.
- Markdown page: drop `<name>/index.md` with `layout: markdown` front matter — it gets wrapped in `.container.content` automatically.
- Nav and footer live in `_includes/nav.html` and `_includes/footer.html`.
- Front matter is just `layout:` — everything else is derived. Add `noindex: true` for pages that shouldn't be indexed, and `translated: [en]` for pages that only exist in some languages.

## Localization

English is the default and is served unprefixed at the site root. Every other language lives under `/<code>/`, using ISO 639-1 codes (Norwegian Bokmål is **`nb`**, not `no`).

Short pages keep their markup in `_includes/pages/` and their copy in `_data/i18n/<code>.yml`, so the markup exists once. Long-form pages (press, privacy, terms) are whole Markdown files per language — prose, not string tables.

```
_data/i18n/en.yml         strings + image paths, per language
_includes/i18n.html       defines lang / t / t_en / prefix / ref / tkey — include it first
_includes/lang_url.html   '/support/' -> '/nb/support/'
_includes/pages/*.html    shared markup for the short pages
content/img/<code>/       per-language artwork
nb/…                      Norwegian page shells + long-form Markdown
```

The per-language shells under `nb/` are identical to their English counterparts, and that's expected — they're routing stubs, not content. Jekyll only emits a page where a source file exists, so deleting one deletes that Norwegian page. `i18n.html` derives `ref` (the language-independent path: `/nb/support/` → `/support/`) and `tkey` (which block of the string table holds the copy) from the URL, so the stubs carry no metadata that can drift.

In a template, read strings through the fallback chain so a missing translation degrades to English rather than to a blank:

```liquid
{% raw %}{% include i18n.html %}
{{ t.nav.support | default: t_en.nav.support }}
<a href="{% include lang_url.html path='/support/' %}">…</a>{% endraw %}
```

Two gotchas worth knowing:

- The Liquid `default` filter treats an empty string as missing, so never write `""` in a YAML table to mean "intentionally blank".
- Liquid ends a `{% raw %}{{ … }}{% endraw %}` at the first single `}`, so string literals in templates can't contain one. That's why the copy placeholders are `[name]`, `[email]`, `[studio]` rather than `{name}`-style braces.

### Adding a language

1. Add the ISO 639-1 code to `languages:` in `_config.yml`, and a `defaults:` scope mapping `path: "<code>"` to `lang: <code>`.
2. Copy `_data/i18n/en.yml` to `_data/i18n/<code>.yml` and translate. Add the new code to the `lang_names:` block in *every* language file, so each one can name it in the switcher.
3. Create `content/img/<code>/` and add localized artwork (`app_store_badge.svg`, `og-image.png`, `screenshot01-03.png`). Leave the `images:` keys out of the YAML until the matching file exists — the English asset is served in the meantime.
4. Copy the page shells into `<code>/`: `index.html`, `support/index.html`, `invite/index.html`. Copy them verbatim — they're identical in every language. Jekyll only emits a page where a source file exists, so these stubs are what create the routes; `lang`, `ref` and `tkey` are all derived.
5. Translate the long-form Markdown into `<code>/press/`, `<code>/privacy/`, `<code>/terms/`. If one isn't ready, skip the file and set `translated: [en]` on the English counterpart so it stops advertising a nonexistent alternate.

`.well-known/apple-app-site-association` needs **no** change — its `/*/invite*` patterns already cover every language prefix.
