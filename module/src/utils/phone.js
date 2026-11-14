const SPOKEN_DIGIT_MAP = {
  // English
  zero: '0', oh: '0', o: '0',
  one: '1', two: '2', three: '3', four: '4', five: '5',
  six: '6', seven: '7', eight: '8', nine: '9', plus: '+',
  // Amharic transliterations & Fidel number words
  'ዜሮ': '0', 'ባዶ': '0',
  'አንድ': '1', 'ሁለት': '2', 'ሶስት': '3', 'ሦስት': '3',
  'አራት': '4', 'አምስት': '5', 'ስድስት': '6', 'ሰባት': '7',
  'ስምንት': '8', 'ዘጠኝ': '9'
};

export function convertSpokenDigits(input) {
  const raw = String(input ?? '').trim();
  if (!raw) return '';
  const tokens = raw.toLowerCase().split(/\s+/);
  let converted = '';
  let matchedWord = false;
  for (const token of tokens) {
    if (Object.prototype.hasOwnProperty.call(SPOKEN_DIGIT_MAP, token)) {
      converted += SPOKEN_DIGIT_MAP[token];
      matchedWord = true;
    } else if (/^[+0-9]+$/.test(token)) {
      converted += token;
    } else {
      return raw;
    }
  }
  return matchedWord ? converted : raw;
}

export function cleanPhoneInput(value) {
  return String(value ?? '').replace(/[\s()-]/g, '').trim();
}

export function isValidEthiopianPhone(value) {
  const cleaned = cleanPhoneInput(value);
  return /^(\+251|251|0)(9|7)[0-9]{8}$/.test(cleaned);
}

export function normalizeEthiopianPhone(value) {
  const cleaned = cleanPhoneInput(value);
  if (!isValidEthiopianPhone(cleaned)) {
    return null;
  }
  if (cleaned.startsWith('+251')) {
    return cleaned;
  }
  if (cleaned.startsWith('251')) {
    return `+${cleaned}`;
  }
  if (cleaned.startsWith('0')) {
    return `+251${cleaned.slice(1)}`;
  }
  return `+251${cleaned}`;
}
