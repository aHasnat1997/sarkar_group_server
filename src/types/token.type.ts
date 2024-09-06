/**
 * Type representing the payload of a token.
 */
export type TTokenPayload = {
  firstName: string,
  lastName: string,
  email: string,
  profileImage: string,
  role: string,
  iat?: number,
  exp?: number,
};
