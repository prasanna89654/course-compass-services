import Roles from "./role.enum";

export type JwtPayload = {
    userId: number;
    role: Roles;
}