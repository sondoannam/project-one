import { createPaginationDto } from 'libs/dtos/pagination-result.dto';
import { Subject } from '../models/subject.model';

export class PaginatedSubjectDto extends createPaginationDto(Subject) {}
