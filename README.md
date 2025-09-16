# Dynamic Atmospheres (p5.js)
Weather-driven generative art. Maps cloud cover, temperature, UV index, and wind to particle behavior using **p5.js**.

## Demo
https://jorge0576.github.io/dynamic-atmospheres-p5/

## How it works
- Tries live weather (if an API key is provided).
- If not available, loads `offline-weather-sample.json` so the sketch runs on GitHub Pages with no API key.

## Live data (optional with Weatherstack)
You can use **Weatherstack** for live data. Create a free API key at https://weatherstack.com/ after making an account. The free tier has a limited number of calls, and the Weatherstack dashboard lets you track each request so you can see when a call was made.  
**Do not commit keys.** Copy `config.example.js` → `config.js` locally and put your key there (it’s in `.gitignore`).
> Note: Some free plans restrict HTTPS. GitHub Pages is HTTPS-only, so if live calls fail, use the offline demo or deploy via Netlify/Vercel with a small proxy.

## Run locally
Use a local server (recommended), otherwise `fetch()` may be blocked on `file://`.
- **VS Code:** Right-click `index.html` → “Open with Live Server”
- **Python:** `python3 -m http.server 8000` → visit http://localhost:8000

## Files
- `index.html`, `p5.min.js`, `sketch.js`
- `config.example.js` → copy to `config.js` locally and add your API key (do **not** commit `config.js`)
- `offline-weather-sample.json` → tiny mock response for offline demo

## License
MIT
