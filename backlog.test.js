const test = require('node:test');
const assert = require('node:assert/strict');
const { createBacklogItem, formatBacklogItem } = require('./backlog');

test('creates and formats a simple backlog item', () => {
  const item = createBacklogItem('Test project backlog flow');

  assert.deepEqual(item, {
    title: 'Test project backlog flow',
    status: 'todo',
  });
  assert.equal(formatBacklogItem(item), '- [todo] Test project backlog flow');
});
