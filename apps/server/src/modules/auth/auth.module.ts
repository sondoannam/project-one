import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { DatabaseModule } from 'src/database/database.module';
import { UserModule } from '../user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { ThrottlerModule } from '@nestjs/throttler';
import { JwtStrategy } from './strategies';
import { RefreshTokenService, TokenService } from './services';

@Module({
  imports: [
    DatabaseModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET'),
      }),
    }),
    UserModule,
    ThrottlerModule.forRoot([
      {
        name: 'login', // specific name for login limits
        ttl: 15 * 60 * 1000, // 15 minutes
        limit: 5, // 5 attempts
      },
    ]),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, TokenService, RefreshTokenService],
  exports: [AuthService],
})
export class AuthModule {}
