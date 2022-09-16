import { Injectable } from '@nestjs/common';
import { User } from './user';

@Injectable()
export class UserService {

    private users: User[] = [
        new User(1, "admin", "admin", ["admin"]),
        new User(2, "reader", "reader", ["reader"]),
        new User(3, "ucultura", "ucultura", ["ucultura"]),
        new User(4, "uproducto", "uproducto", ["uproducto"]),
        new User(5, "urestaurante", "urestaurante", ["urestaurante"])
    ];

    async findOne(username: string): Promise<User | undefined> {
        return this.users.find(user => user.username = username);
    }

}
