import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserService } from '../user/user.service';
import { AuthDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
  ) {}

  async signup(authDto: AuthDto) {
    return this.usersService.create({
      ...authDto,
      password: await bcrypt.hash(
        authDto.password,
        Number(process.env.CRYPT_SALT),
      ),
    });
  }

  async signin(authDto: AuthDto) {
    const user = await this.usersService.findByLogin(authDto.login);

    if (user && (await bcrypt.compare(authDto.password, user.password))) {
      const payload = { userId: user.id, login: user.login };
      return {
        accessToken: this.jwtService.sign(payload),
        refreshToken: this.jwtService.sign(payload, {
          secret: process.env.JWT_SECRET_REFRESH_KEY,
          expiresIn: process.env.TOKEN_REFRESH_EXPIRE_TIME,
        }),
      };
    } else {
      throw new UnauthorizedException('Invalid credentials');
    }
  }

  async refresh(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: process.env.JWT_SECRET_REFRESH_KEY,
      });
      return {
        accessToken: this.jwtService.sign({
          userId: payload.userId,
          login: payload.login,
        }),
        refreshToken: this.jwtService.sign(
          { userId: payload.userId, login: payload.login },
          {
            secret: process.env.JWT_SECRET_REFRESH_KEY,
            expiresIn: process.env.TOKEN_REFRESH_EXPIRE_TIME,
          },
        ),
      };
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
}
