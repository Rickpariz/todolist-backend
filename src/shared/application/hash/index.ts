import bcrypt from "bcryptjs";

export function hashSync(pass: string) {
  const saltRounds = 8;
  const salt = bcrypt.genSaltSync(saltRounds);
  const hash = bcrypt.hashSync(pass, salt);
  return hash;
}

export function hashCompareSync(base: string, hash: string) {
  return bcrypt.compareSync(base, hash);
}
