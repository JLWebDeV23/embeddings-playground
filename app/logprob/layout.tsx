'use client';
import { Provider as ReduxProvider } from 'react-redux';
import { store } from './state/store';
import { PropsWithChildren } from 'react';

export default function Layout({ children }: PropsWithChildren) {
  return <ReduxProvider store={store}>{children}</ReduxProvider>;
}
