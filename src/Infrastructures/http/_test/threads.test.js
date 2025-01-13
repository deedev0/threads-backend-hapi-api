const pool = require('../../database/postgres/pool');
const UsersTableTestHelper = require('../../../../test/UsersTableTestHelper');
const AuthenticationsTableTestHelper = require('../../../../test/AuthenticationsTableTestHelper');
const ThreadsTableTestHelper = require('../../../../test/ThreadsTableTestHelper');
const container = require('../../container');
const createServer = require('../createServer');

describe('/threads endpoint', () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await AuthenticationsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
  });

  
  describe('when POST /threads', () => {
    it('should response 201 and new thread', async () => {
      // arrange 
      const registerPayload = {
        username: 'dicoding',
        password: 'secret',
        fullname: 'Dicoding Indonesia'
      };

      const authPayload = {
        username: 'dicoding',
        password: 'secret',
      };

      const payload = {
        title: 'Sebuah Thread',
        body: 'Ini adalah body thread',
      };
      const server = await createServer(container);

      // Action

      await server.inject({
        method: 'POST',
        url: '/users',
        payload: registerPayload,
      });

      const responseAuth = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: authPayload,
      });

      const responseAuthJson = JSON.parse(responseAuth.payload);

      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: payload,
        headers: {
          Authorization: `Bearer ${responseAuthJson.data.accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.addedThread).toBeDefined();
      expect(responseJson.data.addedThread.id).toBeDefined();
      expect(responseJson.data.addedThread.title).toBeDefined();
      expect(responseJson.data.addedThread.owner).toBeDefined();
    });

    it('should response 400 when adding thread without access token', async () => {
      // arrange 
      const payload = {
        title: 'Sebuah Thread',
        body: 'Ini adalah body thread',
      };
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: payload,
        headers: {
          Authorization: 'Bearer token',
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('access token tidak valid');
    });
  });

  describe('when GET /threads/{threadId}', () => { 
    it('should response 200 and get detail thread correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await ThreadsTableTestHelper.addComment({});
      await ThreadsTableTestHelper.addReplyComment({});
      await ThreadsTableTestHelper.addReplyComment({id: 'reply-234'});
      await ThreadsTableTestHelper.addReplyComment({id: 'reply-345'});

      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'GET',
        url: '/threads/thread-123',
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data).toBeDefined();
    });
   });
});
