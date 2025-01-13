const ThreadUserUseCase = require('../../../../Applications/use_case/ThreadUserUseCase');
const GetThreadUseCase = require('../../../../Applications/use_case/GetThreadUseCase');
const AuthenticationTokenManager = require('../../../../Applications/security/AuthenticationTokenManager');

class ThreadsHandler {
  constructor(container) {
    this._container = container;

    this.postThreadHandler = this.postThreadHandler.bind(this);
    this.getThreadHandler = this.getThreadHandler.bind(this);

  }

  async postThreadHandler(request, h) {
    const threadUserUseCase = this._container.getInstance(ThreadUserUseCase.name);
    const id = await this._verifyActionAndGetUserId(request.headers.authorization);
    const addedThread = await threadUserUseCase.execute(request.payload, id);

    const response = h.response({
      status: 'success',
      data: {
        addedThread: addedThread,
      },
    });
    response.code(201);
    return response;
  }

  async getThreadHandler(request, h) {
    const getThreadUseCase = this._container.getInstance(GetThreadUseCase.name);
    const thread = await getThreadUseCase.execute(request.params.threadId);
    
    const response = h.response({
      status: 'success',
      data: {
        thread,
      },
    });
    response.code(200);
    return response;
  }

  async _verifyActionAndGetUserId(headerAuthorization) {
    const authenticationTokenManager = this._container.getInstance(AuthenticationTokenManager.name);
    const acccessToken = await authenticationTokenManager.getTokenFromHeader(headerAuthorization);
    await authenticationTokenManager.verifyAccessToken(acccessToken);
    const { id } = await authenticationTokenManager.decodePayload(acccessToken);
    return id;
  }

}

module.exports = ThreadsHandler;
