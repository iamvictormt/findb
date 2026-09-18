const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const INSTAGRAM_URL = 'https://www.instagram.com/findbeuropaoficial?stkn=dW44bmN5NTVneTlz&amp;utm_source=qr';

function configureVersion(html, { email, website, websiteLabel, qrFile }) {
  let result = html
    .replaceAll('mailto:partnerships@findbruropao.com', `mailto:${email}`)
    .replaceAll('partnerships@findbruropao.com', email)
    .replaceAll('www.findbruropao.com', `<a style="color:#111d83;text-decoration:none;" href="${website}">${websiteLabel}</a>`)
    .replaceAll('href="https://findbeuropa.com"', `href="${website}"`)
    .replaceAll('src="assets/qr.png"', `src="assets/${qrFile}"`)
    .replace(/(<img\s+src="assets\/Instagram\.png"[\s\S]*?\/>)/, `<a style="color:#111d83;text-decoration:none;" href="${INSTAGRAM_URL}">$1</a>`)
    .replace('@findbeuropaoficial', `<a style="color:#ffffff;text-decoration:none;" href="${INSTAGRAM_URL}">@findbeuropaoficial</a>`);
  return result;
}

function portugueseVersion(html) {
  const replacements = [
    ['<html lang="en">', '<html lang="pt-BR">'],
    ['FindB Europa · Email design', 'FindB Europa · Assinatura de email'],
    ['Social Network <span style="color: #d63262">for Immigrants</span>', 'Rede Social <span style="color: #d63262">para Imigrantes</span>'],
    ['>Housing</span>', '>Moradia</span>'],
    ['>Jobs</span>', '>Empregos</span>'],
    ['>Documentation</span>', '>Documentação</span>'],
    ['>Immigration</span>', '>Imigração</span>'],
    ['>Transport</span>', '>Transporte</span>'],
    ['>Communities</span>', '>Comunidades</span>'],
    ['>Networking</span>', '>Conexões</span>'],
    ['>Events</span>', '>Eventos</span>'],
    ['Founder &amp; CEO', 'Fundador &amp; CEO'],
    ['Project Manager', 'Gerente de Projetos'],
    ['Building connections. Creating', 'Construindo conexões. Criando'],
    ['>opportunities.</strong', '>oportunidades.</strong'],
    ['Empowering our community', 'Fortalecendo nossa comunidade'],
    ['>across Europe.</strong>', '>em toda a Europa.</strong>'],
    ['>Europe\n', '>Europa\n'],
    ['>Social Network for Immigrants</span', '>Rede Social para Imigrantes</span'],
    ['Information, support and real opportunities<br />for Brazilians and the\n                                    Portuguese-speaking<br />community in Europe.', 'Informação, apoio e oportunidades reais<br />para brasileiros e para a comunidade<br />de língua portuguesa na Europa.'],
    ['Be part of this movement!', 'Faça parte deste movimento!'],
    ['Connect. Share. Grow.', 'Conecte-se. Compartilhe. Cresça.'],
    ['>Belong.</span>', '>Pertença.</span>'],
    ['FOLLOW US', 'SIGA-NOS'],
    ['alt="European countries"', 'alt="Países europeus"'],
  ];
  return replacements
    .reduce((result, [from, to]) => result.replaceAll(from, to), html)
    .replace(/(>\s*)Europe(\s*<\/td>)/, '$1Europa$2')
    .replace('alt="Visit FindB Europa"', 'alt="Visitar FindB Europa"');
}

async function main() {
  const dir = 'public/email-signature';
  fs.mkdirSync(`${dir}/assets`, { recursive: true });
  fs.copyFileSync('public/email-preview/assets/qr-en.jpg', `${dir}/assets/qr-en.jpg`);
  fs.copyFileSync('public/email-preview/assets/qr-pt.jpg', `${dir}/assets/qr-pt.jpg`);
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
  html = html.slice(0, footerStart) + '<tr><td style="padding:12px 0"><img src="assets/flags.gif" width="800" height="40" alt="European countries" style="display:block;width:100%;max-width:800px;height:auto;border:0"></td></tr>' + html.slice(footerEnd);
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
  const english = configureVersion(html, {
    email: 'partnerships@findbeuropa.com',
    website: 'https://comunidadesfindbeuropa.com',
    websiteLabel: 'comunidadesfindbeuropa.com',
    qrFile: 'qr-en.jpg',
  });
  const portuguese = portugueseVersion(configureVersion(html, {
    email: 'parcerias@findbeuropa.com',
    website: 'https://www.findbeuropa.com',
    websiteLabel: 'www.findbeuropa.com',
    qrFile: 'qr-pt.jpg',
  }));
  const englishPublic = english.replaceAll('src="assets/', 'src="https://findbeuropa.com/email-signature/assets/');
  const portuguesePublic = portuguese.replaceAll('src="assets/', 'src="https://findbeuropa.com/email-signature/assets/');
  fs.writeFileSync(`${dir}/preview.html`, english);
  fs.writeFileSync(`${dir}/preview-en.html`, english);
  fs.writeFileSync(`${dir}/preview-pt.html`, portuguese);
  fs.writeFileSync(`${dir}/signature.html`, englishPublic);
  fs.writeFileSync(`${dir}/signature-en.html`, englishPublic);
  fs.writeFileSync(`${dir}/signature-pt.html`, portuguesePublic);
  console.log(`Signature built: ${frames.length} GIF frames; ${fs.statSync(`${dir}/assets/flags.gif`).size} bytes.`);
}
main().catch(error => { console.error(error); process.exitCode = 1; });
