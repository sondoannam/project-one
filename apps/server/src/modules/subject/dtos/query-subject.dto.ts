import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsObject, IsOptional, IsString } from 'class-validator';
import { QueryManyWithPaginationDto, SortDto } from 'libs/dtos/filters-with-pagination.dto';
import { transformJsonQuery } from 'src/utils';
import { Subject } from '../models';

export class SubjectFilterDto {
  @ApiPropertyOptional({
    description: 'Search for subjects by keyword in name or code',
    type: String,
  })
  @IsOptional()
  @IsString()
  keyword?: string;
}

export class SubjectSortDto extends SortDto<Subject> {}

export class QuerySubjectDto extends QueryManyWithPaginationDto<SubjectFilterDto, SubjectSortDto> {
  @ApiPropertyOptional({
    description: 'Filter options for subjects',
    type: Object,
  })
  @IsOptional()
  @IsObject()
  @Transform(({ value }) => transformJsonQuery(value))
  filter?: SubjectFilterDto;

  @ApiPropertyOptional({
    description: 'Sort options for subjects',
    type: Object,
  })
  @IsOptional()
  @IsObject()
  @Transform(({ value }) => transformJsonQuery(value))
  sort?: SubjectSortDto;
}
