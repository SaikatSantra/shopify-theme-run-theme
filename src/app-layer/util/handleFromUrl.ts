const handleFromUrl = (url: string) => {
  const parts = url.split('/').filter(part => part)
  const handle = parts[parts.length - 1].split('?')[0]
  return handle
}

export default handleFromUrl