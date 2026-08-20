import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const JWT_SECRET = process.env.JWT_SECRET || 'test-secret-key';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'test-refresh-secret';

export const authService = {
  generateAccessToken(payload: object): string {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: '15m' });
  },

  generateRefreshToken(payload: object): string {
    return jwt.sign(payload, JWT_REFRESH_SECRET, { expiresIn: '7d' });
  },

  verifyAccessToken(token: string): object | null {
    try {
      return jwt.verify(token, JWT_SECRET) as object;
    } catch {
      return null;
    }
  },

  verifyRefreshToken(token: string): object | null {
    try {
      return jwt.verify(token, JWT_REFRESH_SECRET) as object;
    } catch {
      return null;
    }
  },

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 12);
  },

  async comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  },
};

describe('Auth Service — Unit Tests', () => {
  describe('generateAccessToken', () => {
    it('should generate a valid JWT access token', () => {
      const payload = { userId: '123', role: 'vendor' };
      const token = authService.generateAccessToken(payload);
      expect(typeof token).toBe('string');
      expect(token.split('.')).toHaveLength(3);
    });

    it('should embed payload claims in the token', () => {
      const payload = { userId: 'abc', role: 'courier' };
      const token = authService.generateAccessToken(payload);
      const decoded = jwt.decode(token) as Record<string, unknown>;
      expect(decoded.userId).toBe('abc');
      expect(decoded.role).toBe('courier');
    });
  });

  describe('generateRefreshToken', () => {
    it('should generate a refresh token distinct from the access token', () => {
      const payload = { userId: '456' };
      const access = authService.generateAccessToken(payload);
      const refresh = authService.generateRefreshToken(payload);
      expect(access).not.toBe(refresh);
    });
  });

  describe('verifyAccessToken', () => {
    it('should return decoded payload for a valid token', () => {
      const payload = { userId: '789', role: 'admin' };
      const token = authService.generateAccessToken(payload);
      const decoded = authService.verifyAccessToken(token) as Record<string, unknown>;
      expect(decoded).toBeTruthy();
      expect(decoded.userId).toBe('789');
    });

    it('should return null for an invalid token', () => {
      const result = authService.verifyAccessToken('invalid.token.here');
      expect(result).toBeNull();
    });

    it('should return null for a token signed with wrong secret', () => {
      const wrongToken = jwt.sign({ userId: '1' }, 'wrong-secret');
      expect(authService.verifyAccessToken(wrongToken)).toBeNull();
    });
  });

  describe('verifyRefreshToken', () => {
    it('should verify a valid refresh token', () => {
      const payload = { userId: '111' };
      const token = authService.generateRefreshToken(payload);
      const decoded = authService.verifyRefreshToken(token) as Record<string, unknown>;
      expect(decoded).toBeTruthy();
      expect(decoded.userId).toBe('111');
    });

    it('should reject an access token presented as a refresh token', () => {
      const accessToken = authService.generateAccessToken({ userId: '222' });
      expect(authService.verifyRefreshToken(accessToken)).toBeNull();
    });
  });

  describe('hashPassword / comparePassword', () => {
    it('should hash a password and verify it correctly', async () => {
      const password = 'SuperSecret123!';
      const hash = await authService.hashPassword(password);
      expect(hash).not.toBe(password);
      const match = await authService.comparePassword(password, hash);
      expect(match).toBe(true);
    });

    it('should fail comparison with a wrong password', async () => {
      const hash = await authService.hashPassword('correct-password');
      const match = await authService.comparePassword('wrong-password', hash);
      expect(match).toBe(false);
    });
  });
});
