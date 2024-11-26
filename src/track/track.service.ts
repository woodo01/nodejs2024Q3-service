import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTrackDto } from './dto/create.dto';
import { StorageService } from '../storage/storage.service';
import { Track } from '@prisma/client';

@Injectable()
export class TrackService {
  constructor(private storage: StorageService) {}

  async findAll(): Promise<Track[]> {
    return this.storage.track.findMany();
  }

  async findById(id: string): Promise<Track> {
    const track = await this.storage.track.findUnique({ where: { id } });

    if (!track) throw new NotFoundException('Track not found');

    return track;
  }

  async create(createTrackDto: CreateTrackDto): Promise<Track> {
    return this.storage.track.create({
      data: {
        name: createTrackDto.name,
        duration: createTrackDto.duration,
        artist: {
          connect: createTrackDto.artistId
            ? { id: createTrackDto.artistId }
            : undefined,
        },
        album: {
          connect: createTrackDto.albumId
            ? { id: createTrackDto.albumId }
            : undefined,
        },
      },
    });
  }

  async update(id: string, updateTrackDto: CreateTrackDto): Promise<Track> {
    const track = await this.storage.track.findUnique({ where: { id } });

    if (!track) throw new NotFoundException('Track not found');

    return this.storage.track.update({
      where: { id },
      data: {
        name: updateTrackDto.name,
        duration: updateTrackDto.duration,
        artist: {
          connect: updateTrackDto.artistId
            ? { id: updateTrackDto.artistId }
            : undefined,
        },
        album: {
          connect: updateTrackDto.albumId
            ? { id: updateTrackDto.albumId }
            : undefined,
        },
      },
    });
  }

  async delete(id: string): Promise<void> {
    try {
      await this.storage.track.delete({ where: { id } });
    } catch {
      throw new NotFoundException('Track not found');
    }
    await this.storage.favoriteTrack.deleteMany({ where: { trackId: id } });
  }
}
