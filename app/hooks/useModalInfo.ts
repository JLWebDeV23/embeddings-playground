import { useContext } from 'react';
import { Context } from '@/app/providers/ModalInfoProvider';

export default function useModalInfo() {
  const context = useContext(Context);
  if (!context) {
    throw new Error('useModalInfo must be used within a ModalInfoProvider');
  }

  return context;
}
