import React from 'react';
import ReactDOM from 'react-dom';

interface PortalLoaderProps {
  dataAttr: string;
  Component: any;
}

const PortalLoader = (props: PortalLoaderProps): JSX.Element => {
  const { dataAttr, Component } = props;
  const domNodes: NodeListOf<HTMLElement> = document.querySelectorAll(`[${dataAttr}]`);
  if (!domNodes || domNodes.length < 1) return null;
  return <>
    {
      [...domNodes].map(domNode => {
        // Clear the content
        // domNode.innerHTML = '';
        return ReactDOM.createPortal(<Component
          dataSet={domNode.dataset}
        />, domNode);
      })}
  </>
  
 
}

export default PortalLoader;