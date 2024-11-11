import { Injectable, NotFoundException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { Track } from './track.interface';
import { CreateTrackDto } from './dto/create.dto';

@Injectable()
export class TrackService {
  private tracks = new Map<string, Track>();

  findAll(): Track[] {
    return Array.from(this.tracks.values());
  }

  findById(id: string): Track {
    if (!this.tracks.has(id)) throw new NotFoundException('Track not found');

    return this.tracks.get(id);
  }

  create(createTrackDto: CreateTrackDto): Track {
    const newTrack: Track = {
      id: uuidv4(),
      ...createTrackDto,
    };
    this.tracks.set(newTrack.id, newTrack);

    return newTrack;
  }

  update(id: string, updateTrackDto: CreateTrackDto): Track {
    const track = this.findById(id);
    Object.assign(track, updateTrackDto);

    return track;
  }

  delete(id: string): void {
    if (!this.tracks.has(id)) throw new NotFoundException('Track not found');
    this.tracks.delete(id);
  }

  removeArtistFromTracks(artistId: string) {
    this.tracks.forEach((track) => {
      if (track.artistId === artistId) track.artistId = null;
    });
  }

  removeAlbumFromTracks(albumId: string) {
    this.tracks.forEach((track) => {
      if (track.albumId === albumId) track.albumId = null;
    });
  }
}
