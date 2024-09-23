import React from "react";
import SearchDummyProductCard from "./SearchDummyProductCard";

interface Props {
  count: number;
}
/**
 * Create a list of dummy (empty) product cards
 * to display and utilise on the collection pages
 */

const SearchDummyProductCardGrid: React.FC<Props> = ({
  count,
}): JSX.Element => {
  return (
    <>
      {[...Array.from({ length: count })].map((_ignore, dummyIndex: number) => {
        return <SearchDummyProductCard key={`${dummyIndex}`} />;
      })}
    </>
  );
};

export default SearchDummyProductCardGrid;
