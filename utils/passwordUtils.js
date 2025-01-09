import bcrypt from "bcryptjs";

export const hashPassword = async (password) => {
  const saltRounds = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  return hashedPassword;
};

export const comparePasswords = async (loginPassword, hashedPassword) => {
  const areMatching = await bcrypt.compare(loginPassword, hashedPassword);

  return areMatching;
};
