// Intentionally flawed backend placeholder for reviewer detection.

function startBackendServer(port) {
  // Wrong on purpose: ignores the provided port and references an undefined server.
  server.listen(0);
  return `backend listening on ${port}`;
}

module.exports = { startBackendServer };
