import { scrypt, randomBytes } from "crypto";
import { promisify } from "util";

const scryptAsync = promisify(scrypt);

export class Password {
  static async toHash(password: string) {
    const salt = randomBytes(8).toString();
    const buf = (await scryptAsync(password, salt, 64)) as Buffer;
    return `${buf.toString("hex")}.${salt}`; //////this whole string is stored as the complete password
  }

  static async compare(storedPassword: string, supplyPassword: string) {
    const [hashedPassword, salt] = storedPassword.split(".");
    const buf = (await scryptAsync(supplyPassword, salt, 64)) as Buffer;
    return buf.toString("hex") === hashedPassword;
  }
}
