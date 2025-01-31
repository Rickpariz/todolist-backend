import { describe, it, expect } from "vitest";
import { hashCompareSync, hashSync } from ".";

describe("hashUtils", () => {
  describe("hashSync", () => {
    it("should generate a hashed password", () => {
      const password = "1234";
      const hash = hashSync(password);

      expect(hash).toBeTypeOf("string");
      expect(hash).not.toEqual(password);
    });

    it("should generate different hashes for the same password", () => {
      const password = "1234";
      const hash1 = hashSync(password);
      const hash2 = hashSync(password);

      expect(hash1).not.toEqual(hash2);
    });
  });

  describe("hashCompareSync", () => {
    it("should return true for a correct password comparison", () => {
      const password = "1234";
      const hash = hashSync(password);
      const result = hashCompareSync(password, hash);

      expect(result).toBe(true);
    });

    it("should return false for an incorrect password comparison", () => {
      const password = "1234";
      const incorrectPassword = "12345";
      const hash = hashSync(password);
      const result = hashCompareSync(incorrectPassword, hash);

      expect(result).toBe(false);
    });
  });
});
