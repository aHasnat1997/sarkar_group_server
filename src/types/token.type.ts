/**
 * Type representing the payload of a token.
 */
export type TTokenPayload = {
  id: string;
  name: string;
  profileImage: string;
  role: string;
  iat?: number;
  exp?: number;
};
