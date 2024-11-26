import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create.dto';
import { UpdatePasswordDto } from './dto/update.dto';
import { StorageService } from '../storage/storage.service';
import { UserResponseDto } from './dto/response.dto';

@Injectable()
export class UserService {
  constructor(private storage: StorageService) {}

  async findAll(): Promise<UserResponseDto[]> {
    const users = await this.storage.user.findMany({
      select: {
        id: true,
        login: true,
        version: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    return users.map((user) => ({
      ...user,
      createdAt: user.createdAt.getTime(),
      updatedAt: user.updatedAt.getTime(),
    }));
  }

  async findById(id: string): Promise<UserResponseDto> {
    const user = await this.storage.user.findUnique({
      where: { id },
      select: {
        id: true,
        login: true,
        version: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    if (!user) throw new NotFoundException('User not found');
    return {
      ...user,
      createdAt: user.createdAt.getTime(),
      updatedAt: user.updatedAt.getTime(),
    };
  }

  async create(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    const user = await this.storage.user.create({
      data: {
        login: createUserDto.login,
        password: createUserDto.password,
        version: 1,
      },
      select: {
        id: true,
        login: true,
        version: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    return {
      ...user,
      createdAt: user.createdAt.getTime(),
      updatedAt: user.updatedAt.getTime(),
    };
  }

  async update(
    id: string,
    updatePasswordDto: UpdatePasswordDto,
  ): Promise<UserResponseDto> {
    const user = await this.storage.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('User not found');

    if (user.password !== updatePasswordDto.oldPassword) {
      throw new ForbiddenException('Old password is incorrect');
    }

    const updatedVersion = user.version + 1;
    const updUser = await this.storage.user.update({
      where: { id },
      data: {
        password: updatePasswordDto.newPassword,
        version: updatedVersion,
        updatedAt: new Date(),
      },
      select: {
        id: true,
        login: true,
        version: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    return {
      ...updUser,
      createdAt: updUser.createdAt.getTime(),
      updatedAt: updUser.updatedAt.getTime(),
    };
  }

  async delete(id: string): Promise<void> {
    try {
      await this.storage.user.delete({ where: { id } });
    } catch {
      throw new NotFoundException('User not found');
    }
  }

  async findByLogin(login: string) {
    return this.storage.user.findUnique({ where: { login } });
  }
}
