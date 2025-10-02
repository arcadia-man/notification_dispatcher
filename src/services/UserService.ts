import { mockUsers } from "../utils/userDtl";
import { User } from "../interfaces/user";

export class UserService {
    getUser(userId: string): User | undefined{
        const user = mockUsers.find((u) => u.userId === userId);
        return user
    }
    
}
