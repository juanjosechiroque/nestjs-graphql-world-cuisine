import { SetMetadata } from "@nestjs/common";
import ROLES from "../roles";

export const Roles = (...roles: ROLES[]) => SetMetadata("roles", roles);
