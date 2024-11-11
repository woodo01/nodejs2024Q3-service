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

@ApiTags('Albums')
@Controller('album')
export class AlbumController {
  constructor(private readonly albumsService: AlbumService) {}

  @Get()
  @ApiOperation({ summary: 'Get all albums' })
  @ApiResponse({
    status: 200,
    description: 'List of albums',
    type: [AlbumResponseDto],
  })
  getAll() {
    return this.albumsService.findAll();
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
  getById(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.albumsService.findById(id);
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
  create(@Body() createAlbumDto: CreateAlbumDto) {
    return this.albumsService.create(createAlbumDto);
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
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateAlbumDto: CreateAlbumDto,
  ) {
    return this.albumsService.update(id, updateAlbumDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiParam({ name: 'id', description: 'Album UUID' })
  @ApiOperation({ summary: 'Delete album' })
  @ApiResponse({ status: 204, description: 'Album deleted successfully' })
  @ApiResponse({ status: 400, description: 'Invalid UUID' })
  @ApiResponse({ status: 404, description: 'Album not found' })
  remove(@Param('id', new ParseUUIDPipe()) id: string) {
    this.albumsService.delete(id);
  }
}
