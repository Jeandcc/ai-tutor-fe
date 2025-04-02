export function generateRandomAlphanumeric(length: number): string {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  const charactersLength = characters.length;

  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result;
}

export const findWhatObjPropsOfObjectsAreDifferent = (
  prevState: Record<string, unknown>,
  newState: Record<string, unknown>
) => {
  const prevStateKeys = Object.keys(prevState);
  const newStateKeys = Object.keys(newState);

  const differentProps = prevStateKeys.filter((key) => {
    if (newStateKeys.includes(key)) {
      try {
        return JSON.stringify(prevState[key]) !== JSON.stringify(newState[key]);
      } catch (error) {
        return false;
      }
    }
    return false;
  });

  return differentProps;
};
