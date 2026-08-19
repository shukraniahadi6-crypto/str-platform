import { generateAccessToken, verifyAccessToken, generateRefreshToken, verifyRefreshToken } from '../services/auth';
import { UserRole } from '../models/User';

describe('Auth Service', () => {
  const mockUser = { id: 'user-1', email: 'test@example.com', role: UserRole.VENDOR };

  describe('generateAccessToken', () => {
    it('should generate a valid JWT token', () => {
      const token = generateAccessToken(mockUser);
      expect(typeof token).toBe('string');
      expect(token.split('.')).toHaveLength(3);
    });
  });

  describe('verifyAccessToken', () => {
    it('should verify and return the correct payload', () => {
      const token = generateAccessToken(mockUser);
      const payload = verifyAccessToken(token);
      expect(payload.id).toBe(mockUser.id);
      expect(payload.email).toBe(mockUser.email);
      expect(payload.role).toBe(mockUser.role);
    });

    it('should throw on invalid token', () => {
      expect(() => verifyAccessToken('invalid.token.here')).toThrow();
    });
  });

  describe('generateRefreshToken', () => {
    it('should generate a different token from access token', () => {
      const access = generateAccessToken(mockUser);
      const refresh = generateRefreshToken(mockUser);
      expect(access).not.toBe(refresh);
    });
  });

  describe('verifyRefreshToken', () => {
    it('should verify refresh token payload', () => {
      const token = generateRefreshToken(mockUser);
      const payload = verifyRefreshToken(token);
      expect(payload.id).toBe(mockUser.id);
      expect(payload.role).toBe(mockUser.role);
    });

    it('should not verify access token as refresh token', () => {
      const accessToken = generateAccessToken(mockUser);
      expect(() => verifyRefreshToken(accessToken)).toThrow();
    });
  });
});
