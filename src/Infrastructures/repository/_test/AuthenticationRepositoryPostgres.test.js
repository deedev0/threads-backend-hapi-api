const InvariantError = require('../../../Commons/exceptions/InvariantError');
const AuthenticationTableTestHelper = require('../../../../test/AuthenticationsTableTestHelper');
const pool = require('../../database/postgres/pool');
const AuthenticationRepositoryPostgres = require('../AuthenticationRepositoryPostgres');

describe('AuthenticationRepositoryPostgres', () => {
  afterEach(async () => {
    await AuthenticationTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addToken function', () => {
    it('should add token to database', async () => {
      // Arrange
      const authenticationRepository = new AuthenticationRepositoryPostgres(pool);
      const token = 'token';

      // Action
      await authenticationRepository.addToken(token);

      // Assert
      const tokens = await AuthenticationTableTestHelper.findToken(token);
      expect(tokens).toHaveLength(1);
      expect(tokens[0].token).toBe(token);
    });

    describe('checkAvailabilityToken function', () => {
      it('should throw InvariantError if token not available', async () => {
        // Arrange
        const authenticationRepository = new AuthenticationRepositoryPostgres(pool);
        const token = 'token';

        // Action and Assert
        await expect(authenticationRepository.checkAvailabilityToken(token)).rejects.toThrow(InvariantError);
      });

      it('should not throw InvariantError if token available', async () => {
        // Arrange
        const authenticationRepository = new AuthenticationRepositoryPostgres(pool);
        const token = 'token';
        await AuthenticationTableTestHelper.addToken(token);

        // Action and Assert
        await expect(authenticationRepository.checkAvailabilityToken(token)).resolves.not.toThrow(InvariantError);
      });
    });

    describe('deleteToken function', () => {
      it('should delete token from database', async () => {
        // Arrange
        const authenticationRepository = new AuthenticationRepositoryPostgres(pool);
        const token = 'token';
        await AuthenticationTableTestHelper.addToken(token);

        // Action
        await authenticationRepository.deleteToken(token);

        // Assert
        const tokens = await AuthenticationTableTestHelper.findToken(token);
        expect(tokens).toHaveLength(0);
      });
    });
  });
});
