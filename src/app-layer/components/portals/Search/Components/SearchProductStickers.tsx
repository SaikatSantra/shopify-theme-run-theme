import React from 'react';
import { ISticker } from '../../../../context/search/types';

interface Props {
  stickers: ISticker[];
}
const SearchProductStickers: React.FC<Props> = ({ stickers }) => {
  // The HTML here should match theme-base/snippets/product-stickers.liquid
  return (
    <ul className="product-stickers product-stickers--overlay">
      {Object.values(stickers).map((sticker, i) => (
        <li
          key={i}
          className="product-stickers__sticker"
          style={
            {
              '--bg': sticker.backgroundColor,
              '--color': sticker.textColor,
            } as React.CSSProperties
          }
        >
          {sticker.title}
        </li>
      ))}
    </ul>
  );
};

export default SearchProductStickers;
