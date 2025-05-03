import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  HttpCode,
  HttpStatus,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SubjectService } from './subject.service';
import { CreateSubjectDto, PaginatedSubjectDto, QuerySubjectDto, UpdateSubjectDto } from './dtos';
import { Subject } from './models';
import { ROLE } from '@prisma/client';
import { Roles } from '../auth/decorators';
import { RolesGuard } from '../auth/guards';

@ApiTags('Subjects')
@Controller('subjects')
export class SubjectController {
  constructor(private readonly subjectService: SubjectService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(RolesGuard)
  @Roles(ROLE.ADMIN)
  @ApiOperation({ summary: 'Create a new subject' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Subject created successfully',
    type: Subject,
  })
  @ApiResponse({
    status: HttpStatus.UNPROCESSABLE_ENTITY,
    description: 'Invalid input data or subject code already exists',
  })
  async create(@Body() createSubjectDto: CreateSubjectDto): Promise<Subject> {
    return this.subjectService.create(createSubjectDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all subjects with pagination, filtering, and sorting' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns paginated list of subjects',
    type: PaginatedSubjectDto,
  })
  async findAll(@Query() query: QuerySubjectDto) {
    return this.subjectService.findMany(query);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get a subject by ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Subject found',
    type: Subject,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Subject not found',
  })
  async findOne(@Param('id') id: string): Promise<Subject> {
    return this.subjectService.findByIdOrThrow(id);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(RolesGuard)
  @Roles(ROLE.ADMIN)
  @ApiOperation({ summary: 'Update a subject' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Subject updated successfully',
    type: Subject,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Subject not found',
  })
  @ApiResponse({
    status: HttpStatus.UNPROCESSABLE_ENTITY,
    description: 'Invalid input data or subject code already exists',
  })
  async update(
    @Param('id') id: string,
    @Body() updateSubjectDto: UpdateSubjectDto,
  ): Promise<Subject> {
    return this.subjectService.update(id, updateSubjectDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(RolesGuard)
  @Roles(ROLE.ADMIN)
  @ApiOperation({ summary: 'Delete a subject' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Subject deleted successfully',
    type: Subject,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Subject not found',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Subject has associated records and cannot be deleted',
  })
  async remove(@Param('id') id: string): Promise<Subject> {
    return this.subjectService.delete(id);
  }
}
