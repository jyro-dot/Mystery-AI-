import { Test, TestingModule } from '@nestjs/testing';
import { HealthService } from './health.service';

describe('HealthService', () => {
  let service: HealthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HealthService],
    }).compile();

    service = module.get<HealthService>(HealthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('check', () => {
    it('should return health check response', () => {
      const result = service.check();

      expect(result).toBeDefined();
      expect(result).toHaveProperty('status');
      expect(result).toHaveProperty('timestamp');
      expect(result).toHaveProperty('uptime');
    });

    it('should return status as "ok"', () => {
      const result = service.check();

      expect(result.status).toBe('ok');
    });

    it('should return valid ISO timestamp', () => {
      const result = service.check();
      const date = new Date(result.timestamp);

      expect(date.getTime()).not.toBeNaN();
      expect(result.timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
    });

    it('should return uptime as number', () => {
      const result = service.check();

      expect(typeof result.uptime).toBe('number');
      expect(result.uptime).toBeGreaterThanOrEqual(0);
    });

    it('should have increasing uptime on subsequent calls', (done) => {
      const result1 = service.check();
      const uptime1 = result1.uptime;

      setTimeout(() => {
        const result2 = service.check();
        const uptime2 = result2.uptime;

        expect(uptime2).toBeGreaterThanOrEqual(uptime1);
        done();
      }, 100);
    });
  });
});
