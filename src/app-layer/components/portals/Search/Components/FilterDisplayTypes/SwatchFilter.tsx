import React from "react";
import { ISearchFilterOption } from "../../../../../context/search/types";
import useSearch from "../../../../../context/search/useSearch";

interface ISwatchFilter {
  option: ISearchFilterOption;
}

interface ISwatchFilterWrap {
  option: ISearchFilterOption;
}

const SwatchFilterWrap: React.FunctionComponent<ISwatchFilterWrap> = ({
  children,
  option,
}) => (
  <>
    {children}
    <span className="filter__swatches">
      {
        <span className="filter__swatches-inner">
          {isNaN(option.records) ? (
            option.label
          ) : (
            <>
              {option.label}
              <span className="filter__count filter__count--swatches">
                ({option.records})
              </span>
            </>
          )}
        </span>
      }
    </span>
  </>
);

const SwatchFilter: React.FunctionComponent<ISwatchFilter> = ({ option }) => {
  const { filterSwatches } = useSearch();
  const { identifier } = option;
  const swatch = filterSwatches.find(
    ({ title }) => title.toLowerCase() === identifier.toLowerCase(),
  );
  if (swatch?.pattern) {
    return (
      <SwatchFilterWrap option={option}>
        <span className="filter__swatch filter__swatch--img">
          <img width="80" height="80" alt={swatch.title} src={swatch.pattern} />
        </span>
      </SwatchFilterWrap>
    );
  } else {
    return (
      <SwatchFilterWrap option={option}>
        <span
          className="filter__swatch filter__swatch--bg"
          style={{ backgroundColor: swatch?.color ?? "none" }}
        ></span>
      </SwatchFilterWrap>
    );
  }
};

export default SwatchFilter;
