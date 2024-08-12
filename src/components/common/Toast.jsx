import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { hideToast } from '../../features/toastSlice';

const Toast = () => {
  const toast = useSelector((state) => {
    console.log('Entire Redux State:', state);
    return state.toast;
  });
  console.log('Toast state:', toast);
  const dispatch = useDispatch();

  useEffect(() => {
    if (toast && toast.isVisible) {
      const timer = setTimeout(() => {
        dispatch(hideToast());
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [toast, dispatch]);

  if (!toast || !toast.isVisible) return null;

  const { message, type } = toast;
  const bgColor = type === 'success' ? 'bg-green-500' : 'bg-red-500';

  return (
    <div className={`fixed bottom-4 right-4 ${bgColor} text-white px-4 py-2 rounded-md shadow-lg transition-opacity duration-300 z-99`}>
      {message}
    </div>
  );
};

export default Toast;