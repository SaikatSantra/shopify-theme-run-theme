import React from "react";

export interface SearchFilterOptionsHeaderProps {
  label: string;
  onBack?: () => void;
  onClose?: () => void;
}

export const SearchFilterOptionsHeader: React.FC<
  SearchFilterOptionsHeaderProps
> = ({ label, onBack, onClose }) => {
  return (
    <div className="filter__options-header">
      <button
        type="button"
        onClick={() => (onBack ? onBack() : false)}
        className="filter__options-back"
      >
        <svg
          width="8"
          height="14"
          viewBox="0 0 8 14"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M8 12.665L2.29508 7L8 1.33504L6.65554 -5.87682e-08L0.278385 6.33248C0.100134 6.50954 -1.24871e-06 6.74964 -1.25965e-06 7C-1.2706e-06 7.25036 0.100134 7.49046 0.278385 7.66752L6.65554 14L8 12.665Z"
            fill="#fff"
          />
        </svg>
      </button>

      <p className="filter__options-title">{label}</p>

      <button
        type="button"
        onClick={() => (onClose ? onClose() : false)}
        className="filter__options-close"
      >
        <svg fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18">
          <path
            d="m16.5 1.5-15 15M16.5 16.5l-15-15"
            stroke="#fff"
            strokeWidth="2"
            strokeMiterlimit="10"
            strokeLinecap="square"
          />
        </svg>
      </button>
    </div>
  );
};

export default SearchFilterOptionsHeader;
