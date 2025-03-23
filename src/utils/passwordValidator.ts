export const PASSWORD_REQUIREMENT_MESSAGE = "Password must be at least 10 characters long and include uppercase, lowercase, digit, and special character";

export const isStrongPassword = (password: string): boolean => {
  return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{10,}$/.test(password);
};



