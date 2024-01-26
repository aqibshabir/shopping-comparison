export const saveStore = (sliceName, state) => {
  if (!sliceName || !state) {
    throw new Error("Missing either sliceName or state");
  }

  localStorage.setItem(sliceName, JSON.stringify(state));
};

export const retrieveStore = (sliceName) => {
  if (!sliceName) {
    throw new Error("No slice name");
  }

  return JSON.parse(localStorage.getItem(sliceName));
};
