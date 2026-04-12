import type { Node } from './types'

export function createDefaultContent(): Node {
  return {
    id: crypto.randomUUID(),
    type: 'section',
    props: {
      padding: '64px 24px',
      backgroundColor: '#ffffff',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '24px',
      minHeight: '100vh',
    },
    children: [
      {
        id: crypto.randomUUID(),
        type: 'text',
        props: {
          content: 'Welcome to Your Page',
          variant: 'h1',
          color: '#09090b',
          fontSize: '48px',
          fontWeight: '700',
          textAlign: 'center',
        },
      },
      {
        id: crypto.randomUUID(),
        type: 'text',
        props: {
          content: 'Start editing to build your amazing landing page',
          variant: 'p',
          color: '#71717a',
          fontSize: '18px',
          fontWeight: '400',
          textAlign: 'center',
        },
      },
      {
        id: crypto.randomUUID(),
        type: 'button',
        props: {
          label: 'Get Started',
          backgroundColor: '#3b82f6',
          color: '#ffffff',
          borderRadius: '8px',
          paddingX: '32px',
          paddingY: '12px',
          fontSize: '16px',
          fontWeight: '600',
        },
      },
    ],
  }
}
