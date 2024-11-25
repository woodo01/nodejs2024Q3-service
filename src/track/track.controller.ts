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
import { TrackService } from './track.service';
import { CreateTrackDto } from './dto/create.dto';
import { TrackResponseDto } from './dto/response.dto';
import { LoggingService } from '../logging/logging.service';

@ApiTags('Tracks')
@Controller('track')
export class TrackController {
  constructor(
    private readonly tracksService: TrackService,
    private readonly loggingService: LoggingService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get all tracks' })
  @ApiResponse({
    status: 200,
    description: 'List of tracks',
    type: [TrackResponseDto],
  })
  async getAll() {
    this.loggingService.log('Getting all tracks', 'Tracks');

    return await this.tracksService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get single track by id' })
  @ApiParam({ name: 'id', description: 'Track UUID' })
  @ApiResponse({
    status: 200,
    description: 'Track found.',
    type: TrackResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid UUID.' })
  @ApiResponse({ status: 404, description: 'Track not found' })
  async getById(@Param('id', new ParseUUIDPipe()) id: string) {
    this.loggingService.log(`Getting track by id: ${id}`, 'Tracks');

    return await this.tracksService.findById(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new track' })
  @ApiResponse({
    status: 201,
    description: 'Track created successfully.',
    type: TrackResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  async create(@Body() createTrackDto: CreateTrackDto) {
    this.loggingService.log(`Creating track: ${createTrackDto.name}`, 'Tracks');

    return await this.tracksService.create(createTrackDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update track info' })
  @ApiParam({ name: 'id', description: 'Track UUID' })
  @ApiResponse({
    status: 200,
    description: 'Track updated successfully.',
    type: TrackResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid UUID' })
  @ApiResponse({ status: 404, description: 'Track not found' })
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateTrackDto: CreateTrackDto,
  ) {
    this.loggingService.log(`Updating track by id: ${id}`, 'Tracks');

    return await this.tracksService.update(id, updateTrackDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete track' })
  @ApiParam({ name: 'id', description: 'Track UUID' })
  @ApiResponse({ status: 204, description: 'Track deleted successfully' })
  @ApiResponse({ status: 400, description: 'Invalid UUID' })
  @ApiResponse({ status: 404, description: 'Track not found' })
  async remove(@Param('id', new ParseUUIDPipe()) id: string) {
    this.loggingService.log(`Deleting track by id: ${id}`, 'Tracks');

    await this.tracksService.delete(id);
  }
}
