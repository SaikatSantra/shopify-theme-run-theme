import { OptionList } from "../../../app-layer/util/typings";

const getCurrentSelectedOptionsFromFields = (
  fields: NodeListOf<HTMLSelectElement | HTMLInputElement>,
): OptionList => {
  if (
    fields[0].nodeName === "INPUT" &&
    fields[0].getAttribute("type") === "radio"
  ) {
    const radioInputs = fields as NodeListOf<HTMLInputElement>;
    return Array.from(radioInputs).flatMap((field) =>
      field.checked ? field.value : [],
    ) as OptionList;
  } else {
    return Array.from(fields).map((field) => field.value) as OptionList;
  }
};

export default getCurrentSelectedOptionsFromFields;
