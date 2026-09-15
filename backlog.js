function createBacklogItem(title) {
  return {
    title,
    status: 'todo',
  };
}

function formatBacklogItem(item) {
  return `- [${item.status}] ${item.title}`;
}

module.exports = {
  createBacklogItem,
  formatBacklogItem,
};
