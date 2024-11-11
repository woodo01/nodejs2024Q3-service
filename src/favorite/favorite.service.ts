import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { Favorites } from './favorite.interface';
import { ArtistService } from '../artist/artist.service';
import { AlbumService } from '../album/album.service';
import { TrackService } from '../track/track.service';

@Injectable()
export class FavoriteService {
  private favorites: Favorites = {
    artists: [],
    albums: [],
    tracks: [],
  };

  constructor(
    @Inject(forwardRef(() => ArtistService))
    private artistsService: ArtistService,
    @Inject(forwardRef(() => AlbumService))
    private albumsService: AlbumService,
    @Inject(forwardRef(() => TrackService))
    private tracksService: TrackService,
  ) {}

  getAllFavorites() {
    return {
      artists: this.favorites.artists.map((id) =>
        this.artistsService.findById(id),
      ),
      albums: this.favorites.albums.map((id) =>
        this.albumsService.findById(id),
      ),
      tracks: this.favorites.tracks.map((id) =>
        this.tracksService.findById(id),
      ),
    };
  }

  addArtistToFavorites(artistId: string) {
    this.assertArtistExists(artistId);
    if (!this.favorites.artists.includes(artistId))
      this.favorites.artists.push(artistId);
  }

  removeArtistFromFavorites(artistId: string) {
    const index = this.favorites.artists.indexOf(artistId);
    if (index === -1) throw new NotFoundException('Artist not in favorites');
    this.favorites.artists.splice(index, 1);
  }

  addAlbumToFavorites(albumId: string) {
    this.assertAlbumExists(albumId);
    if (!this.favorites.albums.includes(albumId))
      this.favorites.albums.push(albumId);
  }

  removeAlbumFromFavorites(albumId: string) {
    const index = this.favorites.albums.indexOf(albumId);
    if (index === -1) throw new NotFoundException('Album not in favorites');
    this.favorites.albums.splice(index, 1);
  }

  addTrackToFavorites(trackId: string) {
    this.assertTrackExists(trackId);
    if (!this.favorites.tracks.includes(trackId))
      this.favorites.tracks.push(trackId);
  }

  removeTrackFromFavorites(trackId: string) {
    const index = this.favorites.tracks.indexOf(trackId);
    if (index === -1) throw new NotFoundException('Track not in favorites');
    this.favorites.tracks.splice(index, 1);
  }

  removeArtist(artistId: string) {
    this.favorites.artists = this.favorites.artists.filter(
      (id) => id !== artistId,
    );
  }

  removeAlbum(albumId: string) {
    this.favorites.albums = this.favorites.albums.filter(
      (id) => id !== albumId,
    );
  }

  removeTrack(trackId: string) {
    this.favorites.tracks = this.favorites.tracks.filter(
      (id) => id !== trackId,
    );
  }

  private assertArtistExists(artistId: string) {
    try {
      this.artistsService.findById(artistId);
    } catch {
      throw new UnprocessableEntityException('Artist does not exist');
    }
  }

  private assertAlbumExists(albumId: string) {
    try {
      this.albumsService.findById(albumId);
    } catch {
      throw new UnprocessableEntityException('Album does not exist');
    }
  }

  private assertTrackExists(trackId: string) {
    try {
      this.tracksService.findById(trackId);
    } catch {
      throw new UnprocessableEntityException('Track does not exist');
    }
  }
}
