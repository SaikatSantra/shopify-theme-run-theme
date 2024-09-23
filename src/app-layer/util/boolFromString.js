const boolFromString = (val) => {
  switch (val) {
    case "true":
      return true;
    case "false":
      return false;
    default:
      return val;
  }
};

export default boolFromString;
