import { ApiProperty } from '@nestjs/swagger';
import { AlbumResponseDto } from 'src/album/dto/response.dto';
import { ArtistResponseDto } from 'src/artist/dto/response.dto';
import { TrackResponseDto } from 'src/track/dto/response.dto';

export class FavoritesResponseDto {
  @ApiProperty({
    example: [],
    description: 'List of favorite artists',
  })
  artists: ArtistResponseDto[];

  @ApiProperty({
    example: [],
    description: 'List of favorite albums',
  })
  albums: AlbumResponseDto[];

  @ApiProperty({
    example: [],
    description: 'List of favorite tracks',
  })
  tracks: TrackResponseDto[];
}
