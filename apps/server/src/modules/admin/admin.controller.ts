import {
  Body,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ROLE } from '@prisma/client';
import { Roles } from '../auth/decorators';
import { RolesGuard } from '../auth/guards';
import { AdminService } from './admin.service';
import { CreateUserDto } from '../user/dtos';

@ApiTags('Admin')
@Controller('admin')
@UseGuards(RolesGuard)
@Roles(ROLE.ADMIN)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post('create-user')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'User created successfully' })
  @ApiResponse({
    status: HttpStatus.UNPROCESSABLE_ENTITY,
    description: 'Invalid input data or duplicate user',
  })
  async createUser(@Body() createUserDto: CreateUserDto) {
    return this.adminService.createUser(createUserDto);
  }

  @Put('reset-password/:userId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Reset user password to default' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Password reset successful' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'User not found' })
  async resetUserPassword(@Param('userId') userId: string) {
    return this.adminService.resetUserPassword(userId);
  }

  @Delete('delete-user/:userId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Soft delete a user' })
  @ApiResponse({ status: HttpStatus.OK, description: 'User deleted successfully' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'User not found' })
  async deleteUser(@Param('userId') userId: string) {
    return this.adminService.deleteUser(userId);
  }
}
