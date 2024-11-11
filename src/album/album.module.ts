import { forwardRef, Module } from '@nestjs/common';
import { AlbumService } from './album.service';
import { AlbumController } from './album.controller';
import { TrackModule } from '../track/track.module';
import { FavoriteModule } from '../favorite/favorite.module';

@Module({
  imports: [forwardRef(() => TrackModule), forwardRef(() => FavoriteModule)],
  controllers: [AlbumController],
  providers: [AlbumService],
  exports: [AlbumService],
})
export class AlbumModule {}
