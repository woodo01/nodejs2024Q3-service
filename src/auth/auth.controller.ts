import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiTags, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  @ApiResponse({ status: 201, description: 'Successfully signed up' })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  async signup(@Body() authDto: AuthDto) {
    return await this.authService.signup(authDto);
  }

  @Post('signin')
  @ApiResponse({ status: 200, description: 'Successfully signin' })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  @ApiResponse({
    status: 403,
    description: 'Authentication failed',
  })
  async signin(@Body() authDto: AuthDto) {
    return await this.authService.signin(authDto);
  }

  @Post('refresh')
  @ApiResponse({ status: 200, description: 'Token refreshed' })
  @ApiResponse({ status: 401, description: 'Invalid token' })
  @ApiResponse({ status: 403, description: 'Authentication failed' })
  async refresh(@Body('refreshToken') refreshToken: string) {
    if (!refreshToken) {
      throw new UnauthorizedException('No token provided');
    }

    return this.authService.refresh(refreshToken);
  }
}
