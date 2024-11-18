import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { Artist } from './artist.interface';
import { CreateArtistDto } from './dto/create.dto';
import { AlbumService } from '../album/album.service';
import { TrackService } from '../track/track.service';
import { FavoriteService } from '../favorite/favorite.service';

@Injectable()
export class ArtistService {
  private artists = new Map<string, Artist>();

  constructor(
    @Inject(forwardRef(() => AlbumService))
    private albumService: AlbumService,
    @Inject(forwardRef(() => TrackService))
    private trackService: TrackService,
    @Inject(forwardRef(() => FavoriteService))
    private favoriteService: FavoriteService,
  ) {}

  findAll(): Artist[] {
    return Array.from(this.artists.values());
  }

  findById(id: string): Artist {
    if (!this.artists.has(id)) throw new NotFoundException('Artist not found');

    return this.artists.get(id);
  }

  create(createArtistDto: CreateArtistDto): Artist {
    const newArtist: Artist = {
      id: uuidv4(),
      ...createArtistDto,
    };
    this.artists.set(newArtist.id, newArtist);

    return newArtist;
  }

  update(id: string, updateArtistDto: CreateArtistDto): Artist {
    const artist = this.findById(id);
    Object.assign(artist, updateArtistDto);

    return artist;
  }

  delete(id: string): void {
    if (!this.artists.has(id)) throw new NotFoundException('Artist not found');
    this.albumService.removeArtistFromAlbums(id);
    this.trackService.removeArtistFromTracks(id);
    this.favoriteService.removeArtist(id);
    this.artists.delete(id);
  }
}
