import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateSubjectDto {
  @ApiProperty({
    example: 'Mathematics',
    description: "The subject's name",
    required: false,
    type: String,
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    example: 'MATH101',
    description: "The subject's unique code",
    required: false,
    type: String,
  })
  @IsOptional()
  @IsString()
  code?: string;
}
