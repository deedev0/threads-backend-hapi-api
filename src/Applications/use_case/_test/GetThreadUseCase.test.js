const ThreadsRepository = require('../../../Domains/threads/ThreadsRepository');
const CommentsRepository = require('../../../Domains/comments/CommentRepository');
const RepliesRepository = require('../../../Domains/replies/RepliesRepository');
const UsersRepository = require('../../../Domains/users/UserRepository');
const GetThreadUseCase = require('../GetThreadUseCase');
 
describe('GetThreadUseCase', () => {
  it('should orchestrate the get thread use case correctly', async () => {
    // Arrange
    const threadId = 'thread-123';
    const expectedThread = {
      id: 'thread-123',
      user_id: 'user-123',
      title: 'Sebuah Thread',
      body: 'Ini adalah body thread',
      date: '2021-08-08T07:19:09.775Z',
      is_delete: false,
    };
    const expectedOwnerUsername = 'dicoding';
    const expectedComments = [
      {
        id: 'comment-123',
        thread_id: 'thread-123',
        user_id: 'user-234',
        date: '2021-08-08T07:20:09.775Z',
        content: 'Sebuah komentar',
        is_delete: false,
      },
    ];
    const expectedReplies = [
      {
        id: 'reply-123',
        user_id: 'user-345',
        comment_id: 'comment-123',
        date: '2021-08-08T07:22:09.775Z',
        content: 'Sebuah balasan',
        is_delete: false,
      },
    ];
    const expectedCommentUsername = 'johndoe';
    const expectedReplyUsername = 'janedoe';
 
    const mockThreadsRepository = new ThreadsRepository();
    const mockCommentsRepository = new CommentsRepository();
    const mockRepliesRepository = new RepliesRepository();
    const mockUsersRepository = new UsersRepository();
 
    mockThreadsRepository.verifyThread = jest.fn().mockImplementation(() => Promise.resolve());
    mockThreadsRepository.getThreadById = jest.fn().mockResolvedValue(expectedThread);

    mockCommentsRepository.getCommentsByThreadId = jest.fn().mockResolvedValue(expectedComments);
    mockRepliesRepository.getRepliesByCommentId = jest.fn().mockResolvedValue(expectedReplies);
    mockUsersRepository.getUsernameById = jest.fn().mockImplementation((id) => {
      if (id === 'user-123') return Promise.resolve(expectedOwnerUsername);
      if (id === 'user-234') return Promise.resolve(expectedCommentUsername);
      if (id === 'user-345') return Promise.resolve(expectedReplyUsername);
    });
 
    const getThreadUseCase = new GetThreadUseCase({
      threadsRepository: mockThreadsRepository,
      commentsRepository: mockCommentsRepository,
      repliesRepository: mockRepliesRepository,
      usersRepository: mockUsersRepository,
    });
 
    // Action
    const result = await getThreadUseCase.execute(threadId);
 
    // Assert
    expect(mockThreadsRepository.verifyThread).toHaveBeenCalledWith(threadId);
    expect(mockThreadsRepository.getThreadById).toHaveBeenCalledWith(threadId);
    expect(mockCommentsRepository.getCommentsByThreadId).toHaveBeenCalledWith(threadId);
    expect(mockRepliesRepository.getRepliesByCommentId).toHaveBeenCalledWith('comment-123');
    expect(mockUsersRepository.getUsernameById).toHaveBeenCalledWith('user-123');
    expect(mockUsersRepository.getUsernameById).toHaveBeenCalledWith('user-234');
    expect(mockUsersRepository.getUsernameById).toHaveBeenCalledWith('user-345');
    expect(result).toEqual({
      id: 'thread-123',
      title: 'Sebuah Thread',
      body: 'Ini adalah body thread',
      date: '2021-08-08T07:19:09.775Z',
      username: 'dicoding',
      comments: [
        {
          id: 'comment-123',
          username: 'johndoe',
          date: '2021-08-08T07:20:09.775Z',
          content: 'Sebuah komentar',
          replies: [
            {
              id: 'reply-123',
              username: 'janedoe',
              date: '2021-08-08T07:22:09.775Z',
              content: 'Sebuah balasan',
            },
          ],
        },
      ],
    });
  });
 
  it('should return thread with no comments or replies', async () => {
    // Arrange
    const threadId = 'thread-123';
    const expectedThread = {
      id: 'thread-123',
      title: 'Sebuah Thread',
      body: 'Ini adalah body thread',
      date: '2021-08-08T07:19:09.775Z',
      user_id: 'user-123',
      is_delete: false,
    };
    const expectedOwnerUsername = 'dicoding';
 
    const mockThreadsRepository = new ThreadsRepository();
    const mockCommentsRepository = new CommentsRepository();
    const mockRepliesRepository = new RepliesRepository();
    const mockUsersRepository = new UsersRepository();
 
    mockThreadsRepository.verifyThread = jest.fn().mockImplementation(() => Promise.resolve());
    mockThreadsRepository.getThreadById = jest.fn().mockResolvedValue(expectedThread);
    mockUsersRepository.getUsernameById = jest.fn().mockResolvedValue(expectedOwnerUsername);
    mockCommentsRepository.getCommentsByThreadId = jest.fn().mockResolvedValue([]);
 
    const getThreadUseCase = new GetThreadUseCase({
      threadsRepository: mockThreadsRepository,
      commentsRepository: mockCommentsRepository,
      repliesRepository: mockRepliesRepository,
      usersRepository: mockUsersRepository,
    });
 
    // Action
    const result = await getThreadUseCase.execute(threadId);
 
    // Assert
    expect(mockThreadsRepository.verifyThread).toHaveBeenCalledWith(threadId);
    expect(mockThreadsRepository.getThreadById).toHaveBeenCalledWith(threadId);
    expect(mockCommentsRepository.getCommentsByThreadId).toHaveBeenCalledWith(threadId);
    expect(mockUsersRepository.getUsernameById).toHaveBeenCalledWith('user-123');
    expect(result).toEqual({
      id: 'thread-123',
      title: 'Sebuah Thread',
      body: 'Ini adalah body thread',
      date: '2021-08-08T07:19:09.775Z',
      username: 'dicoding',
      comments: [],
    });
  });
 
  it('should return comments with deleted replies', async () => {
    // Arrange
    const threadId = 'thread-123';
    const expectedThread = {
      id: 'thread-123',
      title: 'Sebuah Thread',
      body: 'Ini adalah body thread',
      date: '2021-08-08T07:19:09.775Z',
      user_id: 'user-123',
      is_delete: false,
    };
    const expectedOwnerUsername = 'dicoding';
    const expectedComments = [
      {
        id: 'comment-123',
        user_id: 'user-234',
        date: '2021-08-08T07:20:09.775Z',
        content: 'Sebuah komentar',
        thread_id: 'thread-123',
        is_delete: true,
      },
    ];
    const expectedReplies = [
      {
        id: 'reply-123',
        user_id: 'user-345',
        date: '2021-08-08T07:22:09.775Z',
        content: 'Sebuah balasan',
        comment_id: 'comment-123',
        is_delete: true,
      },
    ];
    const expectedCommentUsername = 'johndoe';
    const expectedReplyUsername = 'janedoe';
 
    const mockThreadsRepository = new ThreadsRepository();
    const mockCommentsRepository = new CommentsRepository();
    const mockRepliesRepository = new RepliesRepository();
    const mockUsersRepository = new UsersRepository();
 
    mockThreadsRepository.verifyThread = jest.fn().mockImplementation(() => Promise.resolve());
    mockThreadsRepository.getThreadById = jest.fn().mockResolvedValue(expectedThread);
    mockCommentsRepository.getCommentsByThreadId = jest.fn().mockResolvedValue(expectedComments);
    mockRepliesRepository.getRepliesByCommentId = jest.fn().mockResolvedValue(expectedReplies);
    mockUsersRepository.getUsernameById = jest.fn().mockImplementation((id) => {
      if (id === 'user-123') return Promise.resolve(expectedOwnerUsername);
      if (id === 'user-234') return Promise.resolve(expectedCommentUsername);
      if (id === 'user-345') return Promise.resolve(expectedReplyUsername);
    });
 
    const getThreadUseCase = new GetThreadUseCase({
      threadsRepository: mockThreadsRepository,
      commentsRepository: mockCommentsRepository,
      repliesRepository: mockRepliesRepository,
      usersRepository: mockUsersRepository,
    });
 
    // Action
    const threads = await getThreadUseCase.execute(threadId);
 
    // Assert
    expect(mockThreadsRepository.verifyThread).toHaveBeenCalledWith(threadId);
    expect(mockThreadsRepository.getThreadById).toHaveBeenCalledWith(threadId);
    expect(mockCommentsRepository.getCommentsByThreadId).toHaveBeenCalledWith(threadId);
    expect(mockRepliesRepository.getRepliesByCommentId).toHaveBeenCalledWith('comment-123');
    expect(mockUsersRepository.getUsernameById).toHaveBeenCalledWith('user-123');
    expect(mockUsersRepository.getUsernameById).toHaveBeenCalledWith('user-234');
    expect(mockUsersRepository.getUsernameById).toHaveBeenCalledWith('user-345');
    
    expect(threads).toStrictEqual(
      {
        id: 'thread-123',
        title: 'Sebuah Thread',
        body: 'Ini adalah body thread',
        date: '2021-08-08T07:19:09.775Z',
        username: 'dicoding',
        comments: [
          {
            id: 'comment-123',
            username: 'johndoe',
            date: '2021-08-08T07:20:09.775Z',
            content: '**komentar telah dihapus**',
            replies: [
              {
                id: 'reply-123',
                username: 'janedoe',
                date: '2021-08-08T07:22:09.775Z',
                content: '**balasan telah dihapus**',
              },
            ],
          },
        ],
      },
    );
    expect(threads.id).toStrictEqual(threadId);
    expect(threads.username).toStrictEqual(expectedOwnerUsername);
    expect(threads.comments[0].content).toStrictEqual('**komentar telah dihapus**');
    expect(threads.comments[0].replies[0].content).toStrictEqual('**balasan telah dihapus**');
  });
});