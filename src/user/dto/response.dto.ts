import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiProperty({
    example: '11111111-ab12-ab32-1234-123123123123',
    description: 'UUID',
  })
  id: string;

  @ApiProperty({
    example: 'login',
    description: 'Login',
  })
  login: string;

  @ApiProperty({
    example: 1,
    description: 'Version',
  })
  version: number;

  @ApiProperty({
    example: 1111111111,
    description: 'Creation timestamp',
  })
  createdAt: number;

  @ApiProperty({
    example: 9999999999,
    description: 'Update timestamp',
  })
  updatedAt: number;
}
