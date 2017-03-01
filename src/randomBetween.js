export default function randomBetween(min, max) {
  const diff = max - min;
  const diffPlusOne = diff + 1;
  return Math.floor(Math.random() * diffPlusOne) + min;
}
