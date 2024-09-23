import React from 'react'
import { useSelector } from 'react-redux'

const LoadingBar = (): JSX.Element => {
  const loading = useSelector((state: any) => state.loading);
  if (!loading) {
    return null
  }
  return (
    <div className="app-layer-loading-bar"></div>
  )
};

export default LoadingBar