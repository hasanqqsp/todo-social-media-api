import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/user/user.entity';
import { LoginDto } from 'src/dtos/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async validateUser(loginDto: LoginDto): Promise<User | null> {
    const user = await this.userRepository.findOne({
      where: { username: loginDto.username },
    });
    if (user && bcrypt.compareSync(loginDto.password, user.password)) {
      return user;
    }
    return null;
  }

  login(user: User): { accessToken: string } {
    const payload: { username: string; sub: number } = {
      username: user.username,
      sub: user.id,
    };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
}
