import toast from 'react-hot-toast';

export const showErrorToast = (error: any, fallbackMessage: string = 'An error occurred') => {
  const data = error?.response?.data;
  let message = fallbackMessage;

  if (data) {
    if (typeof data === 'string') {
      message = data;
    } else if (data.message) {
      message = data.message;
    } else if (data.detail) {
      message = data.detail;
    } else if (typeof data === 'object') {
      const firstKey = Object.keys(data)[0];
      const val = data[firstKey];
      if (Array.isArray(val) && val.length > 0) {
        message = `${firstKey}: ${val[0]}`;
      } else {
        message = `${firstKey}: ${val}`;
      }
    }
  } else if (error?.message) {
    message = error.message;
  }

  toast.error(message, {
    duration: 4000,
    style: {
      background: '#0f172a',
      color: '#f8fafc',
      border: '1px solid rgba(239, 68, 68, 0.3)',
      borderRadius: '0.75rem',
      fontSize: '0.875rem',
      fontWeight: '500',
    },
  });
};

export const showSuccessToast = (message: string) => {
  toast.success(message, {
    duration: 3000,
    style: {
      background: '#0f172a',
      color: '#f8fafc',
      border: '1px solid rgba(16, 185, 129, 0.3)',
      borderRadius: '0.75rem',
      fontSize: '0.875rem',
      fontWeight: '500',
    },
  });
};
