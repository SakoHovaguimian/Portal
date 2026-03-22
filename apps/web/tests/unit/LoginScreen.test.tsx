import React from 'react';
import { render, screen } from '@testing-library/react';
import type { ComponentProps, ReactNode } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { LoginScreen } from '../../features/auth/LoginScreen';

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn(), refresh: vi.fn() }),
  useSearchParams: () => new URLSearchParams(),
}));

vi.mock('../../lib/auth/firebase', () => ({
  getFirebaseAuth: () => null,
}));

vi.mock('@semantic-web/ui', () => ({
  Button: ({ children, ...props }: ComponentProps<'button'>) => <button {...props}>{children}</button>,
  Card: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  Field: ({ labelText, children }: { labelText: string; children: ReactNode }) => (
    <label>
      <span>{labelText}</span>
      {children}
    </label>
  ),
  Input: (props: ComponentProps<'input'>) => <input {...props} />,
}));

describe('LoginScreen', () => {
  it('renders the mock login affordance', () => {
    render(<LoginScreen />);
    expect(screen.getByText('Welcome back')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Sign in' })).toBeInTheDocument();
  });
});
