import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEnum, IsObject, IsOptional, IsString } from 'class-validator';
import { QueryManyWithPaginationDto, SortDto } from 'libs/dtos/filters-with-pagination.dto';
import { ROLE } from '@prisma/client';
import { transformJsonQuery } from 'src/utils';
import { User } from '../models';

export class UserFilterDto {
  @ApiPropertyOptional({
    description: 'Search keyword for name or code (case-insensitive)',
    type: String,
    example: 'john',
  })
  @IsOptional()
  @IsString()
  keyword?: string;

  @ApiPropertyOptional({
    description: 'Filter by role',
    enum: ROLE,
    enumName: 'ROLE',
    example: ROLE.TEACHER,
  })
  @IsOptional()
  @IsEnum(ROLE)
  role?: ROLE;

  //   @ApiPropertyOptional({
  //     description: 'User ID to exclude from results (usually current user)',
  //     type: String,
  //     example: '5f8d3b2e9d3e2a1b8c7d6e5f',
  //   })
  //   @IsOptional()
  //   @IsString()
  //   excludeUserId?: string;
}

export class UserSortDto extends SortDto<User> {}

export class QueryUserDto extends QueryManyWithPaginationDto<UserFilterDto, UserSortDto> {
  @ApiPropertyOptional({
    description: 'Filter options as JSON string',
    example: '{"keyword":"john","role":"TEACHER"}',
  })
  @IsOptional()
  @IsObject()
  @Transform(({ value }) => transformJsonQuery(value))
  override filter?: UserFilterDto;

  @ApiPropertyOptional({
    description: 'Sort options as JSON string',
    example: '{"orderBy":"name","order":"asc"}',
  })
  @IsOptional()
  @IsObject()
  @Transform(({ value }) => transformJsonQuery(value))
  override sort?: UserSortDto;
}
