import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateAlbumDto } from './dto/create.dto';
import { StorageService } from '../storage/storage.service';
import { Album } from '@prisma/client';

@Injectable()
export class AlbumService {
  constructor(private storage: StorageService) {}

  async findAll(): Promise<Album[]> {
    return this.storage.album.findMany();
  }

  async findById(id: string): Promise<Album> {
    const album = await this.storage.album.findUnique({ where: { id } });

    if (!album) throw new NotFoundException('Album not found');

    return album;
  }

  async create(createAlbumDto: CreateAlbumDto): Promise<Album> {
    return this.storage.album.create({
      data: {
        name: createAlbumDto.name,
        year: createAlbumDto.year,
        artist: {
          connect: createAlbumDto.artistId ? { id: createAlbumDto.artistId } : undefined,
        },
      },
    });
  }

  async update(id: string, updateAlbumDto: CreateAlbumDto): Promise<Album> {
    const album = await this.storage.album.findUnique({ where: { id } });
    if (!album) throw new NotFoundException('Album not found');

    return this.storage.album.update({
      where: { id },
      data: {
        name: updateAlbumDto.name,
        year: updateAlbumDto.year,
        artist: {
          connect: updateAlbumDto.artistId
            ? { id: updateAlbumDto.artistId }
            : undefined,
        },
      },
    });
  }

  async delete(id: string): Promise<void> {
    try {
      await this.storage.album.delete({ where: { id } });
    } catch {
      throw new NotFoundException('Album not found');
    }
    this.storage.favoriteAlbum.deleteMany({ where: { albumId: id } });
    this.storage.track.deleteMany({ where: { albumId: id } });
  }
}
