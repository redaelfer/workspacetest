const DEFAULT_STATUS = 'todo';

function normalizeStatus(status) {
  if (typeof status !== 'string' || status.trim() === '') {
    return DEFAULT_STATUS;
  }

  return status.trim().toLowerCase();
}

function summarizeBacklogItems(items) {
  if (!Array.isArray(items)) {
    throw new TypeError('items must be an array');
  }

  return items.reduce((summary, item) => {
    const status = normalizeStatus(item && item.status);
    summary[status] = (summary[status] || 0) + 1;
    return summary;
  }, {});
}

function formatBacklogSummary(items) {
  const summary = summarizeBacklogItems(items);
  const statuses = Object.keys(summary).sort();

  if (statuses.length === 0) {
    return 'No backlog items yet.';
  }

  return statuses.map((status) => `${status}: ${summary[status]}`).join(', ');
}

module.exports = {
  formatBacklogSummary,
  summarizeBacklogItems,
};
