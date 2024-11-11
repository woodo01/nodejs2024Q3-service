import { Injectable, NotFoundException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { Album } from './album.interface';
import { CreateAlbumDto } from './dto/create.dto';

@Injectable()
export class AlbumService {
  private albums = new Map<string, Album>();

  findAll(): Album[] {
    return Array.from(this.albums.values());
  }

  findById(id: string): Album {
    if (!this.albums.has(id)) throw new NotFoundException('Album not found');

    return this.albums.get(id);
  }

  create(createAlbumDto: CreateAlbumDto): Album {
    const newAlbum: Album = {
      id: uuidv4(),
      ...createAlbumDto,
    };
    this.albums.set(newAlbum.id, newAlbum);

    return newAlbum;
  }

  update(id: string, updateAlbumDto: CreateAlbumDto): Album {
    const album = this.findById(id);
    Object.assign(album, updateAlbumDto);

    return album;
  }

  delete(id: string): void {
    if (!this.albums.has(id)) throw new NotFoundException('Album not found');
    this.albums.delete(id);
  }

  removeArtistFromAlbums(artistId: string) {
    this.albums.forEach((album) => {
      if (album.artistId === artistId) album.artistId = null;
    });
  }
}
