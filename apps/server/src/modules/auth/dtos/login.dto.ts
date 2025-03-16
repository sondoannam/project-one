import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength, Matches, MaxLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    example: 'sondoannam202@gmail.com',
    description: "The user's email",
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  @Matches(/^([A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,})$/, {
    message: 'Invalid email',
  })
  email: string;

  @ApiProperty({
    example: 'password-will-secret',
    description: "The user's password.",
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(30)
  password: string;
}
