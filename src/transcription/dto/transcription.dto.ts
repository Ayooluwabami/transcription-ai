import { ApiProperty } from '@nestjs/swagger';

export class TranscriptionResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  text: string;

  @ApiProperty()
  fileName: string;

  @ApiProperty()
  duration: number;

  @ApiProperty()
  createdAt: Date;
}

export class TranscriptionFilterDto {
  @ApiProperty({ required: false })
  startDate?: Date;

  @ApiProperty({ required: false })
  endDate?: Date;

  @ApiProperty({ required: false })
  search?: string;
}