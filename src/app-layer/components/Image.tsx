
import React from 'react'
import { getSizedImageUrl } from '../../scripts/utils/image'

interface ImageProps {
  src: string
  width: number
  height: number
  alt?: string
  noLazy?: boolean
  className?: string
}

const Image: React.FunctionComponent<ImageProps> = ({ src, width, height, alt, noLazy, className }: ImageProps) => {
  // This logic is a very simple copy of image.liquid where we take
  // a src, width, height, alt, noLazy and class to generate an image
  // with a srcset

  // Get the array from window.theme object
  let sizesArray = window['theme'].sizesArray
  // Double the width
  const twoTimes = width * 2
  // Add the initial width and the two times width to the array
  sizesArray = [...sizesArray, width, twoTimes]
  // Sort the array
  sizesArray = sizesArray.sort(function (a, b) {  return a - b;  });
  // Remove values higher than the two times width
  // We do this by creating a new array based on
  // the conditional, and then returning it
  sizesArray = sizesArray.reduce((newSizesArray, sizesWidth) => {
    if (sizesWidth <= twoTimes) {
      newSizesArray = [...newSizesArray, sizesWidth];
    }

    return newSizesArray
  }, [])
  // Use Set to ensure we only have unique values
  sizesArray = [...new Set(sizesArray)]

  // Set placeholder scale
  // If the image is to be noLazy loaded we don't use this
  // but if it's lazy then it generates a smaller image for
  // the src
  const placeholderScale = 5

  return (
    <img
      loading={noLazy ? 'eager' : 'lazy'}
      className={className ? className : ''}
      height={height}
      width={width}
      alt={alt ? alt : 'image'}
      srcSet={
        sizesArray.map((sizesWidth) => {
          const aspectRatio = width / height;
          const sizesHeight = Math.round(sizesWidth / aspectRatio);
          return `${getSizedImageUrl(src, `${sizesWidth}x${sizesHeight}`)} ${sizesWidth}w`;
        })
      }
      sizes="auto"
      src={noLazy ? getSizedImageUrl(src, `${width}x${height}`) : getSizedImageUrl(src, `${Math.round(width/placeholderScale)}x${Math.round(height/placeholderScale)}`)}
    />

  )
}

export default Image