jest.mock('../../src/repositories/user.repository');
jest.mock('bcryptjs');
jest.mock('jsonwebtoken');

const userRepository = require('../../src/repositories/user.repository');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authService = require('../../src/services/auth.service');

describe('auth.service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('creates a new user when email not in use', async () => {
      userRepository.findByEmail.mockResolvedValue(null);
      bcrypt.hash.mockResolvedValue('hashed');
      const user = { id: '1' };
      userRepository.createUser.mockResolvedValue(user);

      const result = await authService.register({ email: 'test@example.com', password: 'pw' });

      expect(bcrypt.hash).toHaveBeenCalledWith('pw', 10);
      expect(userRepository.createUser).toHaveBeenCalledWith({ email: 'test@example.com', password: 'hashed' });
      expect(result).toBe(user);
    });

    it('throws if email already in use', async () => {
      userRepository.findByEmail.mockResolvedValue({ id: '1' });
      await expect(authService.register({ email: 'test@example.com', password: 'pw' })).rejects.toThrow('Email already in use');
    });
  });

  describe('login', () => {
    beforeEach(() => {
      process.env.JWT_SECRET = 'secret';
    });

    it('returns user and token on valid credentials', async () => {
      const user = { _id: '1', password: 'hashed' };
      userRepository.findByEmail.mockResolvedValue(user);
      bcrypt.compare.mockResolvedValue(true);
      jwt.sign.mockReturnValue('token');

      const result = await authService.login('test@example.com', 'pw');

      expect(bcrypt.compare).toHaveBeenCalledWith('pw', 'hashed');
      expect(jwt.sign).toHaveBeenCalledWith({ id: user._id }, 'secret', { expiresIn: '7d' });
      expect(result).toEqual({ user, token: 'token' });
    });

    it('throws if user not found', async () => {
      userRepository.findByEmail.mockResolvedValue(null);
      await expect(authService.login('test@example.com', 'pw')).rejects.toThrow('Invalid credentials');
    });

    it('throws if password mismatch', async () => {
      const user = { _id: '1', password: 'hashed' };
      userRepository.findByEmail.mockResolvedValue(user);
      bcrypt.compare.mockResolvedValue(false);
      await expect(authService.login('test@example.com', 'pw')).rejects.toThrow('Invalid credentials');
    });
  });
});
