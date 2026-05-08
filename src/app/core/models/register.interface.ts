import { UserRole } from './users.interface';

export interface Register {
  username: string;
  password: string;
  role?: UserRole;
}

export interface Login {
  username: string;
  password: string;
}

export interface LoginUser {
  id: number;
  username: string;
  role: UserRole;
}

export interface LoginResponse {
  token: string;
  user: LoginUser;
}
