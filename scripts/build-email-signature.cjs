const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

async function main() {
  const dir = 'public/email-signature';
  fs.mkdirSync(`${dir}/assets`, { recursive: true });
  let html = fs.readFileSync('public/email-preview/index.html', 'utf8');
  const countries = [...new Set([...html.matchAll(/https:\/\/flagcdn.com\/w80\/([a-z]+)\.png/g)].map(m => m[1]))];
  const width = 800, height = 40, step = 48;
  const flags = await Promise.all(countries.map(async code => {
    return sharp(fs.readFileSync(`${dir}/assets/flags/${code}.png`)).resize(36, 26, { fit: 'fill' }).png().toBuffer();
  }));
  const period = countries.length * step;
  const strip = await sharp({ create: { width: period + width, height, channels: 4, background: '#ffffff00' } })
    .composite(Array.from({ length: Math.ceil((period + width) / step) }, (_, i) => ({ input: flags[i % flags.length], left: i * step, top: 7 })).filter(x => x.left + 36 <= period + width))
    .png().toBuffer();
  const frames = [];
  for (let offset = 0; offset < period; offset += 8) {
    frames.push(await sharp(strip).extract({ left: offset, top: 0, width, height }).raw().toBuffer());
  }
  await sharp(Buffer.concat(frames), { raw: { width, height: height * frames.length, channels: 4, pageHeight: height } })
    .gif({ loop: 0, delay: 160, effort: 3, colours: 128 }).toFile(`${dir}/assets/flags.gif`);
  const footerStart = html.lastIndexOf('<tr>', html.indexOf('<div class="email-flags"'));
  const footerEnd = html.indexOf('</tr>', html.indexOf('<div class="email-flags"')) + 5;
  html = html.slice(0, footerStart) + '<tr><td style="padding:12px 0"><img src="assets/flags.gif" width="800" height="40" alt="Países europeus" style="display:block;width:100%;max-width:800px;height:auto;border:0"></td></tr>' + html.slice(footerEnd);
  html = html.replace(/<!-- Design preview[\s\S]*?-->/, '');
  html = html.replace(/<style>([\s\S]*?)<\/style>/, (_, css) => '<style>' + css.slice(0, css.indexOf('      .email-flags {')) + '</style>');
  html = html.replace(/<table\b/g, '<table cellpadding="0" cellspacing="0" border="0"');
  html = html.replace(/style="([^"]*)"/g, (_, css) => 'style="' + css.replace(/([\d.]+)px/g, (match, n) => Number(n) > 2 ? `${Math.round(Number(n) * 800 / 1100)}px` : match) + '"');
  html = html.replace(/font-size:\s*(\d+)px/g, (_, n) => `font-size:${Math.max(11, Number(n))}px`);
  // The GIF is already generated at its final width.
  html = html.replace('max-width:582px', 'max-width:800px');
  html = html.replace(/width="(\d+)"/g, (match, n) => `width="${Number(n) === 800 ? 800 : Math.round(Number(n) * 800 / 1100)}"`);
  html = html.replace(/height="(\d+)"/g, (match, n) => `height="${Math.round(Number(n) * 800 / 1100)}"`);
  html = html.replace('<body style="', '<body style="margin:0; ');
  html = html.replace(/<td\b/g, '<td style="font-family:Segoe UI,Arial,sans-serif;color:#111d83;"');
  // Merge inserted defaults into any existing inline style, keeping existing values last.
  html = html.replace(/<td style="([^"]*)"([^>]*?)style="([^"]*)"/g, '<td$2style="$1$3"');
  html = html.replace(/<a\b/g, '<a style="color:#111d83;text-decoration:none;"');
  html = html.replace(/src="(\.\.\/images\/[^" ]+|assets\/[^" ]+)"/g, (_, source) => {
    const name = path.basename(source);
    if (name !== 'flags.gif') fs.copyFileSync(path.resolve('public/email-preview', source), `${dir}/assets/${name}`);
    return `src="assets/${name}"`;
  });
  fs.writeFileSync(`${dir}/preview.html`, html);
  fs.writeFileSync(`${dir}/signature.html`, html.replaceAll('src="assets/', 'src="https://findbeuropa.com/email-signature/assets/'));
  console.log(`Signature built: ${frames.length} GIF frames; ${fs.statSync(`${dir}/assets/flags.gif`).size} bytes.`);
}
main().catch(error => { console.error(error); process.exitCode = 1; });
