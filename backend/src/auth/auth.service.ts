import {
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { Role } from '../entities/role.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import {
  createToken,
  comparePassword,
  returnUserWithoutPassword,
  getOneUser,
  getRoleOfUser,
  hashPassword,
  verifyOtp,
} from './shared/authentication';
import { sendOtp } from '../constants/sendOtp';
import { SuccessResponse } from '../constants/response';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {

    const existingUser = await getOneUser(registerDto.username, this.userRepository);
    await getRoleOfUser(registerDto.role_id, this.roleRepository);
    if (!registerDto.otp) {
      await sendOtp(registerDto.email);
      return SuccessResponse('OTP sent successfully. Please check your email.', {
        email: registerDto.email,
        status: 'pending_verification',
      });
    }
    await verifyOtp(registerDto.email, registerDto.otp);
    const password_hash = await hashPassword(registerDto.password);

    const userPayload = {
      username: registerDto.username,
      password_hash,
      full_name: registerDto.full_name,
      role_id: registerDto.role_id,
      status: 'active',
    };

    const user = this.userRepository.create(userPayload);
    const savedUser = await this.userRepository.save(user);

    return SuccessResponse('User registered successfully, Please check otp to verify your account', {
      user: returnUserWithoutPassword(savedUser),
    }, 201);
  }

  async login(loginDto: LoginDto) {
    const user = await getOneUser(loginDto.username, this.userRepository);
    if (user.status !== 'active') {
        throw new UnauthorizedException('User account is inactive');
    }
    await comparePassword(loginDto.password, user.password_hash);
    const access_token = await createToken(user, this.jwtService);
    return SuccessResponse('Login successful', {
      access_token,
      user: returnUserWithoutPassword(user),
    });
  }

  async validateUserById(userId: number) {
    const user = await this.userRepository.findOne({
      where: { user_id: userId },
      relations: ['role'],
    });
    return returnUserWithoutPassword(user);
  }

  async getProfile(userId: string) {
    const user = await getOneUser(userId, this.userRepository);

    return SuccessResponse('Profile fetched successfully', {
      user: returnUserWithoutPassword(user),
    });
  }
}
