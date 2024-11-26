import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FavoriteService } from './favorite.service';
import { FavoritesResponseDto } from './dto/response.dto';
import { LoggingService } from '../logging/logging.service';

@ApiTags('Favorites')
@Controller('favs')
export class FavoriteController {
  constructor(
    private favoritesService: FavoriteService,
    private readonly loggingService: LoggingService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get all favorites' })
  @ApiResponse({
    status: 200,
    description: 'List of favorites',
    type: [FavoritesResponseDto],
  })
  async getAll() {
    this.loggingService.log('Getting all favorites', 'Favorites');

    return await this.favoritesService.getAllFavorites();
  }

  @Post('artist/:id')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Add artist to favorites' })
  @ApiParam({ name: 'id', description: 'Artist UUID' })
  @ApiResponse({
    status: 201,
    description: 'Artist added to favorites',
    type: FavoritesResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid UUID.' })
  @ApiResponse({ status: 422, description: 'Artist not found' })
  async addArtist(@Param('id', new ParseUUIDPipe()) id: string) {
    this.loggingService.log(`Adding artist to favorites: ${id}`, 'Favorites');

    await this.favoritesService.addArtistToFavorites(id);
  }

  @Delete('artist/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete artist from favorites' })
  @ApiParam({ name: 'id', description: 'Artist UUID' })
  @ApiResponse({ status: 204, description: 'Artist deleted from favorites' })
  @ApiResponse({ status: 400, description: 'Invalid UUID' })
  @ApiResponse({ status: 404, description: 'Artist is not in favorites' })
  async removeArtist(@Param('id', new ParseUUIDPipe()) id: string) {
    this.loggingService.log(
      `Removing artist from favorites: ${id}`,
      'Favorites',
    );

    await this.favoritesService.removeArtistFromFavorites(id);
  }

  @Post('album/:id')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Add album to favorites' })
  @ApiParam({ name: 'id', description: 'Album UUID' })
  @ApiResponse({
    status: 201,
    description: 'Album added to favorites',
    type: FavoritesResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid UUID' })
  @ApiResponse({ status: 422, description: 'Album not found' })
  async addAlbum(@Param('id', new ParseUUIDPipe()) id: string) {
    this.loggingService.log(`Adding album to favorites: ${id}`, 'Favorites');

    await this.favoritesService.addAlbumToFavorites(id);
  }

  @Delete('album/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete album from favorites' })
  @ApiParam({ name: 'id', description: 'Album UUID' })
  @ApiResponse({ status: 204, description: 'Album deleted from favorites' })
  @ApiResponse({ status: 400, description: 'Invalid UUID' })
  @ApiResponse({ status: 404, description: 'Album is not in favorites' })
  async removeAlbum(@Param('id', new ParseUUIDPipe()) id: string) {
    this.loggingService.log(
      `Removing album from favorites: ${id}`,
      'Favorites',
    );

    await this.favoritesService.removeAlbumFromFavorites(id);
  }

  @Post('track/:id')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Add track to favorites' })
  @ApiParam({ name: 'id', description: 'Track UUID' })
  @ApiResponse({
    status: 201,
    description: 'Track added to favorites',
    type: FavoritesResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid UUID' })
  @ApiResponse({ status: 422, description: 'Track not found' })
  async addTrack(@Param('id', new ParseUUIDPipe()) id: string) {
    this.loggingService.log(`Adding track to favorites: ${id}`, 'Favorites');

    await this.favoritesService.addTrackToFavorites(id);
  }

  @Delete('track/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete track from favorites' })
  @ApiParam({ name: 'id', description: 'Track UUID' })
  @ApiResponse({ status: 204, description: 'Track deleted from favorites' })
  @ApiResponse({ status: 400, description: 'Invalid UUID' })
  @ApiResponse({ status: 404, description: 'Track is not in favorites' })
  async removeTrack(@Param('id', new ParseUUIDPipe()) id: string) {
    this.loggingService.log(
      `Removing track from favorites: ${id}`,
      'Favorites',
    );

    await this.favoritesService.removeTrackFromFavorites(id);
  }
}
