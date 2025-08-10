jest.mock('../../src/repositories/ride.repository');
jest.mock('../../src/repositories/user.repository');

const rideRepository = require('../../src/repositories/ride.repository');
const userRepository = require('../../src/repositories/user.repository');
const ridesService = require('../../src/services/rides.service');

describe('rides.service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('requestRide', () => {
    it('creates ride for rider', async () => {
      userRepository.findById.mockResolvedValue({ userType: 'rider' });
      const ride = { id: 'ride1' };
      rideRepository.createRide.mockResolvedValue(ride);
      const result = await ridesService.requestRide('rider1', { lat: 1 }, { lat: 2 }, 10);
      expect(rideRepository.createRide).toHaveBeenCalledWith({
        riderId: 'rider1',
        pickupLocation: { lat: 1 },
        destination: { lat: 2 },
        fare: 10,
        status: 'requested'
      });
      expect(result).toBe(ride);
    });

    it('throws if user not rider', async () => {
      userRepository.findById.mockResolvedValue({ userType: 'driver' });
      await expect(ridesService.requestRide('user1', {}, {}, 10)).rejects.toThrow('Only riders can request rides');
    });
  });

  describe('getAvailableRides', () => {
    it('returns available rides', async () => {
      const rides = [{ id: 1 }];
      rideRepository.findAvailableRides.mockResolvedValue(rides);
      const result = await ridesService.getAvailableRides();
      expect(result).toBe(rides);
    });
  });

  describe('acceptRide', () => {
    it('driver accepts requested ride', async () => {
      userRepository.findById.mockResolvedValue({ userType: 'driver' });
      rideRepository.findById.mockResolvedValue({ status: 'requested' });
      const updated = { id: 'ride1', status: 'accepted' };
      rideRepository.updateRide.mockResolvedValue(updated);
      const result = await ridesService.acceptRide('ride1', 'driver1');
      expect(rideRepository.updateRide).toHaveBeenCalledWith('ride1', { driverId: 'driver1', status: 'accepted' });
      expect(result).toBe(updated);
    });

    it('throws if user not driver', async () => {
      userRepository.findById.mockResolvedValue({ userType: 'rider' });
      await expect(ridesService.acceptRide('ride1', 'user1')).rejects.toThrow('Only drivers can accept rides');
    });

    it('throws if ride not available', async () => {
      userRepository.findById.mockResolvedValue({ userType: 'driver' });
      rideRepository.findById.mockResolvedValue({ status: 'accepted' });
      await expect(ridesService.acceptRide('ride1', 'driver1')).rejects.toThrow('Ride not available');
    });
  });

  describe('updateStatus', () => {
    it('updates status when authorized', async () => {
      const ride = { driverId: 'driver1', riderId: 'rider1' };
      rideRepository.findById.mockResolvedValue(ride);
      const updated = { status: 'in_progress' };
      rideRepository.updateRide.mockResolvedValue(updated);
      const result = await ridesService.updateStatus('ride1', 'driver1', 'in_progress');
      expect(rideRepository.updateRide).toHaveBeenCalledWith('ride1', { status: 'in_progress' });
      expect(result).toBe(updated);
    });

    it('sets completedAt when completed', async () => {
      const ride = { driverId: 'driver1', riderId: 'rider1' };
      rideRepository.findById.mockResolvedValue(ride);
      const updated = { status: 'completed', completedAt: new Date() };
      rideRepository.updateRide.mockResolvedValue(updated);
      const result = await ridesService.updateStatus('ride1', 'driver1', 'completed');
      const callArgs = rideRepository.updateRide.mock.calls[0][1];
      expect(callArgs.status).toBe('completed');
      expect(callArgs.completedAt).toBeInstanceOf(Date);
      expect(result).toBe(updated);
    });

    it('throws if ride not found', async () => {
      rideRepository.findById.mockResolvedValue(null);
      await expect(ridesService.updateStatus('ride1', 'driver1', 'completed')).rejects.toThrow('Ride not found');
    });

    it('throws if user not authorized', async () => {
      const ride = { driverId: 'driver1', riderId: 'rider1' };
      rideRepository.findById.mockResolvedValue(ride);
      await expect(ridesService.updateStatus('ride1', 'other', 'completed')).rejects.toThrow('Not authorized');
    });
  });

  describe('getRideHistory', () => {
    it('returns ride history for user', async () => {
      const rides = [{ id: 1 }];
      rideRepository.findUserRides.mockResolvedValue(rides);
      const result = await ridesService.getRideHistory('user1');
      expect(rideRepository.findUserRides).toHaveBeenCalledWith('user1');
      expect(result).toBe(rides);
    });
  });
});
