import { ApiProperty } from '@nestjs/swagger';

export class ArtistResponseDto {
  @ApiProperty({
    example: '11111111-ab12-ab32-1234-123123123123',
    description: 'UUID of the artist',
  })
  id: string;

  @ApiProperty({
    example: 'Ivan Sigaev',
    description: 'Name of the artist',
  })
  name: string;

  @ApiProperty({
    example: true,
    description: 'Has won a Grammy',
  })
  grammy: boolean;
}
