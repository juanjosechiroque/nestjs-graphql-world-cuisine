import { Injectable } from '@nestjs/common';
import { User } from './user';

@Injectable()
export class UserService {

    private users: User[] = [
        new User(11, "admin", "admin", ["admin"]),
        new User(12, "reader", "reader", ["reader"]),
        new User(13, "ucultura", "ucultura", ["ucultura"]),
        new User(14, "uproducto", "uproducto", ["uproducto"]),
        new User(15, "urestaurante", "urestaurante", ["urestaurante"])
    ];

    async findOne(username: string): Promise<User | undefined> {
        return this.users.find(user => user.username = username);
    }

}
