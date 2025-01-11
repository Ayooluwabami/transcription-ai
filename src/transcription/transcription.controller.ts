import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  UseInterceptors,
  UploadedFile,
  ParseIntPipe,
  Query,
  HttpStatus,
  BadRequestException,
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiResponse, ApiConsumes, ApiSecurity } from '@nestjs/swagger';
import { TranscriptionService } from './transcription.service';
import { TranscriptionResponseDto, TranscriptionFilterDto } from './dto/transcription.dto';
import { PaginationDto } from './dto/pagination.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guards';
import { diskStorage } from 'multer';
import { extname } from 'path';
import * as FileType from 'file-type';

const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25MB
const ALLOWED_MIME_TYPES = ['audio/mpeg', 'audio/wav', 'audio/m4a', 'audio/ogg'];

@ApiTags('transcriptions')
@Controller('transcriptions')
@UseGuards(JwtAuthGuard)
@ApiSecurity('bearer')
export class TranscriptionController {
  constructor(private readonly transcriptionService: TranscriptionService) { }

  @Post('upload')
  @ApiOperation({ summary: 'Upload audio file for transcription' })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({ status: HttpStatus.CREATED, type: TranscriptionResponseDto })
  @UseInterceptors(
    FileInterceptor('audio', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          callback(null, `${uniqueSuffix}${extname(file.originalname)}`);
        },
      }),
      limits: {
        fileSize: MAX_FILE_SIZE,
      },
      fileFilter: async (req, file, callback) => {
        if (!file.originalname.match(/\.(mp3|wav|m4a|ogg)$/)) {
          return callback(
            new BadRequestException('Only audio files (mp3, wav, m4a, ogg) are allowed'),
            false,
          );
        }

        callback(null, true);
      },
    }),
  )
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }
    return this.transcriptionService.transcribeAudio(file);
  }

  @Get()
  @ApiOperation({ summary: 'Get all transcriptions with pagination and filters' })
  @ApiResponse({ status: HttpStatus.OK, type: [TranscriptionResponseDto] })
  findAll(
    @Query() pagination: PaginationDto,
    @Query() filters: TranscriptionFilterDto,
  ) {
    return this.transcriptionService.findAll(pagination, filters);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get transcription by ID' })
  @ApiResponse({ status: HttpStatus.OK, type: TranscriptionResponseDto })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Transcription not found' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.transcriptionService.findOne(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete transcription by ID' })
  @ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'Transcription deleted' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Transcription not found' })
  async deleteTranscription(@Param('id', ParseIntPipe) id: number) {
    await this.transcriptionService.deleteTranscription(id);
  }
}