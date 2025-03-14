import { genSalt, hash, compare } from 'bcrypt';

const saltRounds = 10;

export async function hashPassword(plainPassword: string): Promise<string> {
  try {
    const salt = await genSalt(saltRounds);
    return await hash(plainPassword, salt);
  } catch (error) {
    console.log(error);
  }
}

export const comparePassword = async (
  plainPassword: string,
  hashedPassword: string,
): Promise<boolean> => {
  return compare(plainPassword, hashedPassword);
};
