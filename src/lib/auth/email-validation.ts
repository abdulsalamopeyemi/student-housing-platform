const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const COMMON_DOMAIN_TYPOS: Record<string, string> = {
  "gmai.com": "gmail.com",
  "gmial.com": "gmail.com",
  "gamil.com": "gmail.com",
  "gmail.co": "gmail.com",
  "gmail.cm": "gmail.com",
  "gmail.con": "gmail.com",
  "gmail.cim": "gmail.com",
  "gmail.om": "gmail.com",
  "gmail.comm": "gmail.com",
  "yaho.com": "yahoo.com",
  "yahho.com": "yahoo.com",
  "yahooo.com": "yahoo.com",
  "outlok.com": "outlook.com",
  "outlook.co": "outlook.com",
  "hotmai.com": "hotmail.com",
  "hotmail.co": "hotmail.com",
};

export function normalizeEmail(value: FormDataEntryValue | string | null | undefined) {
  return typeof value === "string" ? value.trim().toLowerCase() : "";
}

export function emailValidationError(email: string) {
  if (!email) {
    return "Enter your email address.";
  }

  if (email.length > 254 || !EMAIL_PATTERN.test(email)) {
    return "Enter a valid email address.";
  }

  const [localPart, domain] = email.split("@");

  if (!localPart || localPart.length > 64 || !domain) {
    return "Enter a valid email address.";
  }

  return null;
}

export function suggestedEmailCorrection(email: string) {
  const separatorIndex = email.lastIndexOf("@");

  if (separatorIndex <= 0) {
    return null;
  }

  const localPart = email.slice(0, separatorIndex);
  const domain = email.slice(separatorIndex + 1);
  const correctedDomain = COMMON_DOMAIN_TYPOS[domain];

  if (!correctedDomain) {
    return null;
  }

  return `${localPart}@${correctedDomain}`;
}
