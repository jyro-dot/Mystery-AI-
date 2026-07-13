import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ChangeRoleDto } from './dto/change-role.dto';
import { UserQueryDto } from './dto/user-query.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  // TODO: Inject database/repository
  private users: any[] = [];

  /**
   * Create new user
   */
  async create(createUserDto: CreateUserDto) {
    const { email, firstName, lastName, password, roles } = createUserDto;

    // Check if user already exists
    const existingUser = this.users.find((u) => u.email === email);
    if (existingUser) {
      throw new BadRequestException('User with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = {
      id: Math.random().toString(),
      email,
      firstName,
      lastName,
      password: hashedPassword,
      roles: roles || ['user'],
      avatar: null,
      isActive: true,
      isEmailVerified: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    };

    this.users.push(user);

    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  /**
   * Get all users with pagination and filtering
   */
  async findAll(query: UserQueryDto) {
    const { page = 1, limit = 10, search, role, isActive } = query;
    const skip = (page - 1) * limit;

    let filtered = this.users.filter((u) => !u.deletedAt);

    if (search) {
      filtered = filtered.filter(
        (u) =>
          u.email.includes(search) ||
          u.firstName.toLowerCase().includes(search.toLowerCase()) ||
          u.lastName.toLowerCase().includes(search.toLowerCase()),
      );
    }

    if (role) {
      filtered = filtered.filter((u) => u.roles.includes(role));
    }

    if (isActive !== undefined) {
      filtered = filtered.filter((u) => u.isActive === isActive);
    }

    const total = filtered.length;
    const data = filtered.slice(skip, skip + limit).map((u) => {
      const { password, ...userWithoutPassword } = u;
      return userWithoutPassword;
    });

    return {
      data,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get user by ID
   */
  async findById(id: string) {
    const user = this.users.find((u) => u.id === id && !u.deletedAt);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  /**
   * Get user by email
   */
  async findByEmail(email: string) {
    const user = this.users.find((u) => u.email === email && !u.deletedAt);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  /**
   * Update user
   */
  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = this.users.find((u) => u.id === id && !u.deletedAt);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Check email uniqueness
    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const existing = this.users.find(
        (u) => u.email === updateUserDto.email && !u.deletedAt,
      );
      if (existing) {
        throw new BadRequestException('Email already in use');
      }
    }

    Object.assign(user, updateUserDto, { updatedAt: new Date() });

    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  /**
   * Update user profile
   */
  async updateProfile(id: string, updateProfileDto: UpdateProfileDto) {
    const user = this.users.find((u) => u.id === id && !u.deletedAt);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    Object.assign(user, updateProfileDto, { updatedAt: new Date() });

    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  /**
   * Change user roles
   */
  async changeRole(id: string, changeRoleDto: ChangeRoleDto) {
    const user = this.users.find((u) => u.id === id && !u.deletedAt);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.roles = changeRoleDto.roles;
    user.updatedAt = new Date();

    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  /**
   * Activate/Deactivate user
   */
  async toggleActive(id: string) {
    const user = this.users.find((u) => u.id === id && !u.deletedAt);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.isActive = !user.isActive;
    user.updatedAt = new Date();

    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  /**
   * Soft delete user
   */
  async remove(id: string) {
    const user = this.users.find((u) => u.id === id && !u.deletedAt);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.deletedAt = new Date();
    user.isActive = false;
  }

  /**
   * Hard delete user (admin only)
   */
  async hardDelete(id: string) {
    const index = this.users.findIndex((u) => u.id === id);
    if (index === -1) {
      throw new NotFoundException('User not found');
    }

    this.users.splice(index, 1);
  }
}
