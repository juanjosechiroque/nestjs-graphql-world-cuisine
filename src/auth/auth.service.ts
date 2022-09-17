import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import constants from '../shared/security/constants';
import { User } from '../user/user';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {

    constructor(
        private usersService: UserService, 
        private jwtService: JwtService
    ){}

    async validateUser(username: string, password: string) { 
        const user: User = await this.usersService.findOne(username);
        if (user && user.password == password) {
            const { password, ...result } = user;
           return result;
        }
        return null;
    }

    async login(user:any) {
        const payload = { username: user.username, sub: user.id, roles: user.roles };
        return {
            token: this.jwtService.sign(payload, { privateKey: constants.JWT_SECRET }),
        };
    }

}
