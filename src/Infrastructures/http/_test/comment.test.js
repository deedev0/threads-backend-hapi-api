const AuthenticationsTableTestHelper = require('../../../../test/AuthenticationsTableTestHelper');
const UsersTableTestHelper = require('../../../../test/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../test/ThreadsTableTestHelper');
const pool = require('../../database/postgres/pool')
const createServer = require('../createServer');
const container = require('../../container');
const ServersTableTestHelper = require('../../../../test/ServersTableTestHelper');

describe('CRUD comments', () => { 
  afterAll(async () => {
    await pool.end();
  });

  afterEach( async () => {
    await UsersTableTestHelper.cleanTable();
    await AuthenticationsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
  });

  describe('when POST /threads/{threadId}/comments', () => { 
    it('should response 201 and new comments', async () => {
      // Arrange
      const requestPayload = {
        content: 'comment',
      };

      const server = await createServer(container);

      // login and add thread
      const { accessToken, user_id } = await ServersTableTestHelper.getAccessTokenAndUserId({ server });
      const threadId = 'thread-123';

      await ThreadsTableTestHelper.addThread({ id: threadId, user_id: user_id });

      // action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data).toBeDefined();
      expect(responseJson.data.addedComment).toBeDefined();
      expect(responseJson.data.addedComment.id).toBeDefined();
      expect(responseJson.data.addedComment.content).toBeDefined();
      expect(responseJson.data.addedComment.owner).toBeDefined();
    });
   });
   
  describe('when DELETE /threads/{threadId}/comments/{commentId}', () => { 
    it('should response 200 and soft delete', async () => {
      // Arrange
      const server = await createServer(container);
      const threadId = 'thread-123';
      const commentId = 'comment-123';

      // login and add thread
      const { accessToken, user_id } = await ServersTableTestHelper.getAccessTokenAndUserId({ server });
      await ThreadsTableTestHelper.addThread({user_id: user_id});
      await ThreadsTableTestHelper.addComment({user_id: user_id});

      // action 
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}`,
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
