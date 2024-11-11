import { IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    example: 'login',
    description: 'Login',
  })
  @IsString()
  @MinLength(1, { message: 'Login should be not empty' })
  login: string;

  @ApiProperty({
    example: 'Password',
    description: 'Password',
  })
  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password: string;
}
