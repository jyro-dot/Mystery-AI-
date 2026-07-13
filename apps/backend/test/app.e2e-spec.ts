import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import helmet from 'helmet';
import compression from 'compression';

describe('App E2E', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    // Apply middleware
    app.use(helmet());
    app.use(compression());

    // Global validation pipe
    app.setGlobalPrefix('api');
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Health Check (GET /api/health)', () => {
    it('should return 200 status code', () => {
      return request(app.getHttpServer())
        .get('/api/health')
        .expect(200);
    });

    it('should return health check response with correct structure', () => {
      return request(app.getHttpServer())
        .get('/api/health')
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('status');
          expect(res.body).toHaveProperty('timestamp');
          expect(res.body).toHaveProperty('uptime');
          expect(res.body.status).toBe('ok');
          expect(typeof res.body.uptime).toBe('number');
        });
    });

    it('should return valid ISO 8601 timestamp', () => {
      return request(app.getHttpServer())
        .get('/api/health')
        .expect(200)
        .expect((res) => {
          const date = new Date(res.body.timestamp);
          expect(date.getTime()).not.toBeNaN();
        });
    });

    it('should return non-negative uptime', () => {
      return request(app.getHttpServer())
        .get('/api/health')
        .expect(200)
        .expect((res) => {
          expect(res.body.uptime).toBeGreaterThanOrEqual(0);
        });
    });

    it('should have correct content type', () => {
      return request(app.getHttpServer())
        .get('/api/health')
        .expect('Content-Type', /json/);
    });

    it('should include security headers', () => {
      return request(app.getHttpServer())
        .get('/api/health')
        .expect((res) => {
          expect(res.headers['x-content-type-options']).toBeDefined();
          expect(res.headers['x-frame-options']).toBeDefined();
          expect(res.headers['x-xss-protection']).toBeDefined();
        });
    });
  });

  describe('API Prefix', () => {
    it('should return 404 for requests without /api prefix', () => {
      return request(app.getHttpServer())
        .get('/health')
        .expect(404);
    });

    it('should return 200 for requests with /api prefix', () => {
      return request(app.getHttpServer())
        .get('/api/health')
        .expect(200);
    });
  });

  describe('Non-existent routes', () => {
    it('should return 404 for non-existent routes', () => {
      return request(app.getHttpServer())
        .get('/api/non-existent')
        .expect(404);
    });
  });
});
