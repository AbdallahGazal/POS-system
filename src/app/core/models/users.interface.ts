export interface Users {
  data: User[];
}

export interface User {
  id: number;
  username: string;
  role: UserRole;
}

export type UserRole = 'Cashier' | 'Chef' | 'Admin';
