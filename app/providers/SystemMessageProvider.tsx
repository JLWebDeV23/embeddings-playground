import { PropsWithChildren, createContext, useState } from 'react';

export const Context = createContext<{
  systemMessage: string;
  handleSystemMessage: (message: string) => void;
} | null>(null);

export default function SystemMessageProvider({ children }: PropsWithChildren) {
  const [systemMessage, setSystemMessage] = useState<string>('');

  const handleSystemMessage = (message: string) => {
    setSystemMessage(message);
  };

  return (
    <Context.Provider value={{ systemMessage, handleSystemMessage }}>
      {children}
    </Context.Provider>
  );
}
