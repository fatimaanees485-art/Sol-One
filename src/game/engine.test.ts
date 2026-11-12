import test from 'node:test';
import assert from 'node:assert/strict';
import { createInitialState, calculateForecast, advanceSol } from './engine';

test('createInitialState initializes Moon Basics correctly', () => {
  const state = createInitialState('moon-basics', 3, 'Artemis Alpha');
  assert.equal(state.outpostName, 'Artemis Alpha');
  assert.equal(state.crewSize, 3);
  assert.equal(state.sol, 1);
  assert.equal(state.status, 'playing');
  assert.equal(state.resources.power, 75);
});

test('calculateForecast reflects greenhouse trade-off (more food, less power/water)', () => {
  const state = createInitialState('moon-basics', 2, 'Test Base');
  const baseForecast = calculateForecast(
    state,
    { engineering: 1, botany: 1, maintenance: 0, shelter: 0 },
    null
  );
  const greenhouseForecast = calculateForecast(
    state,
    { engineering: 1, botany: 1, maintenance: 0, shelter: 0 },
    'greenhouse'
  );
  assert.ok(greenhouseForecast.deltas.food > baseForecast.deltas.food);
  assert.ok(greenhouseForecast.deltas.power < baseForecast.deltas.power);
});

test('advanceSol progresses sol and updates history', () => {
  const state = createInitialState('moon-basics', 2, 'Test Base');
  const next = advanceSol(
    state,
    { engineering: 1, botany: 1, maintenance: 0, shelter: 0 },
    null,
    [],
    null,
    () => 0.99
  );
  assert.equal(next.sol, 2);
  assert.equal(next.history.length, 2);
});

test('loss condition triggers only after 2 consecutive sols at 0%', () => {
  let state = createInitialState('moon-basics', 4, 'Low Power Base');
  state = {
    ...state,
    resources: { ...state.resources, power: 0 },
    zeroCounters: { power: 1, lifeSupport: 0, food: 0, shielding: 0 },
  };
  const next = advanceSol(
    state,
    { engineering: 0, botany: 2, maintenance: 2, shelter: 0 },
    'greenhouse',
    [],
    null,
    () => 0.99
  );
  assert.equal(next.status, 'lost');
  assert.match(next.endReason, /Power reserves/);
});
