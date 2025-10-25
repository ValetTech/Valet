
import React, { useEffect } from 'react';
import { CheckCircleIcon } from './Icons';

interface NotificationProps {
  message: string;
  onClose: () => void;
}

const Notification: React.FC<NotificationProps> = ({ message, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed bottom-5 right-5 bg-gradient-to-r from-purple-600 to-blue-600 text-white p-4 rounded-lg shadow-lg flex items-center animate-fade-in-up z-50">
      <CheckCircleIcon className="h-6 w-6 mr-3" />
      <span>{message}</span>
    </div>
  );
};

export default Notification;
