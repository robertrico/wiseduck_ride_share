jest.mock('../../src/repositories/user.repository');

const userRepository = require('../../src/repositories/user.repository');
const usersService = require('../../src/services/users.service');

describe('users.service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getProfile', () => {
    it('returns user when found', async () => {
      const user = { id: '1' };
      userRepository.findById.mockResolvedValue(user);
      const result = await usersService.getProfile('1');
      expect(userRepository.findById).toHaveBeenCalledWith('1');
      expect(result).toBe(user);
    });

    it('throws if user not found', async () => {
      userRepository.findById.mockResolvedValue(null);
      await expect(usersService.getProfile('1')).rejects.toThrow('User not found');
    });
  });

  describe('updateProfile', () => {
    it('updates user profile', async () => {
      const updated = { id: '1', name: 'Alice' };
      userRepository.updateUser.mockResolvedValue(updated);
      const result = await usersService.updateProfile('1', { name: 'Alice' });
      expect(userRepository.updateUser).toHaveBeenCalledWith('1', { name: 'Alice' });
      expect(result).toBe(updated);
    });
  });

  describe('updateVehicles', () => {
    it('updates vehicles for a driver', async () => {
      const save = jest.fn().mockResolvedValue({ vehicles: [{ make: 'Tesla' }] });
      const user = { userType: 'driver', save };
      userRepository.findById.mockResolvedValue(user);
      const result = await usersService.updateVehicles('1', [{ make: 'Tesla' }]);
      expect(user.vehicles).toEqual([{ make: 'Tesla' }]);
      expect(save).toHaveBeenCalled();
      expect(result).toEqual({ vehicles: [{ make: 'Tesla' }] });
    });

    it('throws if user not driver', async () => {
      userRepository.findById.mockResolvedValue({ userType: 'rider' });
      await expect(usersService.updateVehicles('1', [])).rejects.toThrow('Only drivers can update vehicles');
    });

    it('throws if user not found', async () => {
      userRepository.findById.mockResolvedValue(null);
      await expect(usersService.updateVehicles('1', [])).rejects.toThrow('Only drivers can update vehicles');
    });
  });
});
