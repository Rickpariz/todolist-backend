import { Entity } from "../../../../shared/domain/entity";

export type BaseUser = {
  name: string;
  email: string;
  password: string;
} & Entity;

export type User = Omit<BaseUser, "password">;
