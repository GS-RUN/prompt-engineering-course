/*
 * One-shot: rebalance the position of the correct answer across all
 * multiple-choice questions in js/quiz.js so the global distribution
 * is ~25% per slot instead of the current B-heavy bias (67%).
 *
 * Strategy
 *  - Parse each question's `options: [...]` and `correct: N`.
 *  - Assign each question a target slot deterministically (seeded
 *    Fisher-Yates of [0,1,2,3,0,1,2,3,...] padded to question count).
 *  - Move the correct option to that slot; rewrite both `options` and
 *    `correct`.
 *  - Preserve original formatting: if the original options literal
 *    spanned multiple lines, the rewrite keeps multi-line.
 *
 * Run: node scripts/rebalance_quiz_answers.js
 */

const fs = require('fs');
const path = require('path');

const QUIZ_PATH = path.join(__dirname, '..', 'js', 'quiz.js');
let src = fs.readFileSync(QUIZ_PATH, 'utf8');

// --- 1. Locate every (options array, correct digit) pair --------------
const targets = [];
const optionsRe = /options:\s*\[/g;
let m;
while ((m = optionsRe.exec(src)) !== null) {
  const openBracket = src.indexOf('[', m.index);
  // Walk to matching ] respecting strings.
  let depth = 1;
  let j = openBracket + 1;
  let inStr = null;
  while (depth > 0 && j < src.length) {
    const ch = src[j];
    if (inStr) {
      if (ch === '\\') { j += 2; continue; }
      if (ch === inStr) inStr = null;
    } else {
      if (ch === "'" || ch === '"' || ch === '`') inStr = ch;
      else if (ch === '[') depth++;
      else if (ch === ']') depth--;
    }
    j++;
  }
  const closeBracket = j - 1;
  const optionsLiteral = src.slice(openBracket, closeBracket + 1);
  // After the close bracket we expect: `,` then optional whitespace/newline then `correct: N`
  const after = src.slice(closeBracket + 1);
  const cm = after.match(/^\s*,\s*\n?\s*correct:\s*(\d+)/);
  if (!cm) continue;
  const correctKwIdx = closeBracket + 1 + after.indexOf('correct:');
  const tail = src.slice(correctKwIdx + 'correct:'.length);
  const dm = tail.match(/^(\s*)(\d+)/);
  const digitStart = correctKwIdx + 'correct:'.length + dm[1].length;
  const digitEnd = digitStart + dm[2].length;

  let arr;
  try { arr = (new Function('return ' + optionsLiteral))(); }
  catch (e) { console.error('parse fail at', m.index); continue; }
  if (!Array.isArray(arr) || arr.length !== 4) {
    console.warn('skip: options length', arr.length, 'at', m.index);
    continue;
  }
  targets.push({
    openBracket, closeBracket,
    digitStart, digitEnd,
    arr, currentCorrect: parseInt(dm[2], 10),
    multiline: optionsLiteral.includes('\n'),
    indent: extractIndent(src, openBracket),
  });
}

function extractIndent(text, idx) {
  // Find the start of the line containing idx.
  let k = idx;
  while (k > 0 && text[k - 1] !== '\n') k--;
  let indent = '';
  while (text[k] === ' ' || text[k] === '\t') { indent += text[k]; k++; }
  return indent;
}

console.log(`Found ${targets.length} questions.`);

// --- 2. Tally current distribution ------------------------------------
const before = [0, 0, 0, 0];
for (const t of targets) before[t.currentCorrect]++;
console.log('Before:', before, '(target ~' + Math.round(targets.length / 4) + ' each)');

// --- 3. Build target slot assignments ----------------------------------
// Round-robin then Fisher-Yates with a fixed seed for reproducibility.
function mulberry32(seed) {
  return function () {
    let t = (seed += 0x6D2B79F5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rng = mulberry32(0x515A5519); // fixed seed
const slots = [];
for (let i = 0; i < targets.length; i++) slots.push(i % 4);
// Fisher-Yates
for (let i = slots.length - 1; i > 0; i--) {
  const j = Math.floor(rng() * (i + 1));
  [slots[i], slots[j]] = [slots[j], slots[i]];
}

// --- 4. Apply edits in reverse order ----------------------------------
const edits = [];
for (let i = 0; i < targets.length; i++) {
  const t = targets[i];
  const newPos = slots[i];
  // Move correct option to newPos
  const newArr = t.arr.slice();
  if (newPos !== t.currentCorrect) {
    const [correctOpt] = newArr.splice(t.currentCorrect, 1);
    newArr.splice(newPos, 0, correctOpt);
  }
  // Serialize
  const quote = (s) => "'" + String(s).replace(/\\/g, '\\\\').replace(/'/g, "\\'") + "'";
  let serialized;
  if (t.multiline) {
    const innerIndent = t.indent + '  ';
    serialized = '[\n' + newArr.map(s => innerIndent + quote(s)).join(',\n') + '\n' + t.indent + ']';
  } else {
    serialized = '[' + newArr.map(quote).join(', ') + ']';
  }
  edits.push({ start: t.digitStart, end: t.digitEnd, repl: String(newPos) });
  edits.push({ start: t.openBracket, end: t.closeBracket + 1, repl: serialized });
}

// Apply in descending offset order so earlier offsets remain valid.
edits.sort((a, b) => b.start - a.start);
for (const e of edits) src = src.slice(0, e.start) + e.repl + src.slice(e.end);

fs.writeFileSync(QUIZ_PATH, src);

// --- 5. Verify by re-parsing the new file ------------------------------
const after = [0, 0, 0, 0];
const newSrc = fs.readFileSync(QUIZ_PATH, 'utf8');
const verifyRe = /correct:\s*(\d+)/g;
let v;
while ((v = verifyRe.exec(newSrc)) !== null) after[parseInt(v[1], 10)]++;
console.log('After: ', after);
console.log('Done.');
