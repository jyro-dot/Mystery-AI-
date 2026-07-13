import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('UserService', () => {
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const createUserDto: CreateUserDto = {
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        password: 'password123',
      };

      const result = await service.create(createUserDto);

      expect(result).toBeDefined();
      expect(result.email).toBe('test@example.com');
      expect(result).not.toHaveProperty('password');
    });

    it('should throw error if email already exists', async () => {
      const createUserDto: CreateUserDto = {
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        password: 'password123',
      };

      await service.create(createUserDto);

      await expect(service.create(createUserDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('findAll', () => {
    beforeEach(async () => {
      await service.create({
        email: 'user1@example.com',
        firstName: 'User',
        lastName: 'One',
        password: 'password123',
      });
      await service.create({
        email: 'user2@example.com',
        firstName: 'User',
        lastName: 'Two',
        password: 'password123',
      });
    });

    it('should return paginated users', async () => {
      const result = await service.findAll({ page: 1, limit: 10 });

      expect(result).toHaveProperty('data');
      expect(result).toHaveProperty('pagination');
      expect(Array.isArray(result.data)).toBe(true);
    });

    it('should filter by search', async () => {
      const result = await service.findAll({ search: 'User One' });

      expect(result.data.length).toBeGreaterThan(0);
    });
  });

  describe('findById', () => {
    it('should return user by id', async () => {
      const created = await service.create({
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        password: 'password123',
      });

      const result = await service.findById(created.id);

      expect(result.email).toBe('test@example.com');
    });

    it('should throw error if user not found', async () => {
      await expect(service.findById('invalid-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('should update user', async () => {
      const created = await service.create({
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        password: 'password123',
      });

      const result = await service.update(created.id, {
        firstName: 'Jane',
      });

      expect(result.firstName).toBe('Jane');
    });
  });

  describe('remove', () => {
    it('should soft delete user', async () => {
      const created = await service.create({
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        password: 'password123',
      });

      await service.remove(created.id);

      await expect(service.findById(created.id)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
