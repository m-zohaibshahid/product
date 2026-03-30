import { User } from "../../entities/user.entity";
import * as bcrypt from 'bcrypt';
import { UnauthorizedException } from "@nestjs/common";
import Redis from 'ioredis';
import { JwtService } from "@nestjs/jwt";
import { Repository } from "typeorm";
import { Role } from "../../entities/role.entity";

const redis = new Redis();

async function createToken(user: User, jwtService: JwtService) {
    const payload = {
      sub: user.user_id,
      username: user.username,
      role: user.role?.name,
      status: user.status,
    };

    return jwtService.sign(payload);
}

async function createRefreshToken(user: User, jwtService: JwtService) {
    const payload = {
      sub: user.user_id,
      username: user.username,
      role: user.role?.name,
      status: user.status,
    };

    return jwtService.sign(payload, { expiresIn: '7d' });
}


async function verifyToken(token: string, jwtService: JwtService) {
    return jwtService.verify(token);
}

async function hashPassword(password: string) {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
}

async function comparePassword(password: string, hash: string) {
    try {
        const isPasswordValid = await bcrypt.compare(password, hash);
        if (!isPasswordValid) throw new UnauthorizedException('Invalid credentials');
        return isPasswordValid;
    } catch (error) {
        throw new UnauthorizedException('Invalid credentials');
    }
}

function returnUserWithoutPassword(user: any) {
    const { password_hash: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
}

async function getRoleOfUser(role_id: number, roleRepository: Repository<Role>){
    try {
        const role = await roleRepository.findOne({ where: { role_id } });
        if (!role) throw new UnauthorizedException('Role not found');
        return role;
    } catch (error) {
        throw new UnauthorizedException('Invalid role selection');
    }
}

async function verifyOtp(email: string, otp: string) {
    if (!otp) throw new UnauthorizedException('OTP is required');
    const storedOtp = await redis.get(email);
    console.log("Verifying OTP", { email, provided: otp, stored: storedOtp });
    if (!storedOtp || storedOtp !== otp) {
        throw new UnauthorizedException('Invalid OTP');
    }
    await redis.del(email);
    return true;
}

export {
    createToken,
    createRefreshToken,
    verifyToken,
    hashPassword,
    comparePassword,
    returnUserWithoutPassword,
    getRoleOfUser,
    verifyOtp
}
