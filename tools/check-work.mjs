// Fails when work/ is inconsistent, so a scheduled session can't leave the
// tracking in a state the next one will misread. No dependencies.
import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import { join, dirname, resolve, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const work = join(root, 'work');
const errors = [];
const fail = (file, message) => errors.push(`${relative(root, file)}: ${message}`);

const STATUSES = ['idea', 'scoping', 'spiking', 'ready', 'building', 'shipped', 'dropped'];

const read = (file) => readFileSync(file, 'utf8');
const entries = (dir) =>
  existsSync(dir) ? readdirSync(dir).filter((name) => name.endsWith('.md') && name !== '_template.md') : [];
// The value of a "- **Field:** value" line.
const field = (text, name) => text.match(new RegExp(`^- \\*\\*${name}:\\*\\*[ \\t]*(.*)$`, 'm'))?.[1].trim();
// Examples inside HTML comments are not content.
const uncommented = (text) => text.replace(/<!--[\s\S]*?-->/g, '');

// Decisions: D-00n-slug.md, each number once, each with a status.
const decisionNumbers = new Map();
for (const name of entries(join(work, 'decisions'))) {
  const file = join(work, 'decisions', name);
  const number = name.match(/^D-(\d{3})-[a-z0-9-]+\.md$/)?.[1];
  if (!number) {
    fail(file, 'name should look like D-001-short-slug.md');
    continue;
  }
  if (decisionNumbers.has(number)) fail(file, `D-${number} is also ${decisionNumbers.get(number)}`);
  decisionNumbers.set(number, name);
  const text = read(file);
  if (!text.startsWith(`# D-${number}:`)) fail(file, `first line should start "# D-${number}:"`);
  const status = field(text, 'Status');
  if (!status || !/^(accepted|superseded by D-\d{3})/.test(status)) {
    fail(file, 'Status should be "accepted" or "superseded by D-00n"');
  }
}

// Projects: one valid status each, and a row on the board.
const board = existsSync(join(work, 'README.md')) ? read(join(work, 'README.md')) : '';
if (!board) fail(join(work, 'README.md'), 'missing');
for (const name of entries(join(work, 'projects'))) {
  const file = join(work, 'projects', name);
  const status = field(read(file), 'Status');
  if (!STATUSES.includes(status)) fail(file, `Status should be one of: ${STATUSES.join(', ')}`);
  if (!board.includes(`(projects/${name})`)) fail(file, 'has no row on the board in work/README.md');
}

// Questions: each id once, each open, answered by a real decision, or withdrawn.
const questionsFile = join(work, 'questions.md');
if (existsSync(questionsFile)) {
  const blocks = uncommented(read(questionsFile)).split(/^(?=## Q-)/m).filter((block) => block.startsWith('## Q-'));
  const seen = new Set();
  for (const block of blocks) {
    const id = block.match(/^## (Q-\d{3}):/)?.[1];
    if (!id) {
      fail(questionsFile, `heading should look like "## Q-001: question" (${block.split('\n')[0]})`);
      continue;
    }
    if (seen.has(id)) fail(questionsFile, `${id} appears twice`);
    seen.add(id);
    const status = field(block, 'Status') ?? '';
    const answered = status.match(/^answered\b.*?D-(\d{3})/);
    if (answered) {
      if (!decisionNumbers.has(answered[1])) fail(questionsFile, `${id} is answered by D-${answered[1]}, which doesn't exist`);
    } else if (status !== 'open' && !status.startsWith('withdrawn')) {
      fail(questionsFile, `${id} Status should be "open", "answered → D-00n" or "withdrawn: reason"`);
    }
    if (status === 'open' && !field(block, 'Recommendation')) fail(questionsFile, `${id} has no Recommendation`);
  }
}

// Relative links anywhere in work/ point at something that exists.
const walk = (dir) =>
  readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    return statSync(path).isDirectory() ? walk(path) : name.endsWith('.md') ? [path] : [];
  });
for (const file of existsSync(work) ? walk(work) : []) {
  if (file.endsWith('_template.md')) continue;
  for (const [, target] of uncommented(read(file)).matchAll(/\]\(([^)\s]+)\)/g)) {
    if (/^(https?:|mailto:|#)/.test(target)) continue;
    const path = resolve(dirname(file), target.split('#')[0]);
    if (!existsSync(path)) fail(file, `link to ${target} goes nowhere`);
  }
}

if (errors.length) {
  console.error(`work/ has ${errors.length} problem${errors.length === 1 ? '' : 's'}:\n`);
  for (const error of errors) console.error(`  ${error}`);
  process.exit(1);
}
console.log('work/ is consistent');
