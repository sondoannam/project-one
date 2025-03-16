import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { RefreshTokenService, TokenService } from './services';
import { DatabaseService } from 'src/database/database.service';
import { ChangePasswordDto, LoginDto } from './dtos';
import { comparePassword, hashPassword } from 'src/utils';
import { TokenResponse } from './types';
import { UserService } from '../user/user.service';
import { User } from '../user/models';

@Injectable()
export class AuthService {
  constructor(
    private readonly tokenService: TokenService,
    private readonly refreshTokenService: RefreshTokenService,
    private readonly databaseService: DatabaseService,
    private readonly userService: UserService,
  ) {}

  async authenticate(loginDto: LoginDto, ip?: string, device?: string) {
    const user = await this.databaseService.user.findFirst({
      where: {
        email: loginDto.email,
      },
    });

    if (!user) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          message: 'user_not_found',
        },
        HttpStatus.NOT_FOUND,
      );
    }

    const isMatched = await comparePassword(loginDto.password, user.password);

    if (!isMatched) {
      throw new HttpException(
        {
          status: HttpStatus.UNAUTHORIZED,
          message: 'invalid_credentials',
        },
        HttpStatus.UNAUTHORIZED,
      );
    }

    const [accessToken, refreshToken] = await Promise.all([
      this.tokenService.generateAccessToken(user),
      this.refreshTokenService.createRefreshToken(user.id, ip, device),
    ]);

    const accessTokenExpires = this.tokenService.getTokenExpiration('JWT_ACCESS_TOKEN_EXPIRED');

    return {
      accessToken,
      accessTokenExpires,
      refreshToken,
    };
  }

  async refreshTokens(refreshToken: string): Promise<TokenResponse> {
    try {
      const payload = this.tokenService.verifyRefreshToken(refreshToken);

      if (!payload || !payload.jti) {
        throw new HttpException(
          {
            status: HttpStatus.UNAUTHORIZED,
            message: 'Invalid refresh token payload',
          },
          HttpStatus.UNAUTHORIZED,
        );
      }

      const token = await this.refreshTokenService.validateRefreshToken(payload.jti);

      if (!token) {
        throw new HttpException(
          {
            status: HttpStatus.UNAUTHORIZED,
            message: 'Refresh token not found',
          },
          HttpStatus.UNAUTHORIZED,
        );
      }

      if (token.isRevoked) {
        throw new HttpException(
          {
            status: HttpStatus.UNAUTHORIZED,
            message: 'Refresh token has been revoked',
          },
          HttpStatus.UNAUTHORIZED,
        );
      }

      if (token.expiresAt < new Date()) {
        throw new HttpException(
          {
            status: HttpStatus.UNAUTHORIZED,
            message: 'Refresh token has expired',
          },
          HttpStatus.UNAUTHORIZED,
        );
      }

      // Rest of the code remains the same
      const [newAccessToken, newRefreshToken] = await Promise.all([
        this.tokenService.generateAccessToken(token.user),
        this.refreshTokenService.createRefreshToken(token.userId, token.ip, token.device),
      ]);

      return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
        accessTokenExpires: this.tokenService.getTokenExpiration('JWT_ACCESS_TOKEN_EXPIRED'),
      };
    } catch (error: any) {
      // Log the error for debugging
      console.error('Refresh token error:', error);

      // Add logging for failed attempts
      console.error('Failed refresh token attempt:', {
        error: error.message,
        token: refreshToken.substring(0, 10) + '...', // Log partial token for tracking
        timestamp: new Date().toISOString(),
      });

      // If it's already an HTTP exception, rethrow it
      if (error instanceof HttpException) {
        throw error;
      }

      // Otherwise, throw a generic error
      throw new HttpException(
        {
          status: HttpStatus.UNAUTHORIZED,
          message: 'Invalid refresh token',
          error: error.message,
        },
        HttpStatus.UNAUTHORIZED,
      );
    }
  }

  async revokeRefreshToken(userId: string, tokenId?: string) {
    return this.refreshTokenService.revokeRefreshToken(userId, tokenId);
  }

  async getUserActiveSessions(userId: string) {
    return this.refreshTokenService.getUserActiveSessions(userId);
  }

  async getSessionAnalytics(userId: string) {
    return this.refreshTokenService.getSessionAnalytics(userId);
  }

  async getSuspiciousActivities(userId: string) {
    return this.refreshTokenService.getSuspiciousActivities(userId);
  }

  async verifyAccessToken(accessToken: string) {
    return this.tokenService.verifyAccessToken(accessToken);
  }

  async getProfile(userId: string): Promise<User> {
    return this.userService.findByIdOrThrow(userId);
  }

  async changePassword(userId: string, changePasswordDto: ChangePasswordDto) {
    const { currentPassword, newPassword, confirmPassword } = changePasswordDto;

    if (newPassword !== confirmPassword) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          message: 'New password and confirm password do not match',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    const user = await this.databaseService.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          message: 'user_not_found',
        },
        HttpStatus.NOT_FOUND,
      );
    }

    const isPasswordValid = await comparePassword(currentPassword, user.password);

    if (!isPasswordValid) {
      throw new HttpException(
        {
          status: HttpStatus.UNAUTHORIZED,
          message: 'invalid_current_password',
        },
        HttpStatus.UNAUTHORIZED,
      );
    }

    const hashedNewPassword = await hashPassword(newPassword);

    await this.databaseService.user.update({
      where: { id: userId },
      data: { password: hashedNewPassword },
    });

    // Revoke all refresh tokens for security
    await this.refreshTokenService.revokeAllUserTokens(userId);

    return {
      message: 'password_changed_successfully',
      timestamp: new Date().toISOString(),
    };
  }
}
