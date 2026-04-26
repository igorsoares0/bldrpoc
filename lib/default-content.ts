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
              mobile: { fontSize: '12px' },
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
          mobile: { padding: '12px 16px' },
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
              mobile: { fontSize: '15px' },
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
              textAlign: 'left',
              mobile: { fontSize: '13px', textAlign: 'left' },
              ...grid(
                { col: 9, row: 1, colSpan: 2, rowSpan: 2 },
                { col: 1, row: 4, colSpan: 3, rowSpan: 2 },
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
              mobile: { fontSize: '13px', textAlign: 'left' },
              ...grid(
                { col: 11, row: 1, colSpan: 2, rowSpan: 2 },
                { col: 4, row: 4, colSpan: 3, rowSpan: 2 },
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
              mobile: { fontSize: '13px', textAlign: 'left' },
              ...grid(
                { col: 13, row: 1, colSpan: 2, rowSpan: 2 },
                { col: 1, row: 6, colSpan: 3, rowSpan: 2 },
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
              mobile: { fontSize: '13px', textAlign: 'left' },
              ...grid(
                { col: 15, row: 1, colSpan: 2, rowSpan: 2 },
                { col: 4, row: 6, colSpan: 3, rowSpan: 2 },
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
              mobile: { fontSize: '13px', textAlign: 'left' },
              ...grid(
                { col: 17, row: 1, colSpan: 2, rowSpan: 2 },
                { col: 1, row: 8, colSpan: 3, rowSpan: 2 },
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
              mobile: { fontSize: '13px', textAlign: 'left' },
              ...grid(
                { col: 19, row: 1, colSpan: 2, rowSpan: 2 },
                { col: 4, row: 8, colSpan: 3, rowSpan: 2 },
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
              fontFamily: 'var(--font-inter), system-ui, sans-serif',
              mobile: { fontSize: '12px', paddingX: '14px', paddingY: '8px' },
              ...grid(
                { col: 21, row: 1, colSpan: 4, rowSpan: 2 },
                { col: 6, row: 1, colSpan: 3, rowSpan: 2 },
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
          mobile: { padding: '24px 16px', minHeight: 'auto' },
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
              mobile: { fontSize: '15px' },
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
              mobile: { fontSize: '34px', letterSpacing: '-0.02em' },
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
              mobile: { fontSize: '14px' },
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
              fontFamily: 'var(--font-inter), system-ui, sans-serif',
              mobile: { fontSize: '14px', paddingX: '22px', paddingY: '12px' },
              ...grid(
                { col: 11, row: 24, colSpan: 4, rowSpan: 3 },
                { col: 2, row: 19, colSpan: 6, rowSpan: 3 },
              ),
            },
          },
        ],
      },
      // --- Logo cloud (dark) ---
      {
        id: uid(),
        type: 'section',
        props: {
          padding: '48px 24px',
          backgroundColor: '#0A0A0A',
          rowHeight: 24,
          mobile: { padding: '32px 16px' },
        },
        children: [
          {
            id: uid(),
            type: 'text',
            props: {
              content: 'Trusted by teams in regulated industries',
              variant: 'p',
              color: '#71717a',
              fontSize: '13px',
              fontWeight: '500',
              textAlign: 'center',
              fontFamily: 'var(--font-inter), system-ui, sans-serif',
              ...grid(
                { col: 7, row: 1, colSpan: 12, rowSpan: 2 },
                { col: 1, row: 1, colSpan: 8, rowSpan: 2 },
              ),
            },
          },
          {
            id: uid(),
            type: 'text',
            props: {
              content: 'VISA',
              variant: 'p',
              color: '#ffffff',
              fontSize: '22px',
              fontWeight: '700',
              textAlign: 'center',
              fontFamily: 'var(--font-inter), system-ui, sans-serif',
              letterSpacing: '0.08em',
              mobile: { fontSize: '17px' },
              ...grid(
                { col: 3, row: 4, colSpan: 4, rowSpan: 2 },
                { col: 1, row: 4, colSpan: 4, rowSpan: 2 },
              ),
            },
          },
          {
            id: uid(),
            type: 'text',
            props: {
              content: 'stripe',
              variant: 'p',
              color: '#ffffff',
              fontSize: '22px',
              fontWeight: '600',
              textAlign: 'center',
              fontFamily: 'var(--font-inter), system-ui, sans-serif',
              mobile: { fontSize: '17px' },
              ...grid(
                { col: 7, row: 4, colSpan: 4, rowSpan: 2 },
                { col: 5, row: 4, colSpan: 4, rowSpan: 2 },
              ),
            },
          },
          {
            id: uid(),
            type: 'text',
            props: {
              content: 'Klarna',
              variant: 'p',
              color: '#ffffff',
              fontSize: '22px',
              fontWeight: '600',
              textAlign: 'center',
              fontFamily: 'var(--font-inter), system-ui, sans-serif',
              mobile: { fontSize: '17px' },
              ...grid(
                { col: 11, row: 4, colSpan: 4, rowSpan: 2 },
                { col: 1, row: 6, colSpan: 4, rowSpan: 2 },
              ),
            },
          },
          {
            id: uid(),
            type: 'text',
            props: {
              content: 'Revolut',
              variant: 'p',
              color: '#ffffff',
              fontSize: '22px',
              fontWeight: '600',
              textAlign: 'center',
              fontFamily: 'var(--font-inter), system-ui, sans-serif',
              mobile: { fontSize: '17px' },
              ...grid(
                { col: 15, row: 4, colSpan: 4, rowSpan: 2 },
                { col: 5, row: 6, colSpan: 4, rowSpan: 2 },
              ),
            },
          },
          {
            id: uid(),
            type: 'text',
            props: {
              content: 'Mastercard',
              variant: 'p',
              color: '#ffffff',
              fontSize: '22px',
              fontWeight: '600',
              textAlign: 'center',
              fontFamily: 'var(--font-inter), system-ui, sans-serif',
              mobile: { fontSize: '15px' },
              ...grid(
                { col: 19, row: 4, colSpan: 4, rowSpan: 2 },
                { col: 1, row: 8, colSpan: 8, rowSpan: 2 },
              ),
            },
          },
        ],
      },
      // --- Features ---
      {
        id: uid(),
        type: 'section',
        props: {
          padding: '96px 24px',
          backgroundColor: '#F8F2E8',
          rowHeight: 24,
          mobile: { padding: '48px 16px' },
        },
        children: [
          {
            id: uid(),
            type: 'text',
            props: {
              content: '◆  Built for scale',
              variant: 'p',
              color: '#0A0A0A',
              fontSize: '18px',
              fontWeight: '400',
              fontFamily: 'var(--font-playfair), Georgia, serif',
              fontStyle: 'italic',
              textAlign: 'left',
              mobile: { fontSize: '14px' },
              ...grid(
                { col: 3, row: 1, colSpan: 8, rowSpan: 2 },
                { col: 1, row: 1, colSpan: 8, rowSpan: 2 },
              ),
            },
          },
          {
            id: uid(),
            type: 'text',
            props: {
              content: 'AI engineered to transform customer service',
              variant: 'h2',
              color: '#0A0A0A',
              fontSize: '52px',
              fontWeight: '700',
              fontFamily: 'var(--font-inter), system-ui, sans-serif',
              letterSpacing: '-0.02em',
              lineHeight: '1.05',
              textAlign: 'left',
              mobile: { fontSize: '28px' },
              ...grid(
                { col: 3, row: 4, colSpan: 16, rowSpan: 6 },
                { col: 1, row: 3, colSpan: 8, rowSpan: 6 },
              ),
            },
          },
          {
            id: uid(),
            type: 'text',
            props: {
              content: 'Superhuman performance at scale',
              variant: 'h3',
              color: '#0A0A0A',
              fontSize: '22px',
              fontWeight: '600',
              fontFamily: 'var(--font-inter), system-ui, sans-serif',
              textAlign: 'left',
              mobile: { fontSize: '17px' },
              ...grid(
                { col: 3, row: 12, colSpan: 8, rowSpan: 2 },
                { col: 1, row: 10, colSpan: 8, rowSpan: 2 },
              ),
            },
          },
          {
            id: uid(),
            type: 'text',
            props: {
              content:
                'Resolve complex queries end-to-end with consistent quality across millions of conversations.',
              variant: 'p',
              color: '#5C5C5C',
              fontSize: '15px',
              fontWeight: '400',
              fontFamily: 'var(--font-inter), system-ui, sans-serif',
              lineHeight: '1.5',
              textAlign: 'left',
              ...grid(
                { col: 3, row: 14, colSpan: 8, rowSpan: 4 },
                { col: 1, row: 12, colSpan: 8, rowSpan: 4 },
              ),
            },
          },
          {
            id: uid(),
            type: 'text',
            props: {
              content: '52%',
              variant: 'h2',
              color: '#0A0A0A',
              fontSize: '88px',
              fontWeight: '700',
              fontFamily: 'var(--font-inter), system-ui, sans-serif',
              letterSpacing: '-0.04em',
              textAlign: 'left',
              mobile: { fontSize: '56px' },
              ...grid(
                { col: 12, row: 12, colSpan: 5, rowSpan: 5 },
                { col: 1, row: 17, colSpan: 4, rowSpan: 5 },
              ),
            },
          },
          {
            id: uid(),
            type: 'text',
            props: {
              content: 'reduction in average handle time after deployment.',
              variant: 'p',
              color: '#5C5C5C',
              fontSize: '14px',
              fontWeight: '400',
              fontFamily: 'var(--font-inter), system-ui, sans-serif',
              lineHeight: '1.5',
              textAlign: 'left',
              ...grid(
                { col: 12, row: 17, colSpan: 5, rowSpan: 3 },
                { col: 5, row: 18, colSpan: 4, rowSpan: 4 },
              ),
            },
          },
          {
            id: uid(),
            type: 'text',
            props: {
              content: 'Compliance with full audit trail',
              variant: 'h3',
              color: '#0A0A0A',
              fontSize: '22px',
              fontWeight: '600',
              fontFamily: 'var(--font-inter), system-ui, sans-serif',
              textAlign: 'left',
              mobile: { fontSize: '17px' },
              ...grid(
                { col: 18, row: 12, colSpan: 6, rowSpan: 2 },
                { col: 1, row: 23, colSpan: 8, rowSpan: 2 },
              ),
            },
          },
          {
            id: uid(),
            type: 'text',
            props: {
              content:
                'Every decision logged, explainable, and reviewable. Built for the requirements of regulated industries.',
              variant: 'p',
              color: '#5C5C5C',
              fontSize: '15px',
              fontWeight: '400',
              fontFamily: 'var(--font-inter), system-ui, sans-serif',
              lineHeight: '1.5',
              textAlign: 'left',
              ...grid(
                { col: 18, row: 14, colSpan: 6, rowSpan: 4 },
                { col: 1, row: 25, colSpan: 8, rowSpan: 4 },
              ),
            },
          },
        ],
      },
      // --- Mid CTA dark ---
      {
        id: uid(),
        type: 'section',
        props: {
          padding: '96px 24px',
          backgroundColor: '#0A0A0A',
          rowHeight: 24,
          mobile: { padding: '48px 16px' },
        },
        children: [
          {
            id: uid(),
            type: 'text',
            props: {
              content: 'OneBank Labs',
              variant: 'p',
              color: '#71717a',
              fontSize: '13px',
              fontWeight: '500',
              fontFamily: 'var(--font-inter), system-ui, sans-serif',
              textAlign: 'left',
              ...grid(
                { col: 3, row: 1, colSpan: 8, rowSpan: 2 },
                { col: 1, row: 1, colSpan: 8, rowSpan: 2 },
              ),
            },
          },
          {
            id: uid(),
            type: 'text',
            props: {
              content: 'Deep automation from day one',
              variant: 'h2',
              color: '#ffffff',
              fontSize: '44px',
              fontWeight: '700',
              fontFamily: 'var(--font-inter), system-ui, sans-serif',
              letterSpacing: '-0.02em',
              lineHeight: '1.1',
              textAlign: 'left',
              mobile: { fontSize: '26px' },
              ...grid(
                { col: 3, row: 4, colSpan: 12, rowSpan: 5 },
                { col: 1, row: 3, colSpan: 8, rowSpan: 5 },
              ),
            },
          },
          {
            id: uid(),
            type: 'text',
            props: {
              content:
                'Resolution rates above 60% within the first month — without compromising on tone, accuracy, or compliance.',
              variant: 'p',
              color: '#a1a1aa',
              fontSize: '17px',
              fontWeight: '400',
              fontFamily: 'var(--font-inter), system-ui, sans-serif',
              lineHeight: '1.55',
              textAlign: 'left',
              mobile: { fontSize: '14px' },
              ...grid(
                { col: 3, row: 10, colSpan: 12, rowSpan: 4 },
                { col: 1, row: 9, colSpan: 8, rowSpan: 5 },
              ),
            },
          },
          {
            id: uid(),
            type: 'button',
            props: {
              label: 'Read the case study  →',
              backgroundColor: '#F4A26B',
              color: '#0A0A0A',
              borderRadius: '999px',
              paddingX: '28px',
              paddingY: '12px',
              fontSize: '15px',
              fontWeight: '500',
              border: 'none',
              fontFamily: 'var(--font-inter), system-ui, sans-serif',
              mobile: { fontSize: '13px', paddingX: '20px', paddingY: '10px' },
              ...grid(
                { col: 3, row: 15, colSpan: 5, rowSpan: 3 },
                { col: 1, row: 15, colSpan: 7, rowSpan: 3 },
              ),
            },
          },
          {
            id: uid(),
            type: 'image',
            props: {
              src: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=900&q=80',
              alt: 'Analytics dashboard',
              borderRadius: '16px',
              objectFit: 'cover',
              width: '100%',
              height: '100%',
              ...grid(
                { col: 16, row: 4, colSpan: 8, rowSpan: 14 },
                { col: 1, row: 19, colSpan: 8, rowSpan: 10 },
              ),
            },
          },
        ],
      },
      // --- Bottom orange CTA ---
      {
        id: uid(),
        type: 'section',
        props: {
          padding: '120px 24px',
          backgroundColor: '#F4A26B',
          rowHeight: 24,
          mobile: { padding: '64px 20px' },
        },
        children: [
          {
            id: uid(),
            type: 'text',
            props: {
              content: '■  Ready when you are',
              variant: 'p',
              color: '#0A0A0A',
              fontSize: '20px',
              fontWeight: '400',
              fontFamily: 'var(--font-playfair), Georgia, serif',
              fontStyle: 'italic',
              textAlign: 'center',
              mobile: { fontSize: '15px' },
              ...grid(
                { col: 9, row: 2, colSpan: 8, rowSpan: 2 },
                { col: 1, row: 2, colSpan: 8, rowSpan: 2 },
              ),
            },
          },
          {
            id: uid(),
            type: 'text',
            props: {
              content: 'The only AI support agent built for financial services',
              variant: 'h2',
              color: '#0A0A0A',
              fontSize: '64px',
              fontWeight: '700',
              fontFamily: 'var(--font-inter), system-ui, sans-serif',
              letterSpacing: '-0.03em',
              lineHeight: '1.05',
              textAlign: 'center',
              mobile: { fontSize: '30px', letterSpacing: '-0.02em' },
              ...grid(
                { col: 4, row: 5, colSpan: 18, rowSpan: 8 },
                { col: 1, row: 5, colSpan: 8, rowSpan: 8 },
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
              paddingX: '32px',
              paddingY: '14px',
              fontSize: '16px',
              fontWeight: '500',
              border: 'none',
              fontFamily: 'var(--font-inter), system-ui, sans-serif',
              mobile: { fontSize: '14px', paddingX: '22px', paddingY: '12px' },
              ...grid(
                { col: 11, row: 14, colSpan: 4, rowSpan: 3 },
                { col: 2, row: 14, colSpan: 6, rowSpan: 3 },
              ),
            },
          },
        ],
      },
      // --- Footer ---
      {
        id: uid(),
        type: 'footer',
        props: {
          backgroundColor: '#0A0A0A',
          padding: '64px 40px 40px',
          rowHeight: 24,
          mobile: { padding: '40px 20px 28px' },
        },
        children: [
          {
            id: uid(),
            type: 'text',
            props: {
              content: '◧  Gradient Labs',
              variant: 'p',
              color: '#ffffff',
              fontSize: '20px',
              fontWeight: '600',
              fontFamily: 'var(--font-inter), system-ui, sans-serif',
              textAlign: 'left',
              ...grid(
                { col: 1, row: 1, colSpan: 8, rowSpan: 2 },
                { col: 1, row: 1, colSpan: 8, rowSpan: 2 },
              ),
            },
          },
          {
            id: uid(),
            type: 'text',
            props: {
              content: 'Product',
              variant: 'p',
              color: '#71717a',
              fontSize: '12px',
              fontWeight: '600',
              fontFamily: 'var(--font-inter), system-ui, sans-serif',
              letterSpacing: '0.08em',
              textAlign: 'left',
              ...grid(
                { col: 13, row: 1, colSpan: 4, rowSpan: 2 },
                { col: 1, row: 4, colSpan: 4, rowSpan: 2 },
              ),
            },
          },
          {
            id: uid(),
            type: 'text',
            props: {
              content: 'Features\nUse cases\nPricing\nSecurity',
              variant: 'p',
              color: '#a1a1aa',
              fontSize: '14px',
              fontWeight: '400',
              fontFamily: 'var(--font-inter), system-ui, sans-serif',
              lineHeight: '1.9',
              textAlign: 'left',
              ...grid(
                { col: 13, row: 3, colSpan: 4, rowSpan: 7 },
                { col: 1, row: 6, colSpan: 4, rowSpan: 7 },
              ),
            },
          },
          {
            id: uid(),
            type: 'text',
            props: {
              content: 'Company',
              variant: 'p',
              color: '#71717a',
              fontSize: '12px',
              fontWeight: '600',
              fontFamily: 'var(--font-inter), system-ui, sans-serif',
              letterSpacing: '0.08em',
              textAlign: 'left',
              ...grid(
                { col: 17, row: 1, colSpan: 4, rowSpan: 2 },
                { col: 5, row: 4, colSpan: 4, rowSpan: 2 },
              ),
            },
          },
          {
            id: uid(),
            type: 'text',
            props: {
              content: 'About\nCareers\nBlog\nContact',
              variant: 'p',
              color: '#a1a1aa',
              fontSize: '14px',
              fontWeight: '400',
              fontFamily: 'var(--font-inter), system-ui, sans-serif',
              lineHeight: '1.9',
              textAlign: 'left',
              ...grid(
                { col: 17, row: 3, colSpan: 4, rowSpan: 7 },
                { col: 5, row: 6, colSpan: 4, rowSpan: 7 },
              ),
            },
          },
          {
            id: uid(),
            type: 'text',
            props: {
              content: 'Legal',
              variant: 'p',
              color: '#71717a',
              fontSize: '12px',
              fontWeight: '600',
              fontFamily: 'var(--font-inter), system-ui, sans-serif',
              letterSpacing: '0.08em',
              textAlign: 'left',
              ...grid(
                { col: 21, row: 1, colSpan: 4, rowSpan: 2 },
                { col: 1, row: 14, colSpan: 4, rowSpan: 2 },
              ),
            },
          },
          {
            id: uid(),
            type: 'text',
            props: {
              content: 'Privacy\nTerms\nSecurity\nDPA',
              variant: 'p',
              color: '#a1a1aa',
              fontSize: '14px',
              fontWeight: '400',
              fontFamily: 'var(--font-inter), system-ui, sans-serif',
              lineHeight: '1.9',
              textAlign: 'left',
              ...grid(
                { col: 21, row: 3, colSpan: 4, rowSpan: 7 },
                { col: 1, row: 16, colSpan: 4, rowSpan: 7 },
              ),
            },
          },
          {
            id: uid(),
            type: 'text',
            props: {
              content: '© 2026 Gradient Labs. All rights reserved.',
              variant: 'p',
              color: '#52525b',
              fontSize: '13px',
              fontWeight: '400',
              fontFamily: 'var(--font-inter), system-ui, sans-serif',
              textAlign: 'left',
              ...grid(
                { col: 1, row: 13, colSpan: 12, rowSpan: 2 },
                { col: 1, row: 24, colSpan: 8, rowSpan: 2 },
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
