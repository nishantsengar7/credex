export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
}

export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  success: boolean;
}
