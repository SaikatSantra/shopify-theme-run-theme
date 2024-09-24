import React from 'react';
import { useDispatch } from 'react-redux';
import { dismissToast } from '../../../store/actions/toast';

interface ErrorToastBodyProp {
  data: any;
  errorTitle: string;
  errorMessage: string;
}

const ErrorToastBody = (props: ErrorToastBodyProp): JSX.Element => {
  const dispatch = useDispatch();
  const { errorTitle, errorMessage, data } = props;
  const message =
    data && data[0] && data[0].customMessage
      ? data[0].customMessage
      : errorMessage;
  return (
    <>
      <header className="toast__header">
        <i></i>
        <p className="toast__title">{errorTitle}</p>
        <button
          aria-label="close"
          className="btn-close"
          onClick={() => dispatch(dismissToast())}
        ></button>
      </header>
      <div className="toast__body">
        <p>{message}</p>
      </div>
    </>
  );
};

export default ErrorToastBody;
