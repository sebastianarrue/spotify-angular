export interface User {
  id: number;
  email: string;
  isAdmin: boolean;
}

export interface AuthResponse {
  message: string;
  user: User;
}
