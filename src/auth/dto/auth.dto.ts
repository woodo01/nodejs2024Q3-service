import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class AuthDto {
  @ApiProperty({ description: 'Login' })
  @IsString()
  public login: string;

  @ApiProperty({ description: 'Password' })
  @IsString()
  public password: string;
}
