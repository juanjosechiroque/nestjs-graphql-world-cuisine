import { SetMetadata } from "@nestjs/common";
import { Role } from "./role.enum";

export const HasRoles = (...roles: Role[]) => SetMetadata("roles", roles);
