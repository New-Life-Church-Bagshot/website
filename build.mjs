import { cp, mkdir, readFile, rm, stat, writeFile } from 'node:fs/promises';

const root = new URL('./', import.meta.url);
const source = new URL('site/', root);
const output = new URL('dist/', root);
const pageNames = ['index.html', 'our-story.html'];
const files = ['sundays', 'contact', 'ministries'];
const content = {};

for (const name of files) {
  const data = await readFile(new URL(`content/${name}.json`, root), 'utf8');
  content[name] = JSON.parse(data);
}

const { sundays, contact, ministries } = content;
const date = new Date(`${sundays.launchDate}T00:00:00Z`);
if (!/^\d{4}-\d{2}-\d{2}$/.test(sundays.launchDate) || Number.isNaN(+date) ||
    date.toISOString().slice(0, 10) !== sundays.launchDate) {
  throw new Error('Sunday and homepage: choose a valid launch date.');
}
sundays.launchLabel = new Intl.DateTimeFormat('en-GB', {
  day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC',
}).format(date);

if (!/^[^\s@?"<>]+@[^\s@?"<>]+\.[^\s@?"<>]+$/.test(contact.email)) {
  throw new Error('Contact details: enter a valid email address.');
}
const phone = contact.phone.replace(/[\s()-]/g, '');
if (!/^(?:0|\+)\d{7,15}$/.test(phone)) {
  throw new Error('Contact details: enter a UK phone number or an international number starting with +.');
}
contact.phoneLink = phone.startsWith('0') ? '+44' + phone.slice(1) : phone;
if (!URL.canParse(contact.directions) || new URL(contact.directions).protocol !== 'https:') {
  throw new Error('Contact details: the directions link must start with https://.');
}

for (const [key, ministry] of Object.entries(ministries)) {
  const image = decodeURIComponent(ministry.image).replace(/^\.?\//, '');
  const parts = image.split('/');
  if (!image.startsWith('assets/editor/') || parts.some(part => !part || part === '.' || part === '..') ||
      !/\.(?:avif|jpe?g|png|webp)$/i.test(image) || image.includes('\\')) {
    throw new Error(`Ministries: choose a local photo for ${key}.`);
  }
  ministry.image = './' + parts.map(encodeURIComponent).join('/');
  if (!(await stat(new URL(ministry.image, source)).catch(() => null))?.isFile()) {
    throw new Error(`Ministries: the photo for ${key} could not be found.`);
  }
}

const entities = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
const pages = new Map();
for (const name of pageNames) {
  const template = await readFile(new URL(name, source), 'utf8');
  const rendered = template.replace(/\{\{([a-zA-Z0-9.-]+)\}\}/g, (_, key) => {
    const value = key.split('.').reduce((object, part) => object?.[part], content);
    if (typeof value !== 'string' || !value.trim()) {
      throw new Error(`Missing text for ${key} in ${name}.`);
    }
    return value.trim().replace(/[&<>"']/g, character => entities[character]);
  });
  pages.set(name, rendered);
}

await rm(output, { recursive: true, force: true });
await mkdir(output);
for (const file of ['assets', 'styles.css', 'site.js', '.nojekyll']) {
  await cp(new URL(file, source), new URL(file, output), { recursive: true });
}
for (const [name, rendered] of pages) {
  await writeFile(new URL(name, output), rendered, 'utf8');
}
console.log('Built index.html and our-story.html into dist/.');
