export interface ToastStateInterface {
  active: boolean;
  isShowing: boolean;
  type: string;
  data: any[];
  quantities?: any[];
}

export const toastInitialState: ToastStateInterface = {
  active: false,
  isShowing: false,
  type: "",
  data: [],
  quantities: [],
};
