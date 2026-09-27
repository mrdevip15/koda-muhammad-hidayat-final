'use strict';

// Run with: node --test tests/sidequest.test.cjs
// Drive the shipped engine through its public controls. Rendering is stubbed;
// timing, combat, input, wave transitions and run state all use production code.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');
const engine = fs.readFileSync(path.join(__dirname, '../level-1/task-1/game.js'), 'utf8');

function createGame() {
  const listeners = new WeakMap();
  class Target {
    addEventListener(type, callback) {
      if (!listeners.has(this)) listeners.set(this, new Map());
      const events = listeners.get(this);
      events.set(type, [...(events.get(type) || []), callback]);
    }
    dispatch(type, event = {}) {
      event.preventDefault ||= () => {};
      for (const callback of listeners.get(this)?.get(type) || []) callback(event);
    }
  }
  let document;
  const gradientMock = { addColorStop: () => {} };
  const context = new Proxy({}, {
    get: (target, key) => {
      if (key === 'createRadialGradient' || key === 'createLinearGradient') return () => gradientMock;
      return target[key] || (() => {});
    },
    set: (target, key, value) => { target[key] = value; return true; }
  });
  class Element extends Target {
    constructor(tagName = 'div') {
      super();
      this.tagName = tagName.toUpperCase();
      this.dataset = {};
      this.style = {};
      this.children = [];
      this.attributes = {};
      this.selected = new Map();
      this.isConnected = true;
      this.hidden = false;
      this.inert = false;
      this.width = 960;
      this.height = 480;
      const classes = new Set();
      this.classList = { add: value => classes.add(value), remove: value => classes.delete(value), toggle: (value, enabled) => enabled ? classes.add(value) : classes.delete(value) };
    }
    appendChild(child) { this.children.push(child); }
    setAttribute(name, value) { this.attributes[name] = value; }
    get firstElementChild() { return this.querySelector('span'); }
    getContext() { return context; }
    focus() { document.activeElement = this; }
    getClientRects() { return this.hidden ? [] : [{}]; }
    contains(element) { return this === element || [...this.selected.values(), ...this.children].some(child => child.contains(element)); }
    closest() { return this; }
    setPointerCapture() {}
    querySelector(selector) {
      if (!this.selected.has(selector)) this.selected.set(selector, new Element(selector === 'button' || selector.includes('data-action') ? 'button' : selector === 'canvas' ? 'canvas' : 'div'));
      return this.selected.get(selector);
    }
    querySelectorAll(selector) {
      if (selector === '[data-control]') {
        if (!this.controls) this.controls = ['left', 'right', 'dash', 'attack'].map(control => {
          const button = new Element('button');
          button.dataset.control = control;
          return button;
        });
        return this.controls;
      }
      return [...this.selected.values()].filter(element => element.tagName === 'BUTTON' || element.tagName === 'CANVAS');
    }
  }
  document = new Target();
  document.body = new Element('body');
  const trigger = new Element('button');
  document.body.appendChild(trigger);
  document.activeElement = trigger;
  document.createElement = tagName => new Element(tagName);
  const window = new Target();
  window.matchMedia = () => ({ matches: false });
  window.devicePixelRatio = 1;
  let now = 0, frameId = 0, randomState = 42;
  const frames = new Map(), storage = new Map();
  const math = Object.create(Math);
  math.random = () => ((randomState = (randomState * 1664525 + 1013904223) >>> 0) / 4294967296);
  vm.runInNewContext(engine, {
    window, document, HTMLElement: Element, Image: class {}, Math: math,
    performance: { now: () => now },
    localStorage: { getItem: key => storage.get(key), setItem: (key, value) => storage.set(key, value) },
    requestAnimationFrame: callback => { frames.set(++frameId, callback); return frameId; },
    cancelAnimationFrame: id => frames.delete(id),
  }, { filename: 'game.js' });
  const overlay = document.body.children.at(-1);
  const state = () => JSON.parse(JSON.stringify(window.SideQuest.getState()));
  function key(code, held = true) { window.dispatch(held ? 'keydown' : 'keyup', { code, repeat: false }); }
  function click(action, upgrade = false) {
    const target = new Element('button');
    target.dataset[upgrade ? 'upgrade' : 'action'] = action;
    overlay.dispatch('click', { target });
  }
  function step(seconds = 1 / 60) {
    now += seconds * 1000;
    const callbacks = [...frames.values()];
    frames.clear();
    callbacks.forEach(callback => callback(now));
  }
  function advance(seconds) { for (let count = Math.ceil(seconds * 60); count > 0; count--) step(); }
  function until(predicate, limit = 60) {
    for (let count = limit * 60; count > 0; count--) {
      if (predicate(state())) return;
      step();
    }
    assert.fail(`Timed out after ${limit}s: ${JSON.stringify(state())}`);
  }
  function start() { window.SideQuest.open(trigger); click('start'); }
  return { window, document, overlay, trigger, state, key, click, step, advance, until, start, frames };
}

