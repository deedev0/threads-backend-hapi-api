const UserTableTestHelper = require('../../../../test/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../test/ThreadsTableTestHelper');
const pool = require('../../database/postgres/pool');
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');
const AddComment = require('../../../Domains/comments/entities/AddComment');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');
const AddedComment = require('../../../Domains/comments/entities/AddedComment');

describe('CommentRepositoryPostgres', () => { 
  afterEach(async () => {
    await UserTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
  });

  beforeEach(async () => {
    await UserTableTestHelper.addUser({id: 'user-123', password:'secret', username: 'dicoding'});
    await ThreadsTableTestHelper.addThread({});
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addComment function', () => { 
    it('should persist add comment', async () => {
      // Arrange
      const addComment = new AddComment({
        owner: 'user-123',
        threadId: 'thread-123',
        content: 'comment',
      });

      const fakeIdGenerator = () => '123';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const comments = await commentRepositoryPostgres.addComment(addComment);

      // Assert 
      const comment = await ThreadsTableTestHelper.findComment('comment-123');
      expect(comment).toHaveLength(1);
      expect(comments).toStrictEqual(new AddedComment({
        id: 'comment-123',
        content: 'comment',
        user_id: 'user-123'
      }));
      expect(comments.id).toStrictEqual('comment-123');
      expect(comments.content).toStrictEqual(addComment.content);
      expect(comments.owner).toStrictEqual(addComment.owner);
    });
   });

  describe('verifyComment function', () => { 
    it('should throw NotFoundError when comment id not found', async () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action and Assert
      await expect(commentRepositoryPostgres.verifyComment('comment-123')).rejects.toThrow(NotFoundError);
    });

    it('should not throw NotFoundError when comment id found', async () => {
      // Arrange
      await ThreadsTableTestHelper.addComment({});

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action and Assert
      await expect(commentRepositoryPostgres.verifyComment('comment-123')).resolves.not.toThrow(NotFoundError);
    });
  });

  describe('verifyCommentOwner function', () => { 
    it('should throw Authorization Error when owner not have author', async () => {
      // Arrange
      await ThreadsTableTestHelper.addComment({});
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action and Assert
      await expect(commentRepositoryPostgres.verifyCommentOwner('user-234', 'comment-123')).rejects.toThrow(AuthorizationError);
    });

    it('should not throw Authorization Error when owner had author', async () => {
      // Arrange
      await ThreadsTableTestHelper.addComment({});
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action and Assert
      await expect(commentRepositoryPostgres.verifyCommentOwner('user-123', 'comment-123')).resolves.not.toThrow(AuthorizationError);
    });
   });

   describe('softDeleteComment function', () => { 
    it('should soft delete comment correctly', async () => {
      // Arrange
      const commentId = 'comment-123';
      await ThreadsTableTestHelper.addComment({});
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action and Assert
      await expect(commentRepositoryPostgres.softDeleteComment(commentId)).resolves.not.toThrow();
      await expect((await ThreadsTableTestHelper.findComment(commentId))[0].is_delete).toBeTruthy();
    });
    });

    describe('getCommentsByThreadId function', () => { 
      it('should return comments by threadId', async () => {
        // Arrange
        await ThreadsTableTestHelper.addComment({id: 'comment-123'});
        await ThreadsTableTestHelper.addComment({id: 'comment-234'});
        const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
        
        // Action
        const comments = await commentRepositoryPostgres.getCommentsByThreadId('thread-123');

        // Action and Assert
        await expect(comments).toHaveLength(2);
        await expect(comments).toStrictEqual(
          [
            {
              id: 'comment-123',
              thread_id: 'thread-123',
              user_id: 'user-123',
              content: 'Comment',
              date: '2021-08-08T07:19:09.775Z',
              is_delete: false
            },
            {
              id: 'comment-234',
              thread_id: 'thread-123',
              user_id: 'user-123',
              content: 'Comment',
              date: '2021-08-08T07:19:09.775Z',
              is_delete: false
            },
          ],
        );
      });
     });
 });
