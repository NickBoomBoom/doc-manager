export interface User {
  email: string;
  name: string;
  rootSpaceId: number | null;
  token: string;
  expires: number | null;
  id: number | null;
}

export interface UserLogin {
  email: string;
  password: string;
}
