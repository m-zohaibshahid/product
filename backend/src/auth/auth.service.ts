import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { Role } from '../entities/role.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { createToken,
         comparePassword,
         returnUserWithoutPassword,
         getOneUser,
         getRoleOfUser,
         hashPassword } from './shared/authentication';
import { sendOtp } from 'src/constants/sendOtp';
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async register(registerDto: RegisterDto) {
    await getOneUser(registerDto.username)
    const role = await getRoleOfUser(registerDto.role_id)

   const password_hash = await hashPassword(registerDto.password)

    const user = this.userRepository.create({
      username: registerDto.username,
      password_hash,
      full_name: registerDto.full_name,
      role_id: registerDto.role_id,
      status: 'active',
    });
    sendOtp(registerDto.email);
    const savedUser = await this.userRepository.save(user);
    const userWithoutPassword = returnUserWithoutPassword(savedUser);

    return {
      message: 'User registered successfully',
      user: userWithoutPassword,
    };
  }

  async login(loginDto: LoginDto) {
    const user = await getOneUser(loginDto.username);
    await comparePassword(loginDto.password, user.password_hash);
    const access_token = createToken(user);
    const userWithoutPassword = returnUserWithoutPassword(user);
    return {
      access_token,
      user: userWithoutPassword,
      message: 'Login successful',
    };
  }

  async validateUserById(userId: number) {
    const user = await this.userRepository.findOne({
      where: { user_id: userId },
      relations: ['role'],
    });

    if (!user || user.status !== 'active') {
      return null;
    }

    const { password_hash: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async getProfile(userId: number) {
    const user = await this.userRepository.findOne({
      where: { user_id: userId },
      relations: ['role'],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const { password_hash: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
}



