import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import { Transcription } from './transcription.entity';
import { TranscriptionFilterDto } from './dto/transcription.dto';
import { PaginationDto } from './dto/pagination.dto';
import * as fs from 'fs';
import { getAudioDurationInSeconds } from 'get-audio-duration';

@Injectable()
export class TranscriptionService {
  private openai: OpenAI;

  constructor(
    @InjectRepository(Transcription)
    private transcriptionRepository: Repository<Transcription>,
    private configService: ConfigService,
  ) {
    this.openai = new OpenAI({
      apiKey: this.configService.get<string>('OPENAI_API_KEY'),
    });
  }

  async transcribeAudio(file: Express.Multer.File): Promise<Transcription> {
    try {
      const duration = await getAudioDurationInSeconds(file.path);

      const transcription = await this.openai.audio.transcriptions.create({
        file: fs.createReadStream(file.path),
        model: 'whisper-1',
      });

      const newTranscription = this.transcriptionRepository.create({
        text: transcription.text,
        fileName: file.originalname,
        duration,
      });

      return await this.transcriptionRepository.save(newTranscription);
    } finally {
      fs.unlinkSync(file.path);
    }
  }

  async findAll(pagination: PaginationDto, filters?: TranscriptionFilterDto): Promise<Transcription[]> {
    const query = this.transcriptionRepository.createQueryBuilder('transcription');

    if (filters) {
      if (filters.startDate && filters.endDate) {
        query.andWhere('transcription.createdAt BETWEEN :startDate AND :endDate', {
          startDate: filters.startDate,
          endDate: filters.endDate,
        });
      }

      if (filters.search) {
        query.andWhere('transcription.text LIKE :search', {
          search: `%${filters.search}%`,
        });
      }
    }

    query.skip((pagination.page - 1) * pagination.limit)
      .take(pagination.limit)
      .orderBy('transcription.createdAt', 'DESC');

    return query.getMany();
  }

  async findOne(id: number): Promise<Transcription> {
    const transcription = await this.transcriptionRepository.findOneBy({ id });
    if (!transcription) {
      throw new NotFoundException(`Transcription with ID ${id} not found`);
    }
    return transcription;
  }

  async deleteTranscription(id: number): Promise<void> {
    const result = await this.transcriptionRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Transcription with ID ${id} not found`);
    }
  }
}