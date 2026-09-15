const test = require('node:test');
const assert = require('node:assert/strict');
const {
  formatBacklogSummary,
  summarizeBacklogItems,
} = require('./projectBacklogSummary');

test('summarizes backlog items by normalized status', () => {
  const result = summarizeBacklogItems([
    { title: 'Add guide content', status: 'Todo' },
    { title: 'Review feature', status: 'in-progress' },
    { title: 'Ship feature', status: 'todo' },
    { title: 'Default status for missing values' },
  ]);

  assert.deepEqual(result, {
    todo: 3,
    'in-progress': 1,
  });
});

test('formats backlog summary deterministically', () => {
  const result = formatBacklogSummary([
    { title: 'Ship feature', status: 'done' },
    { title: 'Review feature', status: 'todo' },
  ]);

  assert.equal(result, 'done: 1, todo: 1');
});

test('formats empty backlog summary', () => {
  assert.equal(formatBacklogSummary([]), 'No backlog items yet.');
});
