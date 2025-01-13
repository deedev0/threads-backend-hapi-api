const routes = (handler) => [
  {
    method: 'POST',
    path: '/threads',
    handler: handler.postThreadHandler,
  },
  {
    method: 'GET',
    path: '/threads/{threadId}',
    handler: handler.getThreadHandler,
  },
  {
    method: 'GET',
    path: '/threads/welcome',
    handler: handler.getWelcomeThreadHandler,
  },
];

module.exports = routes;
