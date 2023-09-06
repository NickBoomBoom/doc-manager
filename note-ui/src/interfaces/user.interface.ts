export interface User {
  email: string;
  name: string;
  rootCategoryId: number | null;
  token: string;
  expires: number | null;
  id: number | null;
}

export interface UserLogin {
  email: string;
  password: string;
}
