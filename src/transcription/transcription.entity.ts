import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity()
export class Transcription {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  text: string;

  @Column()
  fileName: string;

  @Column()
  duration: number;

  @CreateDateColumn()
  createdAt: Date;
}