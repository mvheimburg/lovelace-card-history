// Renders the README images from the built card with simulated Home Assistant
// data (generic names, no real home), and the icon.
const { chromium } = require("playwright");
const { readFileSync, mkdirSync } = require("node:fs");
const { resolve } = require("node:path");

const root = resolve(__dirname, "..");
const light = `--primary-text-color: #1b1f24; --secondary-text-color: #5b6470; --card-background-color: #fff; --secondary-background-color: #f1f3f5; --primary-color: #2f6fd6; background: #e9ecef;`;
const dark = `--primary-text-color: #e6e9ee; --secondary-text-color: #9aa4b1; --card-background-color: #1a1f27; --secondary-background-color: #232a34; --primary-color: #7aa7ff; --red-color: #ff6b70; --blue-color: #38b6f5; --green-color: #5fd08f; background: #101318;`;

async function shot(browser, errors, file, theme, configs) {
  const page = await browser.newPage({ viewport: { width: 1000, height: 700 }, deviceScaleFactor: 1 });
  page.on("pageerror", (e) => errors.push(e.message));
  await page.setContent(`<style>body{margin:0;padding:24px;font:15px system-ui,sans-serif;${theme}} main{display:flex;gap:24px;align-items:flex-start;flex-wrap:wrap} main>*{flex:0 0 460px}</style><main></main>`);
  await page.addScriptTag({ type: "module", content: readFileSync(resolve(root, "dist/lovelace-card-history.js"), "utf8") });
  await page.evaluate(async (configs) => {
    await customElements.whenDefined("lovelace-card-history");
    const HOUR = 3_600_000, now = Date.now();
    const wave = (mid, amp, phase) => (t) => mid + amp * Math.sin(((new Date(t).getHours() + new Date(t).getMinutes() / 60 - phase) / 24) * 2 * Math.PI);
    const curves = { "sensor.ute": wave(8, 3.5, 9), "sensor.fukt_ute": wave(72, -10, 9), "sensor.stue": wave(21, 0.8, 15), "sensor.co2_stue": wave(700, 180, 20) };
    const rows = (id, start) => {
      if (id === "binary_sensor.vindu_stue") return [{ s: "off", lu: start / 1000 }, { s: "on", lu: (now - 7 * HOUR) / 1000 }, { s: "off", lu: (now - 6.2 * HOUR) / 1000 }, { s: "on", lu: (now - 2 * HOUR) / 1000 }, { s: "off", lu: (now - 1.5 * HOUR) / 1000 }];
      if (id === "sensor.luftkvalitet") return [{ s: "god", lu: start / 1000 }, { s: "middels", lu: (now - 9 * HOUR) / 1000 }, { s: "god", lu: (now - 5 * HOUR) / 1000 }];
      const f = curves[id]; const out = [];
      for (let t = start; t < now; t += 20 * 60000) {
        if (id === "sensor.ute" && t > now - 14 * HOUR && t < now - 12 * HOUR) { out.push({ s: "unavailable", lu: t / 1000 }); continue; }
        out.push({ s: String(Math.round(f(t) * 10) / 10), lu: t / 1000 });
      }
      return out;
    };
    const measured = (name, state, unit) => ({ state, attributes: { friendly_name: name, unit_of_measurement: unit, state_class: "measurement" } });
    const states = {
      "sensor.ute": measured("Ute", "9.9", "°C"),
      "sensor.fukt_ute": measured("Fukt ute", "68", "%"),
      "sensor.stue": measured("Stue", "21.4", "°C"),
      "sensor.co2_stue": measured("CO2 stue", "640", "ppm"),
      "binary_sensor.vindu_stue": { state: "off", attributes: { friendly_name: "Vindu stue", device_class: "window" } },
      "sensor.luftkvalitet": { state: "god", attributes: { friendly_name: "Luftkvalitet" } },
    };
    for (const [id, v] of Object.entries(states)) v.entity_id = id;
    const hass = {
      language: "nb",
      locale: { language: "nb" },
      states,
      callWS: async (m) => Object.fromEntries(m.entity_ids.map((id) => [id, rows(id, Date.parse(m.start_time))])),
    };
    for (const config of configs) {
      const card = document.createElement("lovelace-card-history");
      card.setConfig({ type: "custom:lovelace-card-history", ...config });
      card.hass = hass;
      document.querySelector("main").append(card);
    }
    await new Promise((r) => setTimeout(r, 600));
  }, configs);
  await page.screenshot({ path: resolve(root, "images", file), fullPage: true });
  await page.close();
}

async function icon(browser) {
  const page = await browser.newPage({ viewport: { width: 512, height: 512 } });
  await page.setContent(`<body style="margin:0;background:transparent"><svg width="512" height="512" viewBox="0 0 512 512">
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#1f3a68"/><stop offset="1" stop-color="#0e1a30"/></linearGradient>
      <linearGradient id="a" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ff6b70" stop-opacity=".55"/><stop offset="1" stop-color="#ff6b70" stop-opacity="0"/></linearGradient>
      <linearGradient id="b" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#38b6f5" stop-opacity=".5"/><stop offset="1" stop-color="#38b6f5" stop-opacity="0"/></linearGradient>
    </defs>
    <rect width="512" height="512" rx="112" fill="url(#bg)"/>
    <g stroke="#ffffff" stroke-opacity=".12" stroke-width="4"><line x1="72" x2="440" y1="150" y2="150"/><line x1="72" x2="440" y1="250" y2="250"/><line x1="72" x2="440" y1="350" y2="350"/></g>
    <path d="M72 360 C130 330 160 250 220 240 S320 300 360 230 S420 170 440 160 L440 420 L72 420 Z" fill="url(#b)"/>
    <path d="M72 360 C130 330 160 250 220 240 S320 300 360 230 S420 170 440 160" fill="none" stroke="#38b6f5" stroke-width="18" stroke-linecap="round"/>
    <path d="M72 200 C120 190 160 150 210 170 S300 290 350 300 S420 280 440 300 L440 420 L72 420 Z" fill="url(#a)"/>
    <path d="M72 200 C120 190 160 150 210 170 S300 290 350 300 S420 280 440 300" fill="none" stroke="#ff6b70" stroke-width="18" stroke-linecap="round"/>
  </svg></body>`);
  await page.locator("svg").screenshot({ path: resolve(root, "images", "icon.png"), omitBackground: true });
  await page.close();
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  const errors = [];
  try {
    mkdirSync(resolve(root, "images"), { recursive: true });
    await icon(browser);
    await shot(browser, errors, "light.png", light, [
      { title: "Ute", entities: ["sensor.ute", "sensor.fukt_ute"] },
      { title: "Stue", entities: ["sensor.stue", "sensor.co2_stue", "binary_sensor.vindu_stue", "sensor.luftkvalitet"], smooth: true },
    ]);
    await shot(browser, errors, "dark.png", dark, [
      { title: "Ute", entities: ["sensor.ute", "sensor.fukt_ute"], smooth: true },
      { title: "Stue", entities: ["sensor.stue", "binary_sensor.vindu_stue", "sensor.luftkvalitet"], hours: 6 },
    ]);
    if (errors.length) throw new Error(errors.join("; "));
    console.log("Wrote images/icon.png, light.png and dark.png with simulated data.");
  } finally {
    await browser.close();
  }
})().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
