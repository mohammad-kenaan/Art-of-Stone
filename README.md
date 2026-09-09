# Art Of Stone

Responsive multi-page website for an architectural stone installation company in Ontario, Canada.

## Stack

- HTML5
- Modern CSS
- Modern JavaScript (ES Modules, `const` / `let` only)
- Webpack 5
- Webpack Dev Server
- MiniCssExtractPlugin

## Development

Install dependencies once:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Webpack Dev Server watches HTML, CSS and JavaScript. Saving a file updates the development build automatically, so you do **not** need to run `npm run build` after every change.

## Production build

```bash
npm run build
```

The deployable website is generated in `dist/`.

## CSS-first loading strategy

The project is configured to prevent the brief flash of unstyled HTML that can happen when CSS is injected by JavaScript:

1. CSS is extracted into a real stylesheet in both development and production.
2. Webpack/HtmlWebpackPlugin places the stylesheet in the document `<head>`, so it is render-blocking and discovered before page content is painted.
3. JavaScript is emitted with `defer`, so it does not block HTML parsing or delay the stylesheet.
4. Above-the-fold hero images use `loading="eager"` and `fetchpriority="high"`.
5. Below-the-fold images remain lazy-loaded.
6. The site currently uses system font fallbacks, avoiding an extra render-blocking web-font request.

This setup is intentionally preferred over `style-loader` for this multi-page website because `style-loader` injects CSS through JavaScript and can cause a visible unstyled flash during page navigation.

## Scripts

- `npm run dev` — Webpack Dev Server with automatic rebuild/reload.
- `npm run build` — optimized production bundle in `dist/`.
- `npm run preview` — preview the production `dist/` folder.
- `npm run live` — optional legacy live-server workflow included for convenience.

## Notes before publishing

Replace demonstration images, testimonials, company contact details and project copy with verified Art Of Stone content and properly licensed photography before launch.
