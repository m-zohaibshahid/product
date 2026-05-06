import {
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { Role } from '../entities/role.entity';
import { ChangePasswordDto, RegisterDto, ResetPasswordDto, VerifyOtpDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import {
  createToken,
  comparePassword,
  returnUserWithoutPassword,
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
    const existingUser = await this.userRepository.findOne({ where: { username: registerDto.username } });
    if (existingUser) {
      throw new UnauthorizedException('Username already taken');
    }
    const existingEmail = await this.userRepository.findOne({ where: { email: registerDto.email } });
    if (existingEmail) {
      throw new UnauthorizedException('Email already registered');
    }

    await getRoleOfUser(registerDto.role_id, this.roleRepository);
    
    const password_hash = await hashPassword(registerDto.password);
    const userPayload = {
      username: registerDto.username,
      email: registerDto.email,
      password_hash,
      full_name: registerDto.full_name,
      role_id: registerDto.role_id,
      status: 'inactive',
    };

    const user = this.userRepository.create(userPayload);
    const savedUser = await this.userRepository.save(user);

    // Send OTP for verification
    await sendOtp(registerDto.email);

    return SuccessResponse('User registered successfully. Please verify your account with the OTP sent to your email.', {
      user: returnUserWithoutPassword(savedUser),
      email: registerDto.email,
    }, 201);
  }

  async verifyOtp(verifyOtpDto: VerifyOtpDto) {
    await verifyOtp(verifyOtpDto.email, verifyOtpDto.otp);

    const user = await this.userRepository.findOne({ where: { email: verifyOtpDto.email } });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    user.status = 'active';
    await this.userRepository.save(user);

    return SuccessResponse('OTP verified successfully', {
      email: verifyOtpDto.email,
      status: 'active',
    });
  }
  async login(loginDto: LoginDto) {
    const user = await this.userRepository.findOne({ where: { email: loginDto.email }, relations: ['role'] });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (user.status !== 'active') {
      throw new UnauthorizedException('User account is not verified. Please verify your OTP.');
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

  async getProfile(userId: number) {
    const user = await this.userRepository.findOne({where: {user_id: userId}, relations: ['role']});
    if(!user){
      throw new UnauthorizedException('User not found');
    }
    return SuccessResponse('Profile fetched successfully', {
      user: returnUserWithoutPassword(user),
    });
  }

  async resendOtp(email: string) {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    await sendOtp(email);
    return SuccessResponse('OTP resent successfully', {
      email,
    });
  }

  async forgotPassword(email: string) {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    await sendOtp(email);
    return SuccessResponse('OTP resent successfully', {
      email,
    });
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    await verifyOtp(resetPasswordDto.email, resetPasswordDto.otp);
    const user = await this.userRepository.findOne({ where: { email: resetPasswordDto.email } });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    const password_hash = await hashPassword(resetPasswordDto.password);
    user.password_hash = password_hash;
    await this.userRepository.save(user);
    return SuccessResponse('Password reset successfully', {
      email: resetPasswordDto.email,
    });
  }

  async changePassword(changePasswordDto: ChangePasswordDto, userId: number) {
    const user = await this.userRepository.findOne({ where: { user_id: userId } });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    await comparePassword(changePasswordDto.oldPassword, user.password_hash);
    const password_hash = await hashPassword(changePasswordDto.newPassword);
    user.password_hash = password_hash;
    await this.userRepository.save(user);
    return SuccessResponse('Password changed successfully', {
      user: returnUserWithoutPassword(user),
    });
  }
}
