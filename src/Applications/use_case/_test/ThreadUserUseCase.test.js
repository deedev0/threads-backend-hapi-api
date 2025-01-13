const ThreadUserUseCase = require('../ThreadUserUseCase');
const ThreadsRepository = require('../../../Domains/threads/ThreadsRepository');
const AddThread = require('../../../Domains/threads/entities/AddThread');

describe('ThreadUserUSeCase', () => { 
  it('should orchestrating the add thread action correctly', async () => {
    // Arrange    
    const addThreadPayload = {
      id: 'user-123',
      title: 'Sebuah Thread',
      body: 'Ini adalah body thread',
    };
    const mockThreadsRepository = new ThreadsRepository();
    const threadUserUseCase = new ThreadUserUseCase({
      threadsRepository: mockThreadsRepository,
    });

    // mocking
    mockThreadsRepository.addThread = jest.fn()
      .mockImplementation(() => Promise.resolve(new AddThread(addThreadPayload)));

    // Action
   const addThread =  await threadUserUseCase.execute(addThreadPayload, addThreadPayload.id);

    // Assert
    expect(mockThreadsRepository.addThread).toHaveBeenCalledWith(addThreadPayload)
    expect(addThread).toBeDefined();
    expect(addThread.id).toStrictEqual(addThreadPayload.id);
    expect(addThread.title).toStrictEqual(addThreadPayload.title);
    expect(addThread.body).toStrictEqual(addThreadPayload.body);
  });
 });
