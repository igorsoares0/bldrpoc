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
