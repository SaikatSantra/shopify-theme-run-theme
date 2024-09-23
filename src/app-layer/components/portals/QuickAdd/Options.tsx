import React from "react";
import { Product, OptionList } from "../../../util/typings";
import getMatchingVariants from "./getMatchingVariants";

interface Props {
  selectedOptions: OptionList;
  product: Product;
  stockMap: Record<string, string>;
  onChange: (updatedOptions: OptionList) => void;
}

const Options: React.FunctionComponent<Props> = ({
  selectedOptions,
  product,
  onChange,
  stockMap,
}: Props) => {
  if (!product) {
    return <></>;
  }
  const update = (index: number, value: string) => () => {
    const updatedOptions = [...selectedOptions] as OptionList;
    updatedOptions[index] = value;
    return onChange(updatedOptions);
  };
  // This file uses the same classes as product-variant-options.liquid
  // so all styling stays in the same place
  return (
    <>
      {product.options.map(({ name, values, position }) => (
        <div
          className={`variant-option variant-option--${name.toLowerCase()}`}
          key={position}
        >
          <div className="variant-option__header">
            <h4 className="variant-option__name">Select {name}:</h4>
            <span className="variant-option__value"></span>
          </div>
          <div className="variant-option__options">
            {values.map((value, i) => {
              const possibleOptions = [...selectedOptions];
              possibleOptions.splice(position - 1, 1, value);
              const matchingVariants = getMatchingVariants(
                possibleOptions,
                product.variants,
              );
              const matchingVariant =
                matchingVariants.length === 1 ? matchingVariants[0] : null;
              const lowStock = Boolean(
                matchingVariant &&
                  stockMap &&
                  stockMap[matchingVariant.id.toString()] &&
                  stockMap[matchingVariant.id.toString()]["availability"] ===
                    "low",
              );
              const preOrder = Boolean(
                matchingVariant &&
                  stockMap &&
                  stockMap[matchingVariant.id.toString()] &&
                  stockMap[matchingVariant.id.toString()]["availability"] ===
                    "pre-order",
              );
              let variantOptionClass = "variant-option__option--oos";
              if (lowStock) {
                variantOptionClass = "variant-option__option--low-stock";
              }
              if (preOrder) {
                variantOptionClass = "variant-option__option--pre-order";
              }
              return (
                <div
                  className={`variant-option__option ${variantOptionClass}`}
                  key={i}
                >
                  <input
                    type="radio"
                    checked={selectedOptions[position - 1] === value}
                    name={`option-${position}`}
                    value={value}
                    className="variant-option__radio visually-hidden"
                    id={`option-${position}-value-${i}`}
                    onChange={update(position - 1, value)}
                  />
                  <label
                    htmlFor={`option-${position}-value-${i}`}
                    className="variant-option__label"
                  >
                    {value}
                  </label>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </>
  );
};

export default Options;
