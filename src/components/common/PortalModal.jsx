import { createPortal } from 'react-dom';
import DeleteConfirmModal from './DeleteConfirmModal';

const PortalModal = ({ isOpen, onClose, onDelete, title, message }) => {
  if (!isOpen) return null;

  return createPortal(
    <DeleteConfirmModal
      isOpen={isOpen}
      onClose={onClose}
      onDelete={onDelete}
      title={title}
      message={message}
    />,
    document.body
  );
};

export default PortalModal;