test('a released strike finishes and movement resumes; held strike chains attacks', () => {
  const game = createGame();
  game.start();
  game.key('Space');
  game.step();
  assert.ok(game.state().player.attackTimer > 0);
  game.key('Space', false);
  game.advance(0.6);
  assert.equal(game.state().player.attackTimer, 0);
  const beforeMove = game.state().player.x;
  game.key('KeyA');
  game.advance(0.1);
  game.key('KeyA', false);
  assert.ok(game.state().player.x < beforeMove);
  assert.equal(game.state().player.facing, -1);
  game.key('Space');
  const steps = new Set();
  for (let frame = 0; frame < 100; frame++) { game.step(); steps.add(game.state().player.attackStep); }
  assert.deepEqual([...steps].sort(), [0, 1, 2]);
});

test('idle damage reaches a stable defeat and retry creates a healthy fresh run', () => {
  const game = createGame();
  game.start();
  game.until(state => state.hp < 100);
  assert.ok(game.state().hp > 0);
  game.until(state => state.state === 'defeat');
  assert.equal(game.state().hp, 0);
  const defeated = game.state();
  game.key('Space');
  game.key('ShiftLeft');
  game.advance(2);
  assert.deepEqual(game.state(), defeated);
  game.click('start');
  assert.equal(game.state().state, 'playing');
  assert.equal(game.state().hp, 100);
  assert.equal(game.state().score, 0);
  assert.equal(game.state().kills, 0);
  assert.equal(game.state().wave, 1);
});

test('blur and hidden-document pauses freeze combat and clear held input', () => {
  const game = createGame();
  game.start();
  game.key('KeyD');
  game.advance(0.1);
  game.window.dispatch('blur');
  assert.equal(game.state().state, 'paused');
  const paused = game.state();
  game.advance(3);
  assert.deepEqual(game.state(), paused);
  game.click('resume');
  game.advance(0.1);
  assert.equal(game.state().player.x, paused.player.x);
  game.document.hidden = true;
  game.document.dispatch('visibilitychange');
  assert.equal(game.state().state, 'paused');
});

test('close releases focus, scrolling and animation; reopening has no held input', () => {
  const game = createGame();
  game.document.body.style.overflow = 'clip';
  game.start();
  assert.equal(game.trigger.inert, true);
  game.key('KeyD');
  game.key('Space');
  game.advance(0.2);
  game.window.SideQuest.close();
  assert.equal(game.state().state, 'closed');
  assert.equal(game.frames.size, 0);
  assert.equal(game.document.body.style.overflow, 'clip');
  assert.equal(game.trigger.inert, false);
  assert.equal(game.document.activeElement, game.trigger);
  game.window.SideQuest.open(game.trigger);
  assert.equal(game.state().state, 'intro');
  assert.equal(game.frames.size, 1);
  game.window.SideQuest.open(game.trigger);
  assert.equal(game.frames.size, 1);
  game.click('start');
  game.advance(0.1);
  assert.equal(game.state().player.x, 480);
  assert.equal(game.state().player.attackTimer, 0);
});

// A control-driven player: close into sword range, face the nearest enemy,
// chain strikes, and dodge late telegraphs. No game internals are modified.
function playWave(game, seconds = 150) {
  const held = new Set();
  const hold = (code, pressed) => {
    if (held.has(code) === pressed) return;
    game.key(code, pressed);
    if (pressed) held.add(code); else held.delete(code);
  };
  for (let frame = 0; frame < seconds * 60; frame++) {
    const state = game.state();
    if (state.state !== 'playing') {
      for (const code of held) game.key(code, false);
      return state;
    }
    const player = state.player;
    const nearest = [...state.enemies].sort((a, b) => Math.abs(a.x - player.x) - Math.abs(b.x - player.x))[0];
    if (nearest) {
      const dx = nearest.x - player.x;
      const facing = dx < 0 ? -1 : 1;
      let direction = Math.abs(dx) > 90 || player.facing !== facing ? facing : 0;
      const danger = state.enemies.find(enemy => enemy.state === 'windup' && enemy.timer < 0.18 && Math.abs(enemy.x - player.x) < (enemy.boss ? 160 : 100));
      const shouldDodge = danger && player.dashRemaining === 0;
      if (shouldDodge) direction = danger.x < player.x ? -1 : 1;
      hold('KeyA', direction < 0);
      hold('KeyD', direction > 0);
      hold('Space', player.facing === facing && Math.abs(dx) < 136);
      if (shouldDodge) { game.key('ShiftLeft'); game.key('ShiftLeft', false); }
    } else {
      hold('KeyA', false); hold('KeyD', false); hold('Space', false);
    }
    game.step();
  }
  assert.fail(`Wave did not end after ${seconds}s: ${JSON.stringify(game.state())}`);
}

