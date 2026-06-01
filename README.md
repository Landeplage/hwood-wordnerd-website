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
