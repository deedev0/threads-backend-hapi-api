/* istanbul ignore file */

const { createContainer } = require('instances-container');

// external agency
const { nanoid } = require('nanoid');
const bcrypt = require('bcrypt');
const Jwt = require('@hapi/jwt');
const pool = require('./database/postgres/pool');

// service (repository, helper, manager, etc)
const UserRepository = require('../Domains/users/UserRepository'); // interface register dan login userrepository
const UserRepositoryPostgres = require('./repository/UserRepositoryPostgres'); // implementasi dari UserRepository
const ThreadsRepository = require('../Domains/threads/ThreadsRepository');
const ThreadsRepositoryPostgres = require('../Infrastructures/repository/ThreadsRepositoryPostgres');
const PasswordHash = require('../Applications/security/PasswordHash'); // interface hash dan compare password
const BcryptPasswordHash = require('./security/BcryptPasswordHash'); // implementasi dari PasswrodHash
const CommentRepository = require('../Domains/comments/CommentRepository');
const CommentRepositoryPostgres = require('./repository/CommentRepositoryPostgres');
const RepliesRepository = require('../Domains/replies/RepliesRepository');
const RepliesRepositoryPostgres = require('./repository/RepliesRepositoryPostgres');

// use case abstraksi/interface
const AddUserUseCase = require('../Applications/use_case/AddUserUseCase');
const AuthenticationTokenManager = require('../Applications/security/AuthenticationTokenManager'); // interface token manager
const JwtTokenManager = require('./security/JwtTokenManager'); // implementasi AuthenticationTokenManager
const LoginUserUseCase = require('../Applications/use_case/LoginUserUseCase'); // mandor login
const AuthenticationRepository = require('../Domains/authentications/AuthenticationRepository'); // interface untuk berhubungan dengan database
const AuthenticationRepositoryPostgres = require('./repository/AuthenticationRepositoryPostgres'); // implementasi dari interface AuthenticationRepository
const LogoutUserUseCase = require('../Applications/use_case/LogoutUserUseCase');
const RefreshAuthenticationUseCase = require('../Applications/use_case/RefreshAuthenticationUseCase');

const ThreadUserUseCase = require('../Applications/use_case/ThreadUserUseCase');
const AddCommentUseCase = require('../Applications/use_case/AddCommentUseCase');
const DeleteCommentUseCase = require('../Applications/use_case/DeleteCommentUseCase');
const GetThreadUseCase = require('../Applications/use_case/GetThreadUseCase');
const AddReplyUseCase = require('../Applications/use_case/AddReplyUseCase');
const DeleteReplyCommentUseCase = require('../Applications/use_case/DeleteReplyCommentUseCase');


// creating container
const container = createContainer();

// registering services and repository
// menyimpan servis dan repositroy / database
container.register([
  {
    key: UserRepository.name, // Abstraksi
    Class: UserRepositoryPostgres, // Implementasi
    parameter: {
      dependencies: [
        {
          concrete: pool,
        },
        {
          concrete: nanoid,
        },
      ],
    },
  },
  {
    key: AuthenticationRepository.name,
    Class: AuthenticationRepositoryPostgres,
    parameter: {
      dependencies: [
        {
          concrete: pool,
        },
      ]
    },
  },
  {
    key: PasswordHash.name, // Abstraksi
    Class: BcryptPasswordHash, // Implementasi
    parameter: {
      dependencies: [
        {
          concrete: bcrypt,
        },
      ],
    },
  },
  {
    key: AuthenticationTokenManager.name,
    Class: JwtTokenManager,
    parameter: {
      dependencies: [
        {
          concrete: Jwt.token,
        },
      ],
    },
  },
  {
    key: ThreadsRepository.name,
    Class: ThreadsRepositoryPostgres,
    parameter: {
      dependencies: [
        {
          concrete: pool,
        },
        {
          concrete: nanoid,
        },
      ],
    },
  },
  {
    key: CommentRepository.name,
    Class: CommentRepositoryPostgres,
    parameter: {
      dependencies: [
        {
          concrete: pool,
        },
        {
          concrete: nanoid,
        },
      ],
    },
  },
  {
    key: RepliesRepository.name,
    Class: RepliesRepositoryPostgres,
    parameter: {
      dependencies: [
        {
          concrete: pool,
        },
        {
          concrete: nanoid,
        },
      ],
    },
  },
]);

