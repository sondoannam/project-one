import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateSubjectDto {
  @ApiProperty({
    example: 'Mathematics',
    description: "The subject's name",
    required: true,
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    example: 'MATH101',
    description: "The subject's unique code",
    required: true,
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  code: string;
}
