const updateOptionFields = (
  fields: NodeListOf<HTMLSelectElement | HTMLInputElement>,
  options: string[],
): void => {
  return options
    ? fields.forEach((field, index) => {
        field.value = options[index] ? options[index] : "";
      })
    : null;
};

export default updateOptionFields;
