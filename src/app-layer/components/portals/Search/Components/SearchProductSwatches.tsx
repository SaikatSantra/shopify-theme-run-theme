import React from "react";
import { ISwatch } from "../../../../context/search/types";

interface Props {
  swatches: ISwatch[];
}

const SearchProductSwatches: React.FC<Props> = ({ swatches }) => {
  // The HTML here should match theme-base/snippets/product-swatches.liquid

  // If you want the swatch to link to the product
  // change the span tag to an a
  // and add href={swatch.url}
  return (
    <ul className="product-swatches">
      {Object.values(swatches).map((swatch, i) => (
        <li key={i}>
          <span
            className={`product-swatches__swatch ${swatch.active ? " product-swatches__swatch--active" : ""}`}
            style={
              {
                "--bg": swatch.pattern
                  ? `url("${swatch.pattern}")`
                  : swatch.colors[0]
                    ? swatch.colors[0]
                    : "",
              } as React.CSSProperties
            }
            title={swatch.title}
          >
            &nbsp;
          </span>
        </li>
      ))}
    </ul>
  );
};

export default SearchProductSwatches;
