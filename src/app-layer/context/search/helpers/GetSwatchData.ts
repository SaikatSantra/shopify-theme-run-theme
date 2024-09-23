import { IGetSwatchData, ISwatch } from "../types";

const createSVGURI = (colorArray: string[], length: number): string => {
  // We probably don't actually need the 1 but it's there anyway
  // It would also be possible to do 3 or 4
  switch (length) {
    case 1:
      return `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 50 50"><circle cx="25" cy="25" r="25" fill="${colorArray[0]}"/></svg>`)}`;
    case 2:
      return `data:image/svg+xml,${encodeURIComponent(`<svg width="50" height="50" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M50 0v50H0L50 0Z" fill="${colorArray[0]}"/><path d="M0 50V0h50L0 50Z" fill="${colorArray[1]}"/></svg>`)}`;
    default:
      return "";
  }
};

const GetSwatchData: IGetSwatchData = (swatchData) => {
  const data = swatchData;

  const values = Object.values(data);

  const swatches: ISwatch[] = values.map((swatch: ISwatch) => {
    if (swatch.pattern) {
      return {
        color: "",
        pattern: swatch.pattern,
        title: swatch.title,
      };
    } else {
      return {
        color: swatch.colors.length === 1 ? swatch.color : "",
        pattern: createSVGURI(swatch.colors, swatch.colors.length),
        title: swatch.title,
      };
    }
  });
  return swatches;
};

export default GetSwatchData;
