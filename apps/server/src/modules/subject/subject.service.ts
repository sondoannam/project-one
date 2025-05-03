import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { CreateSubjectDto, QuerySubjectDto, UpdateSubjectDto } from './dtos';
import { Subject } from './models';
import { PaginatedResponse } from 'libs/types';
import { getPaginationParams, createPaginatedResponse } from 'src/utils';
import { Prisma } from '@prisma/client';

@Injectable()
export class SubjectService {
  constructor(private readonly databaseService: DatabaseService) {}

  /**
   * Check if subject exists with given code
   * @param code The subject code to check
   * @param excludeId Optionally exclude a subject by ID (useful for updates)
   * @returns Boolean indicating if the subject exists
   */
  async isSubjectCodeExisted(code: string, excludeId?: string): Promise<boolean> {
    const whereClause: Prisma.SubjectWhereInput = {
      code,
    };

    // If we're updating an existing subject, exclude it from the check
    if (excludeId) {
      whereClause.id = {
        not: excludeId,
      };
    }

    const existingSubject = await this.databaseService.subject.findFirst({
      where: whereClause,
    });

    return !!existingSubject;
  }

  /**
   * Create a new subject
   * @param createSubjectDto The data to create the subject with
   * @returns The created subject
   */
  async create(createSubjectDto: CreateSubjectDto): Promise<Subject> {
    // Check if subject with this code already exists
    const isCodeExisted = await this.isSubjectCodeExisted(createSubjectDto.code);

    if (isCodeExisted) {
      throw new HttpException(
        {
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          message: 'subject_code_already_exists',
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const createdSubject = await this.databaseService.subject.create({
      data: createSubjectDto,
    });

    return new Subject(createdSubject);
  }

  /**
   * Find a subject by ID
   * @param id The ID of the subject to find
   * @returns The found subject or null
   */
  async findById(id: string): Promise<Subject | null> {
    const subject = await this.databaseService.subject.findUnique({
      where: { id },
    });

    if (!subject) {
      return null;
    }

    return new Subject(subject);
  }

  /**
   * Find a subject by ID or throw an exception if not found
   * @param id The ID of the subject to find
   * @returns The found subject
   * @throws HttpException if subject not found
   */
  async findByIdOrThrow(id: string): Promise<Subject> {
    const subject = await this.findById(id);

    if (!subject) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          message: 'subject_not_found',
        },
        HttpStatus.NOT_FOUND,
      );
    }

    return subject;
  }

  /**
   * Update a subject
   * @param id The ID of the subject to update
   * @param updateSubjectDto The data to update the subject with
   * @returns The updated subject
   */
  async update(id: string, updateSubjectDto: UpdateSubjectDto): Promise<Subject> {
    // Ensure subject exists
    await this.findByIdOrThrow(id);

    // If code is being updated, check if it already exists
    if (updateSubjectDto.code) {
      const isCodeExisted = await this.isSubjectCodeExisted(updateSubjectDto.code, id);

      if (isCodeExisted) {
        throw new HttpException(
          {
            status: HttpStatus.UNPROCESSABLE_ENTITY,
            message: 'subject_code_already_exists',
          },
          HttpStatus.UNPROCESSABLE_ENTITY,
        );
      }
    }

    const updatedSubject = await this.databaseService.subject.update({
      where: { id },
      data: updateSubjectDto,
    });

    return new Subject(updatedSubject);
  }

  /**
   * Find subjects with pagination, filtering and sorting
   * @param query Query parameters including pagination, filter and sort options
   * @returns Paginated list of subjects
   */
  async findMany(query: QuerySubjectDto): Promise<PaginatedResponse<Subject>> {
    const { filter, sort } = query;
    const { skip, take, page, pageSize } = getPaginationParams(query);

    // Build where clause based on filters
    const whereClause: Prisma.SubjectWhereInput = {};

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
    }

    // Build orderBy clause based on sort options
    const orderBy: Prisma.SubjectOrderByWithRelationInput = {};
    if (sort?.orderBy && sort?.order) {
      orderBy[sort.orderBy as string] = sort.order.toLowerCase() as Prisma.SortOrder;
    } else {
      // Default sorting by created_at in descending order
      orderBy.createdAt = 'desc';
    }

    // Execute count query and data query in parallel for better performance
    const [total, subjects] = await Promise.all([
      this.databaseService.subject.count({ where: whereClause }),
      this.databaseService.subject.findMany({
        where: whereClause,
        orderBy,
        skip,
        take,
      }),
    ]);

    // Map database entities to Subject model instances
    const subjectModels = subjects.map((subject) => new Subject(subject));

    // Return paginated response
    return createPaginatedResponse(subjectModels, total, page, pageSize);
  }

  /**
   * Delete a subject permanently
   * @param id The ID of the subject to delete
   * @returns The deleted subject
   */
  async delete(id: string): Promise<Subject> {
    // Ensure subject exists
    await this.findByIdOrThrow(id);

    // Check if the subject is associated with any lesson plans or reports
    const [lessonPlansCount, reportsCount] = await Promise.all([
      this.databaseService.lessonPlan.count({
        where: { subjectId: id },
      }),
      this.databaseService.report.count({
        where: { subjectId: id },
      }),
    ]);

    if (lessonPlansCount > 0 || reportsCount > 0) {
      throw new HttpException(
        {
          status: HttpStatus.CONFLICT,
          message: 'subject_has_associated_records',
          details: {
            lessonPlansCount,
            reportsCount,
          },
        },
        HttpStatus.CONFLICT,
      );
    }

    const deletedSubject = await this.databaseService.subject.delete({
      where: { id },
    });

    return new Subject(deletedSubject);
  }
}
