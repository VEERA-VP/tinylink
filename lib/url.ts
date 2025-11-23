const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

export function generateCode(length = 7): string {
  let result = "";
  for (let i = 0; i < length; i += 1) {
    const index = Math.floor(Math.random() * alphabet.length);
    result += alphabet[index];
  }
  return result;
}

export function isValidCode(code: string): boolean {
  return /^[A-Za-z0-9]{6,8}$/.test(code);
}

export function normalizeUrl(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed) {
    throw new Error("URL is empty");
  }

  try {
    const url = new URL(
      trimmed.startsWith("http://") || trimmed.startsWith("https://")
        ? trimmed
        : `https://${trimmed}`
    );
    return url.toString();
  } catch (e) {
    throw new Error("URL is not valid");
  }
}
