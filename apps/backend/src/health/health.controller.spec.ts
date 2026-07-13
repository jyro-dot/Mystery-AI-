import { Test, TestingModule } from '@nestjs/testing';
import { HealthController } from './health.controller';
import { HealthService } from './health.service';

describe('HealthController', () => {
  let controller: HealthController;
  let service: HealthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HealthController],
      providers: [HealthService],
    }).compile();

    controller = module.get<HealthController>(HealthController);
    service = module.get<HealthService>(HealthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('check', () => {
    it('should return health status', async () => {
      const result = await controller.check();

      expect(result).toBeDefined();
      expect(result.status).toBe('ok');
      expect(result.timestamp).toBeDefined();
      expect(result.uptime).toBeDefined();
      expect(typeof result.uptime).toBe('number');
    });

    it('should have valid timestamp format', async () => {
      const result = await controller.check();
      const date = new Date(result.timestamp);

      expect(date.getTime()).not.toBeNaN();
    });

    it('should have uptime greater than or equal to 0', async () => {
      const result = await controller.check();

      expect(result.uptime).toBeGreaterThanOrEqual(0);
    });

    it('should call healthService.check()', async () => {
      const spy = jest.spyOn(service, 'check');

      await controller.check();

      expect(spy).toHaveBeenCalled();
    });
  });
});
