import { Controller, Get, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import { PaginatedUserDto, QueryUserDto } from './dtos';

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all users with pagination, filtering, and sorting' })
  @ApiOkResponse({
    description: 'Returns paginated list of users',
    type: PaginatedUserDto,
  })
  async getUsers(@Query() query: QueryUserDto) {
    return await this.userService.findMany(query);
  }
}