test('all five finite waves are winnable with normal controls and upgrades reset on retry', () => {
  const game = createGame();
  game.start();
  const waveKills = [3, 4, 5, 5, 6];
  const upgrades = ['edge', 'feet', 'heart', 'edge'];
  let previousScore = 0;
  for (let wave = 1; wave <= 5; wave++) {
    const finished = playWave(game);
    assert.equal(finished.state, 'upgrade', `wave ${wave}: ${JSON.stringify(finished)}`);
    assert.equal(finished.waveKills, waveKills[wave - 1]);
    assert.equal(finished.spawned, waveKills[wave - 1]);
    assert.ok(finished.score > previousScore);
    previousScore = finished.score;
    if (wave < 5) {
      const paused = game.state();
      game.advance(1);
      assert.deepEqual(game.state(), paused, 'upgrade screen freezes combat');
      game.click(upgrades[wave - 1], true);
      assert.equal(game.state().wave, wave + 1);
      assert.equal(game.state().player.x, 480);
      assert.equal(game.state().player.attackTimer, 0);
      assert.equal(game.state().chain, 0);
    }
  }
  const cleared = game.state();
  assert.equal(cleared.kills, 23);
  assert.equal(cleared.maxHp, 130);
  assert.equal(cleared.player.damage, 12);
  assert.equal(cleared.player.speed, 243);
  game.advance(3);
  assert.deepEqual(game.state(), cleared, 'upgrade screen stays until choice');
  game.window.SideQuest.close();
  game.window.SideQuest.open(game.trigger);
  game.click('start');
  const fresh = game.state();
  assert.equal(fresh.maxHp, 100);
  assert.equal(fresh.hp, 100);
  assert.equal(fresh.player.damage, 0);
  assert.equal(fresh.player.speed, 225);
  assert.equal(fresh.player.dashCooldown, 1.6);
  assert.equal(fresh.kills, 0);
  assert.equal(fresh.score, 0);
});

test('touch controls support simultaneous actions and release on cancellation', () => {
  const game = createGame();
  game.start();
  const controls = Object.fromEntries(game.overlay.querySelectorAll('[data-control]').map(button => [button.dataset.control, button]));
  controls.right.dispatch('pointerdown', { pointerId: 1 });
  controls.attack.dispatch('pointerdown', { pointerId: 2 });
  game.advance(0.1);
  assert.ok(game.state().player.x > 480);
  assert.ok(game.state().player.attackTimer > 0);
  controls.right.dispatch('pointercancel', { pointerId: 1 });
  controls.attack.dispatch('lostpointercapture', { pointerId: 2 });
  const stoppedAt = game.state().player.x;
  game.advance(0.7);
  assert.equal(game.state().player.x, stoppedAt);
  assert.equal(game.state().player.attackTimer, 0);
});

test('on-screen controls also accept keyboard and assistive-technology clicks', () => {
  const game = createGame();
  game.start();
  const controls = Object.fromEntries(game.overlay.querySelectorAll('[data-control]').map(button => [button.dataset.control, button]));
  game.overlay.dispatch('click', { target: controls.left, detail: 0 });
  assert.ok(game.state().player.x < 480);
  assert.equal(game.state().player.facing, -1);
  game.overlay.dispatch('click', { target: controls.attack, detail: 0 });
  assert.ok(game.state().player.attackTimer > 0);
  game.overlay.dispatch('click', { target: controls.dash, detail: 0 });
  assert.ok(game.state().player.dashTimer > 0);
  const beforePointerClick = game.state().player.x;
  game.overlay.dispatch('click', { target: controls.right, detail: 1 });
  assert.equal(game.state().player.x, beforePointerClick);
});
