import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { CreateUserDto } from './dtos';
import { hashPassword } from 'src/utils';
import { DEFAULT_PASSWORD } from 'src/constants';
import { ROLE } from '@prisma/client';
import { User } from './models';

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

    const existedUser = await this.isUserExisted(
      createUserDto.code,
      createUserDto.phone,
    );

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
}
