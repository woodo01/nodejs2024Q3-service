import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AlbumService } from './album.service';
import { CreateAlbumDto } from './dto/create.dto';
import { AlbumResponseDto } from './dto/response.dto';
import { LoggingService } from '../logging/logging.service';

@ApiTags('Albums')
@Controller('album')
export class AlbumController {
  constructor(
    private readonly albumsService: AlbumService,
    private readonly loggingService: LoggingService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get all albums' })
  @ApiResponse({
    status: 200,
    description: 'List of albums',
    type: [AlbumResponseDto],
  })
  async getAll() {
    this.loggingService.log('Getting all albums', 'Albums');

    return await this.albumsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get single album by id' })
  @ApiParam({ name: 'id', description: 'Album UUID' })
  @ApiResponse({
    status: 200,
    description: 'Album found',
    type: AlbumResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid UUID' })
  @ApiResponse({ status: 404, description: 'Album not found' })
  async getById(@Param('id', new ParseUUIDPipe()) id: string) {
    this.loggingService.log(`Getting album by id: ${id}`, 'Albums');

    return await this.albumsService.findById(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new album' })
  @ApiResponse({
    status: 201,
    description: 'Album created successfully',
    type: AlbumResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  async create(@Body() createAlbumDto: CreateAlbumDto) {
    this.loggingService.log(`Creating album: ${createAlbumDto.name}`, 'Albums');

    return await this.albumsService.create(createAlbumDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update album info' })
  @ApiParam({ name: 'id', description: 'Album UUID' })
  @ApiResponse({
    status: 200,
    description: 'Album updated successfully',
    type: AlbumResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid UUID' })
  @ApiResponse({ status: 404, description: 'Album not found' })
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateAlbumDto: CreateAlbumDto,
  ) {
    this.loggingService.log(`Updating album: ${id}`, 'Albums');

    return await this.albumsService.update(id, updateAlbumDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiParam({ name: 'id', description: 'Album UUID' })
  @ApiOperation({ summary: 'Delete album' })
  @ApiResponse({ status: 204, description: 'Album deleted successfully' })
  @ApiResponse({ status: 400, description: 'Invalid UUID' })
  @ApiResponse({ status: 404, description: 'Album not found' })
  async remove(@Param('id', new ParseUUIDPipe()) id: string) {
    this.loggingService.log(`Removing album: ${id}`, 'Albums');

    await this.albumsService.delete(id);
  }
}
