jest.mock('mongoose', () => ({
  connect: jest.fn().mockResolvedValue(true)
}));

const { connect } = require('../../src/utils/db');

describe('db.connect', () => {
  afterEach(() => {
    delete process.env.MONGODB_URI;
    jest.clearAllMocks();
  });

  it('throws if MONGODB_URI is missing', async () => {
    await expect(connect()).rejects.toThrow('MONGODB_URI not set');
  });

  it('connects using MONGODB_URI and returns mongoose instance', async () => {
    process.env.MONGODB_URI = 'mongodb://localhost/test';
    const mongooseMock = require('mongoose');
    const result = await connect();
    expect(mongooseMock.connect).toHaveBeenCalledWith('mongodb://localhost/test');
    expect(result).toBe(mongooseMock);
  });
});
