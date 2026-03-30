import { User } from "src/entities/user.entity";
import * as bcrypt from 'bcrypt';
import { UnauthorizedException } from "@nestjs/common";


async function createToken(user: User) {
    const payload = {
      sub: user.user_id,
      username: user.username,
      role: user.role?.name,
    };

    const access_token = this.jwtService.sign(payload);

    return access_token;
}

async function createRefreshToken(user: User) {
    const payload = {
      sub: user.user_id,
      username: user.username,
      role: user.role?.name,
    };

    const refresh_token = this.jwtService.sign(payload, { expiresIn: '7d' });

    return refresh_token;
}


async function verifyToken(token: string) {
    const payload = this.jwtService.verify(token);
    return payload;
}

async function hashPassword(password: string) {
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);
    return password_hash;
}

async function comparePassword(password: string, hash: string) {
    try {
        const isPasswordValid = await bcrypt.compare(
            password,
            hash,
        );
        return isPasswordValid;
    } catch (error) {
        throw new UnauthorizedException('Invalid credentials');
    }
}

async function returnUserWithoutPassword(user: User) {
    const { password_hash: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
}

async function getOneUser(username: string) {
    const user = await this.userRepository.findOne({
        where: { username },
        relations: ['role'],
    });

    if (!user) {
        throw new UnauthorizedException('Invalid credentials');
    }

    if (user.status !== 'active') {
        throw new UnauthorizedException('User account is inactive');
    }
    return user;
}


async function getAllUsers(){
    return await this.userRepository.findAll()  
}

async function getRoleOfUser(role_id: number){

try {
    const roledUser = await this.roleRepository.findOne({where: {role_id}})
    return roledUser
} catch (error) {
    throw new UnauthorizedException('Invalid credentials');
}
}
export {
    createToken,
    createRefreshToken,
    verifyToken,
    hashPassword,
    comparePassword,
    returnUserWithoutPassword,
    getOneUser,
    getAllUsers,
    getRoleOfUser
}
