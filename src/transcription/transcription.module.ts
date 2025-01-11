import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TranscriptionController } from './transcription.controller';
import { TranscriptionService } from './transcription.service';
import { Transcription } from './transcription.entity';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    TypeOrmModule.forFeature([Transcription]),
    MulterModule.register({
      dest: './uploads',
    }),
  ],
  controllers: [TranscriptionController],
  providers: [TranscriptionService],
})
export class TranscriptionModule { }