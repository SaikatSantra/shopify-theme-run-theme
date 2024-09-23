const standardisePrice = (price: string | number): number => (typeof price === 'string' ? parseFloat(price) : price) * 100

export default standardisePrice