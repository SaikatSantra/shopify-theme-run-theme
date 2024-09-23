const getImageUrlByPosition = (images: string[], position: number) : string => position > 0 && images.length > 0 ? images[position - 1] : ''

export default getImageUrlByPosition;