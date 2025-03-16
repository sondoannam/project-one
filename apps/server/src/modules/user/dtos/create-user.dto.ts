import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    example: 'Nam Son',
    description: "The user's name.",
    required: true,
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    example: 'CODE123',
    description: "The user's code.",
    required: true,
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  code: string;

  @ApiProperty({
    example: 'sondoannam202@gmail.com',
    description: "The user's email address.",
    type: String,
    required: true,
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    example: '0123456789',
    description: "The user's phone number.",
    type: String,
    required: false,
  })
  @IsOptional()
  @IsString()
  @MinLength(10)
  @MaxLength(12)
  phone?: string;

  //   @ApiProperty({
  //     example: 'password-will-secret',
  //     description: "The user's password.",
  //     minLength: 6,
  //     type: String,
  //   })
  //   @MinLength(6)
  //   password: string;
}
