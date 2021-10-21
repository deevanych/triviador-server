import * as crypto from 'crypto'

export class AuthService {
  public static parseToken = (token) => {
    const parts = token.split('.');
    const tokenId = urlDecode(parts[0]);

    function urlDecode(encoded) {
      return Buffer.from(encoded, 'base64').toString('utf-8');
    }

    function generateHash(token) {
      return crypto.createHash('sha256').update(token).digest('hex');
    }

    if (parts.length !== 2) {
      throw new Error('E_INVALID_API_TOKEN');
    }

    if (!tokenId) {
      throw new Error('E_INVALID_API_TOKEN');
    }

    const parsedToken = generateHash(parts[1]);
    return {
      token: parsedToken,
      tokenId,
    };
  }
}
