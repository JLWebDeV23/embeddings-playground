import { useContext } from 'react';
import { Context } from '@/app/providers/SystemMessageProvider';

export default function useSystemMessage() {
  const context = useContext(Context);
  if (!context) {
    throw new Error(
      'useSystemMessage must be used within a SystemMessageProvider'
    );
  }

  return context;
}
