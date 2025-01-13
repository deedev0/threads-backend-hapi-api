const UserTableTestHelper = require('../../../../test/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../test/ThreadsTableTestHelper');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const pool = require('../../database/postgres/pool');
const ThreadsRepositoryPostgres = require('../ThreadsRepositoryPostgres');
const AddThread = require('../../../Domains/threads/entities/AddThread');
const AddedThread = require('../../../Domains/threads/entities/AddedThread');

describe('ThreadsRepositoryPostgres', () => {
  afterEach(async () => {
    await UserTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
  });

  beforeEach(async () => {
    await UserTableTestHelper.addUser({
      id: 'user-123',
      username: 'dicoding',
      fullname: 'Dicoding Indonesia',
      password: 'secret',
    });
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addThread function', () => {
    it('should persist add thread', async () => {
      // Arrange
      const addThread = new AddThread({
        id: 'user-123',
        title: 'Sebuah Thread',
        body: 'Dicoding Indonesia',
      });
      const fakeIdGenerator = () => '123'; //stub
      const threadsRepositoryPostgres = new ThreadsRepositoryPostgres(
        pool,
        fakeIdGenerator,
      );

      // Action
      const addedThread = await threadsRepositoryPostgres.addThread(addThread);

      // Assert
      const thread = await ThreadsTableTestHelper.findThread('thread-123');
      expect(thread).toHaveLength(1);
      expect(addedThread).toStrictEqual(new AddedThread({
        id: 'thread-123',
        title: 'Sebuah Thread',
        user_id: 'user-123',
      }));
    });
  });

  describe('verifyThread function', () => {
    it('should throw NotFoundError when thread id not found', async () => {
      // Arrange
      const fakeIdGenerator = () => '123'; //stub
      const threadsRepositoryPostgres = new ThreadsRepositoryPostgres(
        pool,
        fakeIdGenerator,
      );

      // Action and Assert
      await expect(
        threadsRepositoryPostgres.verifyThread('thread-123'),
      ).rejects.toThrow(NotFoundError);
      const thread = await ThreadsTableTestHelper.findThread('thread-123');
      expect(thread).toHaveLength(0);
    });

    it('should not throw NotFoundError when thread id found', async () => {
      // Arrange 
      await ThreadsTableTestHelper.addThread({});
      const threadsRepositoryPostgres = new ThreadsRepositoryPostgres(pool, {});

      // Action and Assert
      await expect(threadsRepositoryPostgres.verifyThread('thread-123')).resolves.not.toThrow(NotFoundError);
    })
  });

  describe('getThread function', () => {
    it('should return thread with comments and replies', async () => {
      // Arrange
      const threadId = 'thread-123';
      await ThreadsTableTestHelper.addThread({id: threadId});
      const threadsRepositoryPostgres = new ThreadsRepositoryPostgres(pool, {});
      
      // Action
      const threads = await threadsRepositoryPostgres.getThreadById(threadId);

      // Assert
      await expect(typeof threads).toBe('object');
      await expect(threads).toStrictEqual(
        {
          id: 'thread-123',
          user_id: 'user-123',
          title: 'Sebuah Thread',
          body: 'Ini adalah body thread',
          date: '2021-08-08T07:19:09.775Z',
          is_delete: false
        },  
      );
    });
  });
  
});