// registering use case
// use case / orchestracting / mandor
container.register([
  {
    key: AddUserUseCase.name, // Implementasi class langsung
    Class: AddUserUseCase, // Implementasi case mandor atau final dari 1 fitur
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'userRepository', // tadi name class yang abstraksi diatas
          internal: UserRepository.name,
        },
        {
          name: 'passwordHash', // tadi name class yang abstraksi diatas
          internal: PasswordHash.name,
        },
      ],
    },
  },
  {
    key: LoginUserUseCase.name,
    Class: LoginUserUseCase, // case mandor atau finalnya
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'userRepository',
          internal: UserRepository.name,
        },
        {
          name: 'authenticationRepository',
          internal: AuthenticationRepository.name,
        },
        {
          name: 'authenticationTokenManager',
          internal: AuthenticationTokenManager.name,
        },
        {
          name: 'passwordHash',
          internal: PasswordHash.name,
        },
      ],
    },
  },
  {
    key: LogoutUserUseCase.name,
    Class: LogoutUserUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'authenticationRepository',
          internal: AuthenticationRepository.name,
        },
      ],
    },
  },
  {
    key: RefreshAuthenticationUseCase.name,
    Class: RefreshAuthenticationUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'authenticationRepository',
          internal: AuthenticationRepository.name,
        },
        {
          name: 'authenticationTokenManager',
          internal: AuthenticationTokenManager.name,
        },
      ],
    },
  },
  {
    key: ThreadUserUseCase.name,
    Class: ThreadUserUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'threadsRepository',
          internal: ThreadsRepository.name,
        },
        {
          name: 'authenticationTokenManager',
          internal: AuthenticationTokenManager.name,
        },
      ],
    },
  },
  {
    key: AddCommentUseCase.name,
    Class: AddCommentUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'commentRepository',
          internal: CommentRepository.name,
        },
        {
          name: 'authenticationTokenManager',
          internal: AuthenticationTokenManager.name,
        },
        {
          name: 'threadsRepository',
          internal: ThreadsRepository.name,
        },
      ],
    },
  },
  {
    key: DeleteCommentUseCase.name,
    Class: DeleteCommentUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'commentRepository',
          internal: CommentRepository.name,
        },
        {
          name: 'authenticationTokenManager',
          internal: AuthenticationTokenManager.name,
        },
      ],
    },
  },
  {
    key: GetThreadUseCase.name,
    Class: GetThreadUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'threadsRepository',
          internal: ThreadsRepository.name,
        },
        {
          name: 'commentsRepository',
          internal: CommentRepository.name,
        },
        {
          name: 'repliesRepository',
          internal: RepliesRepository.name,
        },
        {
          name: 'usersRepository',
          internal: UserRepository.name,
        },
      ],
    },
  },
  {
    key: AddReplyUseCase.name,
    Class: AddReplyUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'threadsRepository',
          internal: ThreadsRepository.name,
        },
        {
          name: 'commentRepository',
          internal: CommentRepository.name,
        },
        {
          name: 'repliesCommentRepository',
          internal: RepliesRepository.name,
        },
        {
          name: 'authenticationTokenManager',
          internal: AuthenticationTokenManager.name,
        },
      ],
    },
  },
  {
    key: DeleteReplyCommentUseCase.name,
    Class: DeleteReplyCommentUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'repliesRepository',
          internal: RepliesRepository.name,
        },
        {
          name: 'authenticationTokenManager',
          internal: AuthenticationTokenManager.name,
        },
      ],
    },
  },
]);

module.exports = container;
