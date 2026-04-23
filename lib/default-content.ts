import type { GridPlacement, Node } from './types'

function uid() {
  return crypto.randomUUID()
}

function grid(
  desktop: GridPlacement,
  mobile: GridPlacement,
): { grid: { desktop: GridPlacement; mobile: GridPlacement } } {
  return { grid: { desktop, mobile } }
}

export function createBlankContent(): Node {
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
    children: [],
  }
}

export function createGradientLabsContent(): Node {
  return {
    id: uid(),
    type: 'section',
    props: {
      padding: '0px',
      backgroundColor: '#F8F2E8',
      flexDirection: 'column',
      alignItems: 'stretch',
      justifyContent: 'flex-start',
      gap: '0px',
    },
    children: [
      // --- Top orange announcement banner ---
      {
        id: uid(),
        type: 'section',
        props: {
          padding: '0px',
          backgroundColor: '#F4A26B',
          rowHeight: 20,
          minHeight: '44px',
        },
        children: [
          {
            id: uid(),
            type: 'text',
            props: {
              content:
                'Watch our outbound AI agent stop a fraud attempt in real-time →',
              variant: 'p',
              color: '#0A0A0A',
              fontSize: '15px',
              fontWeight: '500',
              textAlign: 'center',
              ...grid(
                { col: 5, row: 1, colSpan: 16, rowSpan: 2 },
                { col: 1, row: 1, colSpan: 8, rowSpan: 2 },
              ),
            },
          },
        ],
      },
      // --- Header / menu bar ---
      {
        id: uid(),
        type: 'menu-bar',
        props: {
          backgroundColor: '#F8F2E8',
          padding: '20px 40px',
          rowHeight: 24,
        },
        children: [
          {
            id: uid(),
            type: 'text',
            props: {
              content: '◧  Gradient Labs',
              variant: 'p',
              color: '#0A0A0A',
              fontSize: '20px',
              fontWeight: '600',
              textAlign: 'left',
              ...grid(
                { col: 1, row: 1, colSpan: 6, rowSpan: 2 },
                { col: 1, row: 1, colSpan: 5, rowSpan: 2 },
              ),
            },
          },
          {
            id: uid(),
            type: 'text',
            props: {
              content: 'Product',
              variant: 'p',
              color: '#0A0A0A',
              fontSize: '15px',
              fontWeight: '500',
              textAlign: 'center',
              ...grid(
                { col: 9, row: 1, colSpan: 2, rowSpan: 2 },
                { col: 1, row: 3, colSpan: 2, rowSpan: 2 },
              ),
            },
          },
          {
            id: uid(),
            type: 'text',
            props: {
              content: 'Use Cases',
              variant: 'p',
              color: '#0A0A0A',
              fontSize: '15px',
              fontWeight: '500',
              textAlign: 'center',
              ...grid(
                { col: 11, row: 1, colSpan: 2, rowSpan: 2 },
                { col: 3, row: 3, colSpan: 2, rowSpan: 2 },
              ),
            },
          },
          {
            id: uid(),
            type: 'text',
            props: {
              content: 'Customers',
              variant: 'p',
              color: '#0A0A0A',
              fontSize: '15px',
              fontWeight: '500',
              textAlign: 'center',
              ...grid(
                { col: 13, row: 1, colSpan: 2, rowSpan: 2 },
                { col: 5, row: 3, colSpan: 2, rowSpan: 2 },
              ),
            },
          },
          {
            id: uid(),
            type: 'text',
            props: {
              content: 'Blog',
              variant: 'p',
              color: '#0A0A0A',
              fontSize: '15px',
              fontWeight: '500',
              textAlign: 'center',
              ...grid(
                { col: 15, row: 1, colSpan: 2, rowSpan: 2 },
                { col: 7, row: 3, colSpan: 2, rowSpan: 2 },
              ),
            },
          },
          {
            id: uid(),
            type: 'text',
            props: {
              content: 'Company',
              variant: 'p',
              color: '#0A0A0A',
              fontSize: '15px',
              fontWeight: '500',
              textAlign: 'center',
              ...grid(
                { col: 17, row: 1, colSpan: 2, rowSpan: 2 },
                { col: 1, row: 5, colSpan: 2, rowSpan: 2 },
              ),
            },
          },
          {
            id: uid(),
            type: 'text',
            props: {
              content: 'Pricing',
              variant: 'p',
              color: '#0A0A0A',
              fontSize: '15px',
              fontWeight: '500',
              textAlign: 'center',
              ...grid(
                { col: 19, row: 1, colSpan: 2, rowSpan: 2 },
                { col: 3, row: 5, colSpan: 2, rowSpan: 2 },
              ),
            },
          },
          {
            id: uid(),
            type: 'button',
            props: {
              label: 'Request a demo  →',
              backgroundColor: '#0A0A0A',
              color: '#ffffff',
              borderRadius: '999px',
              paddingX: '22px',
              paddingY: '10px',
              fontSize: '14px',
              fontWeight: '500',
              border: 'none',
              ...grid(
                { col: 21, row: 1, colSpan: 4, rowSpan: 2 },
                { col: 1, row: 7, colSpan: 8, rowSpan: 2 },
              ),
            },
          },
        ],
      },
      // --- Hero ---
      {
        id: uid(),
        type: 'section',
        props: {
          padding: '0px 24px',
          backgroundColor: '#F8F2E8',
          rowHeight: 24,
          minHeight: '88vh',
        },
        children: [
          {
            id: uid(),
            type: 'text',
            props: {
              content: '■  Scale your service',
              variant: 'p',
              color: '#0A0A0A',
              fontSize: '22px',
              fontWeight: '400',
              fontFamily: 'var(--font-playfair), Georgia, serif',
              fontStyle: 'italic',
              textAlign: 'center',
              ...grid(
                { col: 9, row: 8, colSpan: 8, rowSpan: 2 },
                { col: 1, row: 2, colSpan: 8, rowSpan: 2 },
              ),
            },
          },
          {
            id: uid(),
            type: 'text',
            props: {
              content: 'The only AI support agent built for financial services',
              variant: 'h1',
              color: '#0A0A0A',
              fontSize: '76px',
              fontWeight: '700',
              fontFamily: 'var(--font-inter), system-ui, sans-serif',
              letterSpacing: '-0.03em',
              textAlign: 'center',
              lineHeight: '1.05',
              ...grid(
                { col: 4, row: 11, colSpan: 18, rowSpan: 8 },
                { col: 1, row: 5, colSpan: 8, rowSpan: 8 },
              ),
            },
          },
          {
            id: uid(),
            type: 'text',
            props: {
              content:
                'Our AI agent resolves complex customer service queries end-to-end. Delivering quality, efficiency and compliance at every step.',
              variant: 'p',
              color: '#5C5C5C',
              fontSize: '18px',
              fontWeight: '400',
              fontFamily: 'var(--font-inter), system-ui, sans-serif',
              textAlign: 'center',
              lineHeight: '1.5',
              ...grid(
                { col: 7, row: 20, colSpan: 12, rowSpan: 3 },
                { col: 1, row: 14, colSpan: 8, rowSpan: 4 },
              ),
            },
          },
          {
            id: uid(),
            type: 'button',
            props: {
              label: 'See it in action  →',
              backgroundColor: '#F4A26B',
              color: '#0A0A0A',
              borderRadius: '999px',
              paddingX: '32px',
              paddingY: '14px',
              fontSize: '16px',
              fontWeight: '500',
              border: 'none',
              ...grid(
                { col: 11, row: 24, colSpan: 4, rowSpan: 3 },
                { col: 2, row: 19, colSpan: 6, rowSpan: 3 },
              ),
            },
          },
        ],
      },
    ],
  }
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
      // --- Menu Bar (grid: brand left, links + CTA right) ---
      {
        id: uid(),
        type: 'menu-bar',
        props: { backgroundColor: '#09090b', padding: '16px 32px', rowHeight: 24 },
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
              ...grid(
                { col: 1, row: 1, colSpan: 5, rowSpan: 2 },
                { col: 1, row: 1, colSpan: 4, rowSpan: 2 },
              ),
            },
          },
          {
            id: uid(),
            type: 'text',
            props: {
              content: 'Home',
              variant: 'p',
              color: '#a1a1aa',
              fontSize: '14px',
              fontWeight: '500',
              textAlign: 'center',
              ...grid(
                { col: 13, row: 1, colSpan: 2, rowSpan: 2 },
                { col: 1, row: 3, colSpan: 2, rowSpan: 2 },
              ),
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
              textAlign: 'center',
              ...grid(
                { col: 15, row: 1, colSpan: 2, rowSpan: 2 },
                { col: 3, row: 3, colSpan: 2, rowSpan: 2 },
              ),
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
              textAlign: 'center',
              ...grid(
                { col: 17, row: 1, colSpan: 3, rowSpan: 2 },
                { col: 5, row: 3, colSpan: 2, rowSpan: 2 },
              ),
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
              textAlign: 'center',
              ...grid(
                { col: 20, row: 1, colSpan: 2, rowSpan: 2 },
                { col: 7, row: 3, colSpan: 2, rowSpan: 2 },
              ),
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
              ...grid(
                { col: 22, row: 1, colSpan: 3, rowSpan: 2 },
                { col: 1, row: 5, colSpan: 8, rowSpan: 2 },
              ),
            },
          },
        ],
      },
      // --- Hero ---
      {
        id: uid(),
        type: 'section',
        props: {
          padding: '80px 24px',
          backgroundColor: '#ffffff',
          rowHeight: 24,
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
              ...grid(
                { col: 4, row: 4, colSpan: 18, rowSpan: 4 },
                { col: 1, row: 3, colSpan: 8, rowSpan: 5 },
              ),
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
              ...grid(
                { col: 6, row: 9, colSpan: 14, rowSpan: 3 },
                { col: 1, row: 9, colSpan: 8, rowSpan: 3 },
              ),
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
              ...grid(
                { col: 11, row: 13, colSpan: 4, rowSpan: 3 },
                { col: 2, row: 13, colSpan: 6, rowSpan: 3 },
              ),
            },
          },
        ],
      },
      // --- Footer ---
      {
        id: uid(),
        type: 'footer',
        props: { backgroundColor: '#09090b', padding: '40px 24px', rowHeight: 24 },
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
              ...grid(
                { col: 11, row: 1, colSpan: 4, rowSpan: 2 },
                { col: 1, row: 1, colSpan: 8, rowSpan: 2 },
              ),
            },
          },
          {
            id: uid(),
            type: 'text',
            props: {
              content: 'Privacy Policy',
              variant: 'p',
              color: '#a1a1aa',
              fontSize: '14px',
              fontWeight: '400',
              textAlign: 'center',
              ...grid(
                { col: 8, row: 4, colSpan: 4, rowSpan: 2 },
                { col: 1, row: 4, colSpan: 4, rowSpan: 2 },
              ),
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
              textAlign: 'center',
              ...grid(
                { col: 12, row: 4, colSpan: 3, rowSpan: 2 },
                { col: 5, row: 4, colSpan: 4, rowSpan: 2 },
              ),
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
              textAlign: 'center',
              ...grid(
                { col: 15, row: 4, colSpan: 3, rowSpan: 2 },
                { col: 1, row: 6, colSpan: 8, rowSpan: 2 },
              ),
            },
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
              ...grid(
                { col: 8, row: 7, colSpan: 10, rowSpan: 2 },
                { col: 1, row: 9, colSpan: 8, rowSpan: 2 },
              ),
            },
          },
        ],
      },
    ],
  }
}
