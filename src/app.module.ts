import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TranscriptionModule } from './transcription/transcription.module';
import { AuthModule } from './auth/auth.module';
import { HealthModule } from './health/health.module';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const url = configService.get('DATABASE_URL') || configService.get('DIRECT_DATABASE_URL');
        if (!url) {
          throw new Error('Database URL is not configured');
        }
        
        return {
          type: 'mysql',
          url: url,
          entities: [__dirname + '/**/*.entity{.ts,.js}'],
          synchronize: true, // Don't use this in production
        };
      },
      inject: [ConfigService],
    }),
    CacheModule.register({
      isGlobal: true,
      ttl: 60 * 60, // 1 hour
    }),
    TranscriptionModule,
    AuthModule,
    HealthModule,
  ],
})
export class AppModule {}