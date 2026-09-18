export interface LoginResponse {
  success: boolean;
  token: string;
  refreshToken: string;
}

export interface RegisterResponse {
  success: boolean;
  token: string;
  refreshToken: string;
}
export interface LoginRequest {
  LoginIdentifier: string;
  password: string;
}

export interface RegisterRequest {
  fullName: string;
  email: string;
  userName: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  token: string;
  refreshToken: string;
}

export interface RegisterResponse {
  success: boolean;
  token: string;
  refreshToken: string;
}