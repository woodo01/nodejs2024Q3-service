import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { User } from './user.interface';
import { CreateUserDto } from './dto/create.dto';
import { UpdatePasswordDto } from './dto/update.dto';

@Injectable()
export class UserService {
  private users = new Map<string, User>();

  findAll(): Omit<User, 'password'>[] {
    return Array.from(this.users.values()).map((user) => {
      const userDto = { ...user };
      delete userDto.password;
      return userDto;
    });
  }

  findById(id: string): Omit<User, 'password'> {
    if (!this.users.has(id)) throw new NotFoundException('User not found');

    const userDto = { ...this.users.get(id) };
    delete userDto.password;
    return userDto;
  }

  create(createUserDto: CreateUserDto): Omit<User, 'password'> {
    const newUser: User = {
      id: uuidv4(),
      login: createUserDto.login,
      password: createUserDto.password,
      version: 1,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    this.users.set(newUser.id, newUser);

    const newUserDto = { ...newUser };
    delete newUserDto.password;
    return newUserDto;
  }

  update(
    id: string,
    updatePasswordDto: UpdatePasswordDto,
  ): Omit<User, 'password'> {
    if (!this.users.has(id)) throw new NotFoundException('User not found');

    const user = this.users.get(id);
    if (user.password !== updatePasswordDto.oldPassword) {
      throw new ForbiddenException('Old password is incorrect');
    }

    user.password = updatePasswordDto.newPassword;
    user.version += 1;
    user.updatedAt = Date.now();

    const updatedUseDto = { ...user };
    delete updatedUseDto.password;
    return updatedUseDto;
  }

  delete(id: string): void {
    if (!this.users.has(id)) throw new NotFoundException('User not found');
    this.users.delete(id);
  }
}
