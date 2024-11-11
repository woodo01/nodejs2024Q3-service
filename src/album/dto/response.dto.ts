import { ApiProperty } from '@nestjs/swagger';

export class AlbumResponseDto {
  @ApiProperty({
    example: '11111111-ab12-ab32-1234-123123123123',
    description: 'UUID',
  })
  id: string;

  @ApiProperty({
    example: 'The best album',
    description: 'Name of the album',
  })
  name: string;

  @ApiProperty({
    example: 1231,
    description: 'When released',
  })
  year: number;

  @ApiProperty({
    example: '11111111-ab12-ab32-1234-123123123123',
    description: 'UUID of the artist',
  })
  artistId: string;
}
