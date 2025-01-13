const AddCommentUseCase = require('../../../../Applications/use_case/AddCommentUseCase');
const DeleteCommentUseCase = require('../../../../Applications/use_case/DeleteCommentUseCase');
const AuthenticationTokenManager = require('../../../../Applications/security/AuthenticationTokenManager');


class CommentsHandler {
  constructor(container) {
    this._container = container;
    this.postCommentHandler = this.postCommentHandler.bind(this);
    this.deleteCommentHandler = this.deleteCommentHandler.bind(this);
  }

  async postCommentHandler(request, h) {
    const addCommentUseCase = this._container.getInstance(AddCommentUseCase.name);

    const id = await this._verifyActionAndGetUserId(request.headers.authorization);

    const addedComment = await addCommentUseCase.execute(request.payload, request.params.threadId, id);

    const response = h.response({
      status: 'success',
      data: {
        addedComment: addedComment,
      },
    });
    response.code(201);
    return response;
  }

  async deleteCommentHandler(request, h) {
    const deleteCommentUseCase = this._container.getInstance(DeleteCommentUseCase.name);
    const id = await this._verifyActionAndGetUserId(request.headers.authorization);
    await deleteCommentUseCase.execute(request.params.commentId, id);

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

module.exports = CommentsHandler;
