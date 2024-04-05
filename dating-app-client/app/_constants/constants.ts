export enum ArrowKey {
  Left = 37,
  Up = 38,
  Right = 39,
  Down = 40,
}

export function generateRandomPassword(length: number) {
  const uppercaseChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lowercaseChars = "abcdefghijklmnopqrstuvwxyz";
  const numericChars = "0123456789";

  let password = "";
  password += uppercaseChars[Math.floor(Math.random() * uppercaseChars.length)];
  password += lowercaseChars[Math.floor(Math.random() * lowercaseChars.length)];
  password += numericChars[Math.floor(Math.random() * numericChars.length)];

  const remainingLength = length - 3;
  const allChars = uppercaseChars + lowercaseChars + numericChars;

  for (let i = 0; i < remainingLength; i++) {
    password += allChars[Math.floor(Math.random() * allChars.length)];
  }

  password = password
    .split("")
    .sort(() => Math.random() - 0.5)
    .join("");

  return password;
}
