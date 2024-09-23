import React from "react";
import { ISearchFilterOption } from "../../../../../context/search/types";

interface IRatingFilter {
  option: ISearchFilterOption;
}

interface IRatingStar {
  colour: string;
}

const Star: React.FunctionComponent<IRatingStar> = ({ colour }) => {
  return (
    <svg width="22" height="20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M11 16.074 17.798 20l-1.804-7.4L22 7.621l-7.909-.653L11 0 7.909 6.968 0 7.621 5.995 12.6 4.202 20 11 16.074Z"
        fill={colour}
      />
    </svg>
  );
};

const colours = {
  on: "#000",
  off: "#ccc",
};

const RatingFilter: React.FunctionComponent<IRatingFilter> = ({ option }) => {
  const stars = Math.round(parseFloat(option.identifier.split("-")[0]));
  return (
    <div className="filter__rating">
      <ul className="filter__stars">
        {Array.from({ length: 5 }).map((_u, i) => (
          <li key={i}>
            <Star colour={i < stars ? colours["on"] : colours["off"]} />
          </li>
        ))}
      </ul>
      {!isNaN(option.records) && (
        <span className="filter__count filter__count--rating">
          ({option.records})
        </span>
      )}
    </div>
  );
};

export default RatingFilter;
