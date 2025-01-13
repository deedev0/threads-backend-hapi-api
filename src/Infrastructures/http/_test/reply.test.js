const AuthenticationsTableTestHelper = require('../../../../test/AuthenticationsTableTestHelper');
const UsersTableTestHelper = require('../../../../test/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../test/ThreadsTableTestHelper');
const pool = require('../../database/postgres/pool')
const createServer = require('../createServer');
const container = require('../../container');
const ServersTableTestHelper = require('../../../../test/ServersTableTestHelper');

describe('CRUD reply', () => { 
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await AuthenticationsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
  });

  describe('when POST /threads/{theadiId}/comments/{commentId}/replies', () => {
    it('should response 201 and new reply comment', async () => {
      // Arrange
      const requestPayload = {
        content: 'reply comment',
      };

      const server = await createServer(container);

      // login, add thread, add comment
      const { accessToken, user_id } = await ServersTableTestHelper.getAccessTokenAndUserId({ server });
      const threadId = 'thread-123';
      const commentId = 'comment-123';

      await ThreadsTableTestHelper.addThread({ id: threadId, user_id: user_id });
      await ThreadsTableTestHelper.addComment({ id: commentId, user_id: user_id, thread_id: threadId });

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments/${commentId}/replies`,
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data).toBeDefined();
      expect(responseJson.data.addedReply).toBeDefined();
      expect(responseJson.data.addedReply.id).toBeDefined();
      expect(responseJson.data.addedReply.content).toBeDefined();
      expect(responseJson.data.addedReply.owner).toBeDefined();
    });
  });

  describe('when DELETE /threads/{threadId}/comments/{commentId}/replies/{replyId}', () => { 
    it('should response 200 and delete reply comment correctly', async () => {
      // Arrange
      const server = await createServer(container);
      const threadId = 'thread-123';
      const commentId = 'comment-123';
      const replyId = 'reply-123';

      // Login, add thread, add comment and reply
      const { accessToken, user_id } = await ServersTableTestHelper.getAccessTokenAndUserId({ server });
      await ThreadsTableTestHelper.addThread({user_id: user_id});
      await ThreadsTableTestHelper.addComment({user_id: user_id});
      await ThreadsTableTestHelper.addReplyComment({user_id: user_id});

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}/replies/${replyId}`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
    });
   });
 });
