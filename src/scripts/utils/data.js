const simpleListToArr = (list) => {
  const arr = list.split(",");
  if (arr.length < 1) {
    return [];
  }
  return arr.map((classname) => {
    return classname.trim();
  });
};

const arraysMatch = (arr1, arr2) => {
  if (arr1.length !== arr2.length) return false;

  for (let i = 0; i < arr1.length; i++) {
    if (arr1[i] !== arr2[i]) return false;
  }

  return true;
};

export { arraysMatch, simpleListToArr };
