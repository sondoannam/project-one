import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { CreateUserDto, QueryUserDto } from './dtos';
import {
  hashPassword,
  comparePassword,
  getPaginationParams,
  createPaginatedResponse,
} from 'src/utils';
import { DEFAULT_PASSWORD } from 'src/constants';
import { ROLE, Prisma } from '@prisma/client';
import { User } from './models';
import { PaginatedResponse } from 'libs/types';

@Injectable()
export class UserService {
  constructor(private readonly databaseService: DatabaseService) {}

  isUserExisted = async (code: string, phone?: string) => {
    if (!code && !phone) {
      return false;
    }

    const existedUser = await this.databaseService.user.findFirst({
      where: {
        OR: [
          {
            code,
          },
          {
            phone,
          },
        ],
      },
    });

    if (existedUser) {
      return true;
    }

    return false;
  };

  async create(createUserDto: CreateUserDto) {
    if (!createUserDto.name && !createUserDto.code) {
      throw new HttpException(
        {
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          message: 'name_code_required',
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const existedUser = await this.isUserExisted(createUserDto.code, createUserDto.phone);

    if (existedUser) {
      throw new HttpException(
        {
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          message: 'duplicate_code_or_phone',
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const defaultHashed = await hashPassword(DEFAULT_PASSWORD);

    const createdUser = await this.databaseService.user.create({
      data: {
        ...createUserDto,
        password: defaultHashed,
        role: ROLE.TEACHER,
      },
      omit: {
        password: true,
      },
    });

    return new User(createdUser);
  }

  async findById(id: string) {
    return this.databaseService.user.findFirst({
      where: {
        id,
        is_deleted: false,
      },
      omit: {
        password: true,
      },
    });
  }

  async findByIdOrThrow(id: string) {
    const user = await this.findById(id);

    if (!user) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          message: 'user_not_found',
        },
        HttpStatus.NOT_FOUND,
      );
    }

    return new User(user as any);
  }

  async findByEmailOrThrow(email: string) {
    const user = await this.databaseService.user.findFirst({
      where: {
        email,
        is_deleted: false,
      },
      omit: {
        password: true,
      },
    });

    if (!user) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          message: 'user_not_found',
        },
        HttpStatus.NOT_FOUND,
      );
    }

    return new User(user);
  }

  async changePassword(userId: string, oldPassword: string, newPassword: string) {
    const user = await this.databaseService.user.findFirst({
      where: {
        id: userId,
        is_deleted: false,
      },
    });

    if (!user) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          message: 'user_not_found',
        },
        HttpStatus.NOT_FOUND,
      );
    }

    const isPasswordValid = await comparePassword(oldPassword, user.password);
    if (!isPasswordValid) {
      throw new HttpException(
        {
          status: HttpStatus.UNAUTHORIZED,
          message: 'invalid_old_password',
        },
        HttpStatus.UNAUTHORIZED,
      );
    }

    const hashedPassword = await hashPassword(newPassword);

    const updatedUser = await this.databaseService.user.update({
      where: {
        id: userId,
      },
      data: {
        password: hashedPassword,
      },
      omit: {
        password: true,
      },
    });

    return new User(updatedUser);
  }

  async resetPassword(userId: string) {
    const user = await this.databaseService.user.findFirst({
      where: {
        id: userId,
        is_deleted: false,
      },
    });

    if (!user) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          message: 'user_not_found',
        },
        HttpStatus.NOT_FOUND,
      );
    }

    const hashedPassword = await hashPassword(DEFAULT_PASSWORD);

    const updatedUser = await this.databaseService.user.update({
      where: {
        id: userId,
      },
      data: {
        password: hashedPassword,
      },
      omit: {
        password: true,
      },
    });

    return new User(updatedUser);
  }

  async softDelete(userId: string) {
    const user = await this.databaseService.user.findFirst({
      where: {
        id: userId,
        is_deleted: false,
      },
    });

    if (!user) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          message: 'user_not_found',
        },
        HttpStatus.NOT_FOUND,
      );
    }

    const deletedUser = await this.databaseService.user.update({
      where: {
        id: userId,
      },
      data: {
        is_deleted: true,
      },
      omit: {
        password: true,
      },
    });

    return new User(deletedUser);
  }

  /**
   * Find users with pagination, filtering and sorting
   * @param query Query parameters including pagination, filter and sort options
   * @returns Paginated list of users
   */
  async findMany(query: QueryUserDto, currentUser?: string): Promise<PaginatedResponse<User>> {
    const { filter, sort } = query;
    const { skip, take, page, pageSize } = getPaginationParams(query);

    // Build where clause based on filters
    const whereClause: Prisma.UserWhereInput = {
      is_deleted: false,
    };

    if (filter) {
      // Add keyword search for name and code with case insensitivity
      if (filter.keyword) {
        whereClause.OR = [
          {
            name: {
              contains: filter.keyword,
              mode: 'insensitive',
            },
          },
          {
            code: {
              contains: filter.keyword,
              mode: 'insensitive',
            },
          },
        ];
      }

      // Add role filter
      if (filter.role) {
        whereClause.role = filter.role;
      }

      // Exclude current user if specified
      if (currentUser) {
        whereClause.id = {
          not: currentUser,
        };
      }
    }

    // Build orderBy clause based on sort options
    const orderBy: Prisma.UserOrderByWithRelationInput = {};
    if (sort?.orderBy && sort?.order) {
      orderBy[sort.orderBy as string] = sort.order.toLowerCase() as Prisma.SortOrder;
    } else {
      // Default sorting by created_at in descending order
      orderBy.createdAt = 'desc';
    }

    // Execute count query and data query in parallel for better performance
    const [total, users] = await Promise.all([
      this.databaseService.user.count({ where: whereClause }),
      this.databaseService.user.findMany({
        where: whereClause,
        orderBy,
        skip,
        take,
        omit: {
          password: true,
        },
      }),
    ]);

    // Map database entities to User model instances
    const userModels = users.map((user) => new User(user));

    // Return paginated response
    return createPaginatedResponse(userModels, total, page, pageSize);
  }
}
