import type { Node } from './types'

function uid() {
  return crypto.randomUUID()
}

export function createDefaultContent(): Node {
  return {
    id: uid(),
    type: 'section',
    props: {
      padding: '0px',
      backgroundColor: '#ffffff',
      flexDirection: 'column',
      alignItems: 'stretch',
      justifyContent: 'flex-start',
      gap: '0px',
    },
    children: [
      // --- Menu Bar ---
      {
        id: uid(),
        type: 'menu-bar',
        props: {
          backgroundColor: '#09090b',
          padding: '16px 32px',
          gap: '24px',
        },
        children: [
          {
            id: uid(),
            type: 'text',
            props: {
              content: 'Brand',
              variant: 'p',
              color: '#ffffff',
              fontSize: '20px',
              fontWeight: '700',
              textAlign: 'left',
            },
          },
          {
            id: uid(),
            type: 'section',
            props: {
              padding: '0px',
              backgroundColor: 'transparent',
              flexDirection: 'row',
              alignItems: 'center',
              gap: '24px',
            },
            children: [
              {
                id: uid(),
                type: 'text',
                props: {
                  content: 'Home',
                  variant: 'p',
                  color: '#a1a1aa',
                  fontSize: '14px',
                  fontWeight: '500',
                  textAlign: 'left',
                },
              },
              {
                id: uid(),
                type: 'text',
                props: {
                  content: 'About',
                  variant: 'p',
                  color: '#a1a1aa',
                  fontSize: '14px',
                  fontWeight: '500',
                  textAlign: 'left',
                },
              },
              {
                id: uid(),
                type: 'text',
                props: {
                  content: 'Services',
                  variant: 'p',
                  color: '#a1a1aa',
                  fontSize: '14px',
                  fontWeight: '500',
                  textAlign: 'left',
                },
              },
              {
                id: uid(),
                type: 'text',
                props: {
                  content: 'Contact',
                  variant: 'p',
                  color: '#a1a1aa',
                  fontSize: '14px',
                  fontWeight: '500',
                  textAlign: 'left',
                },
              },
              {
                id: uid(),
                type: 'button',
                props: {
                  label: 'Get Started',
                  backgroundColor: '#3b82f6',
                  color: '#ffffff',
                  borderRadius: '6px',
                  paddingX: '20px',
                  paddingY: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                },
              },
            ],
          },
        ],
      },
      // --- Hero Section ---
      {
        id: uid(),
        type: 'section',
        props: {
          padding: '80px 24px',
          backgroundColor: '#ffffff',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '24px',
          minHeight: '80vh',
        },
        children: [
          {
            id: uid(),
            type: 'text',
            props: {
              content: 'Build Something Amazing',
              variant: 'h1',
              color: '#09090b',
              fontSize: '48px',
              fontWeight: '700',
              textAlign: 'center',
            },
          },
          {
            id: uid(),
            type: 'text',
            props: {
              content:
                'Create beautiful landing pages in minutes. No coding required.',
              variant: 'p',
              color: '#71717a',
              fontSize: '18px',
              fontWeight: '400',
              textAlign: 'center',
            },
          },
          {
            id: uid(),
            type: 'button',
            props: {
              label: 'Get Started',
              backgroundColor: '#3b82f6',
              color: '#ffffff',
              borderRadius: '8px',
              paddingX: '32px',
              paddingY: '14px',
              fontSize: '16px',
              fontWeight: '600',
            },
          },
        ],
      },
      // --- Footer ---
      {
        id: uid(),
        type: 'footer',
        props: {
          backgroundColor: '#09090b',
          padding: '40px 24px',
          gap: '16px',
        },
        children: [
          {
            id: uid(),
            type: 'text',
            props: {
              content: 'Brand',
              variant: 'p',
              color: '#ffffff',
              fontSize: '18px',
              fontWeight: '700',
              textAlign: 'center',
            },
          },
          {
            id: uid(),
            type: 'section',
            props: {
              padding: '0px',
              backgroundColor: 'transparent',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '24px',
            },
            children: [
              {
                id: uid(),
                type: 'text',
                props: {
                  content: 'Privacy Policy',
                  variant: 'p',
                  color: '#a1a1aa',
                  fontSize: '14px',
                  fontWeight: '400',
                  textAlign: 'left',
                },
              },
              {
                id: uid(),
                type: 'text',
                props: {
                  content: 'Terms of Service',
                  variant: 'p',
                  color: '#a1a1aa',
                  fontSize: '14px',
                  fontWeight: '400',
                  textAlign: 'left',
                },
              },
              {
                id: uid(),
                type: 'text',
                props: {
                  content: 'Contact',
                  variant: 'p',
                  color: '#a1a1aa',
                  fontSize: '14px',
                  fontWeight: '400',
                  textAlign: 'left',
                },
              },
            ],
          },
          {
            id: uid(),
            type: 'text',
            props: {
              content: '© 2026 Brand. All rights reserved.',
              variant: 'p',
              color: '#71717a',
              fontSize: '13px',
              fontWeight: '400',
              textAlign: 'center',
            },
          },
        ],
      },
    ],
  }
}
