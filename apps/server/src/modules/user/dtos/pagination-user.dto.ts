import { createPaginationDto } from 'libs/dtos/pagination-result.dto';
import { User } from '../models/user.model';

export class PaginatedUserDto extends createPaginationDto(User) {}
