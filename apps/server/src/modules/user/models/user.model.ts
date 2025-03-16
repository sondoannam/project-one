import { ApiProperty } from '@nestjs/swagger';
import { ROLE } from '@prisma/client';
import { AbstractModel, Nullable } from 'libs';

export class User extends AbstractModel {
  constructor(data: Nullable<User>) {
    super();
    Object.assign(this, data);
  }

  @ApiProperty({
    type: String,
    example: 'Nam Son',
  })
  name: string;

  @ApiProperty({
    type: String || null,
    example: 'sondoannam202@gmail.com',
  })
  email: string | null;

  @ApiProperty({
    type: String || null,
    example: '0123456789',
  })
  phone: string | null;

  @ApiProperty({
    example: ROLE.TEACHER,
    enum: ROLE,
    type: String,
  })
  role: ROLE;

  @ApiProperty({
    type: String,
    example: 'CODE123',
  })
  code: string;
}
