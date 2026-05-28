/** Geração de senha no cliente (cadastro / perfil sem sessão). */
export function generatePasswordLocal(length = 16, includeSymbols = true): string {
  const lower = 'abcdefghijklmnopqrstuvwxyz';
  const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numbers = '0123456789';
  const symbols = '!@#$%^&*()-_=+[]{}';
  let chars = lower + upper + numbers;
  if (includeSymbols) chars += symbols;

  const array = new Uint32Array(length);
  crypto.getRandomValues(array);
  let password = '';
  for (let i = 0; i < length; i++) {
    password += chars[array[i]! % chars.length];
  }
  return password;
}
