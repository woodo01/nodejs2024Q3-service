import { ApiProperty } from '@nestjs/swagger';

export class TrackResponseDto {
  @ApiProperty({
    example: '11111111-ab12-ab32-1234-123123123123',
    description: 'UUID of the track',
  })
  id: string;

  @ApiProperty({
    example: 'Love Forrever',
    description: 'Name of the track',
  })
  name: string;

  @ApiProperty({
    example: '11111111-ab12-ab32-1234-123123123123',
    description: 'UUID of the artist',
  })
  artistId: string;

  @ApiProperty({
    example: '11111111-ab12-ab32-1234-123123123123',
    description: 'UUID of the album',
  })
  albumId: string;
  @ApiProperty({
    example: 1000,
    description: 'Duration in seconds',
  })
  duration: number;
}
