import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../../../store/reducers';
import { hideToast, dismissToast, showToast } from '../../../store/actions/toast';
import CartToastBody from './CartToastBody';
import ErrorToastBody from './ErrorToastBody';

const initialCounter = 5;

interface ToastProp {
  dataSet: any;
}

const Toast = (props: ToastProp): JSX.Element => {
  const active = useSelector((state: RootState) => state.toast.active);
  const isShowing = useSelector((state: RootState) => state.toast.isShowing);
  const type = useSelector((state: RootState) => state.toast.type);
  const data = useSelector((state: RootState) => state.toast.data);
  const quantities = useSelector((state: RootState) => state.toast.quantities);
  const [counter, setCounter] = useState(initialCounter);
  const [paused, setPaused] = useState(false);
  const dispatch = useDispatch();

  // First display handling
  useEffect(() => {
    if (active) {
      // Reset counter and display it.
      setCounter(initialCounter);
      dispatch(showToast());
    }
  }, [active]);

  // Countdown handling
  useEffect(() => {
    let timer: NodeJS.Timeout;
    let killTimer: NodeJS.Timeout;

    if (active) {
      if (counter > 0) {
        if (!paused) {
          timer = setTimeout(() => setCounter(c => c - 1), 1000);
        }
      } else {
        timer = setTimeout(() => dispatch(hideToast()), 1000);
        killTimer = setTimeout(() => dispatch(dismissToast()), 3000);
      }
    }

    return () => {
      if (timer) clearTimeout(timer);
      if (killTimer) clearTimeout(killTimer);
    }
  }, [counter, active, paused]);

  // Don't render it to the DOM if the toast is inactive.
  if (!active) {
    return null;
  }

  const progress = ((initialCounter - counter) * 100 / initialCounter);
  let toastClasses = 'toast';
  if (isShowing) {
    toastClasses += ' toast--visible';
  }

  let body = null;
  switch (type) {
    case 'cart':
      body = (
        <CartToastBody
          quantities={quantities}
          productIds={data}
          cartButtonText={props.dataSet.cartButton}
          cartTitleText={props.dataSet.cartTitleText} />
      );
      break;
    case 'error':
      body = (
        <ErrorToastBody data={data} errorTitle={props.dataSet.errorTitle} errorMessage={props.dataSet.errorMessage} />
      );
      break;
    default:
      break;
  }

  return (
    // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
    <div role="alertdialog" className={toastClasses} onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      {body}
      <footer className="toast__footer">
        <div className="toast__loading-bar">
          <div  className="toast__progress" style={{ width: progress + '%' }}></div>
        </div>
      </footer>
    </div>
  )
};

export default Toast