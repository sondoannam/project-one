import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { UserService } from '../user/user.service';
import { CreateUserDto } from '../user/dtos';

@Injectable()
export class AdminService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly userService: UserService,
  ) {}

  createUser = async (data: CreateUserDto) => {
    return await this.userService.create(data);
  };

  resetUserPassword = async (userId: string) => {
    return await this.userService.resetPassword(userId);
  };

  deleteUser = async (userId: string) => {
    return await this.userService.softDelete(userId);
  };
}
