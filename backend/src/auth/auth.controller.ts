import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { GetUser } from './decorators/get-user.decorator';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { returnUserWithoutPassword } from './shared/authentication';
@ApiTags('User')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'User registered successfully' })
  @ApiResponse({ status: 400, description: 'Invalid request' })
  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @ApiOperation({ summary: 'Login a user' })
  @ApiResponse({ status: 200, description: 'User logged in successfully' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @ApiOperation({ summary: 'Get user profile' })
  @ApiResponse({ status: 200, description: 'User profile fetched successfully' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  @Get('profile')
  @UseGuards(JwtAuthGuard)
  async getProfile(@GetUser() user: any) {
    return this.authService.getProfile(user.user_id);
  }

  @ApiOperation({ summary: 'Get current user' })
  @ApiResponse({ status: 200, description: 'Current user fetched successfully' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getMe(@GetUser() user: any) {
    const userWithoutPassword = await returnUserWithoutPassword(user);
    return {
      user: userWithoutPassword,
      message: 'Current user information',
    };
  }
}



