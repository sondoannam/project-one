import { ApiProperty } from '@nestjs/swagger';
import { AbstractModel, Nullable } from 'libs';

export class Subject extends AbstractModel {
  constructor(data: Nullable<Subject>) {
    super();
    Object.assign(this, data);
  }

  @ApiProperty({
    type: String,
    example: 'Mathematics',
    description: 'The name of the subject',
  })
  name: string;

  @ApiProperty({
    type: String,
    example: 'MATH101',
    description: 'The unique code of the subject',
  })
  code: string;
}
