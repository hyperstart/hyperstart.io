const ALPHABET =
  "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_~"
const SIZE = 12
const rand = () => ALPHABET[Math.floor(Math.random() * ALPHABET.length)]

/**
 * Function to generate a GUID.
 */
export const guid = (): string =>
  Array.apply(null, Array(SIZE))
    .map(rand)
    .join("")
