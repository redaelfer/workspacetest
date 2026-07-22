import { createServer, type Server } from 'node:http';

type BackendStartResult = {
  server: Server;
  message: string;
};

const startBackendServer = (port: number): Promise<BackendStartResult> => {
  if (!Number.isInteger(port) || port < 0 || port > 65535) {
    return Promise.reject(new RangeError('port must be an integer between 0 and 65535'));
  }

  const server = createServer((_request, response) => {
    response.statusCode = 200;
    response.end('backend placeholder');
  });

  return new Promise((resolve, reject) => {
    const handleError = (error: Error): void => {
      server.off('listening', handleListening);
      reject(error);
    };

    const handleListening = (): void => {
      server.off('error', handleError);
      const address = server.address();
      const listeningPort = typeof address === 'object' && address !== null ? address.port : port;

      resolve({
        server,
        message: `backend listening on ${listeningPort}`,
      });
    };

    server.once('error', handleError);
    server.once('listening', handleListening);
    server.listen(port);
  });
};

export default startBackendServer;
