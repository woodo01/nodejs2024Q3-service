import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateArtistDto } from './dto/create.dto';
import { StorageService } from '../storage/storage.service';
import { Artist } from '@prisma/client';

@Injectable()
export class ArtistService {
  constructor(private storage: StorageService) {}

  async findAll(): Promise<Artist[]> {
    return this.storage.artist.findMany();
  }

  async findById(id: string): Promise<Artist> {
    const artist = await this.storage.artist.findUnique({ where: { id } });

    if (!artist) throw new NotFoundException('Artist not found');

    return artist;
  }

  async create(createArtistDto: CreateArtistDto): Promise<Artist> {
    return this.storage.artist.create({ data: createArtistDto });
  }

  async update(id: string, updateArtistDto: CreateArtistDto): Promise<Artist> {
    try {
      return await this.storage.artist.update({
        where: { id },
        data: updateArtistDto,
      });
    } catch {
      throw new NotFoundException('Artist not found');
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await this.storage.artist.delete({ where: { id } });
    } catch {
      throw new NotFoundException('Artist not found');
    }
  }
}
