/**
 * Generates a random number between 0 and the number passed.
 * 
 * @param max the maximum number to generate
 */
export const getRandomInt = (max: number): number => {
  return Math.floor(Math.random() * Math.floor(max));
}