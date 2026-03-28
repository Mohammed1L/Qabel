export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

/** Shape persisted in localStorage and held in the AuthService signal. */
export interface StoredUser {
  token: string;
  userId: string;
  name: string;
  email: string;
}
