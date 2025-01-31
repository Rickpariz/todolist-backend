export type BaseUser = {
  id: number;
  name: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
};

export type User = Omit<BaseUser, "password">;
