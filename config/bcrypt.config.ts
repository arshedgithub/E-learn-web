const defaultBcryptConfig = {
  SALT_ROUNDS: 12,
};

export const BcryptConfig = {
  SALT_ROUNDS: process.env.SALT_ROUNDS || defaultBcryptConfig.SALT_ROUNDS
};
