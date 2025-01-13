const AddReplyUseCase = require('../../../../Applications/use_case/AddReplyUseCase');
const DeleteReplyCommentUseCase = require('../../../../Applications/use_case/DeleteReplyCommentUseCase');
const AuthenticationTokenManager = require('../../../../Applications/security/AuthenticationTokenManager');

class RepliesHandler {
  constructor(container) {
    this._container = container;
    this.postReplyHandler = this.postReplyHandler.bind(this);
    this.deleteReplyHandler = this.deleteReplyHandler.bind(this);
  }

  async postReplyHandler(request, h) {
    const addReplyUseCase = this._container.getInstance(AddReplyUseCase.name);
    const id = await this._verifyActionAndGetUserId(request.headers.authorization);
    const addedReply = await addReplyUseCase.execute(request.payload, request.params.threadId, request.params.commentId, id);

    const response = h.response({
      status: 'success',
      data: {
        addedReply: addedReply,
      },
    });
    response.code(201);
    return response;
  }

  async deleteReplyHandler(request, h) {
    const deleteReplyCommentUseCase = this._container.getInstance(DeleteReplyCommentUseCase.name);
    const id = await this._verifyActionAndGetUserId(request.headers.authorization);
    await deleteReplyCommentUseCase.execute(request.params.replyId, id);

    const response = h.response({
      status: 'success',
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

module.exports = RepliesHandler;
