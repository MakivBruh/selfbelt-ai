const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
// Minimal DOM checks logic and translated rendering; not layout or browser behavior.
class Element {
  constructor() { this.dataset = {}; this.listeners = {}; this.children = []; }
  append(...items) { this.children.push(...items); }
  replaceChildren(...items) { this.children = items; }
  setAttribute(key, value) { this[key] = value; }
  addEventListener(key, callback) { this.listeners[key] = callback; }
}
const elements = new Map();
const document = { documentElement: {}, getElementById(id) { if (!elements.has(id)) elements.set(id, new Element()); return elements.get(id); }, createElement() { return new Element(); }, createTextNode(text) { return text; } };
const html = fs.readFileSync(`${__dirname}/index.html`, 'utf8');
const context = vm.createContext({ document, console, Date });
vm.runInContext(html.match(/<script>([\s\S]*?)<\/script>/)[1], context);
const run = code => vm.runInContext(code, context);
assert.equal(run('condition()'), 'good');
run('state.seats[0].belt=false;update()');
assert.equal(run('condition()'), 'warn');
run('state.speed=40;update()');
assert.equal(run('condition()'), 'bad');
assert.equal(run('state.speed'), 40, 'Warning must not alter speed');
run('state.seats[0].belt=true;update()');
assert.equal(run('condition()'), 'good', 'Empty seats do not trigger warnings');
run('state.seats[2].occupied=true;update()');
assert.equal(run('condition()'), 'bad');
elements.get('lang').listeners.click();
assert.equal(document.documentElement.lang, 'en');
assert.equal(elements.get('status-title').textContent, 'Safety warning');
assert.equal(elements.get('seat-controls').children[0].children[1].children[0].disabled, true);
run('for(let i=0;i<10;i++) record(); update()');
assert.equal(elements.get('log-list').children.length, 5);
console.log('PASS: startup, stationary warning, moving warning, unchanged speed, empty seats, new occupant, English labels, driver lock, bounded log.');
