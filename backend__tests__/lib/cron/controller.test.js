'use strict';

jest.mock('cl.jotacalderon.cf.framework/lib/log', () => {
  return () => ({
    info: jest.fn(),
    error: jest.fn(),
  });
});

jest.mock('../../../backend/lib/_repository/_', () => ({
  monitor: jest.fn(),
  create: jest.fn(),
}));

const controller = require('../../../backend/lib/cron/controller');
const repository = require('../../../backend/lib/_repository/_');

describe('lib/cron/controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('monitor', () => {
    it('should execute monitor and create successfully', async () => {
      const mockMonitor = {
        status: 'ok',
      };

      repository.monitor.mockResolvedValue(mockMonitor);
      repository.create.mockResolvedValue(true);

      await controller.monitor();

      expect(repository.monitor).toHaveBeenCalledTimes(1);

      expect(repository.create).toHaveBeenCalledWith('mongo_monitor', mockMonitor);
    });

    it('should throw error if repository.monitor fails', async () => {
      repository.monitor.mockRejectedValue(new Error('Monitor error'));

      await expect(controller.monitor()).rejects.toThrow('Monitor error');
    });

    it('should throw error if repository.create fails', async () => {
      repository.monitor.mockResolvedValue({
        status: 'ok',
      });

      repository.create.mockRejectedValue(new Error('Create error'));

      await expect(controller.monitor()).rejects.toThrow('Create error');
    });
  });
});
