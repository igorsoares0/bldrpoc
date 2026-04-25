'use client'

import { useState, useRef, useEffect } from 'react'
import {
  Plus,
  LayoutTemplate,
  Type,
  ImageIcon,
  RectangleHorizontal,
  PanelTop,
  PanelBottom,
  Sparkles,
  Columns2,
  LayoutGrid,
  Mail,
  Tag,
  Megaphone,
  Building2,
  Quote,
  HelpCircle,
  BarChart3,
  ListOrdered,
} from 'lucide-react'
import { useEditorStore } from '@/lib/store'
import type { GridPlacement, Node, NodeType } from '@/lib/types'

type ElementDef = {
  type: NodeType
  label: string
  icon: React.FC<{ className?: string }>
  category: 'element' | 'section'
  createNode: () => Node
}

function uid() {
  return crypto.randomUUID()
}

function tripleRows(p: GridPlacement): GridPlacement {
  return {
    col: p.col,
    colSpan: p.colSpan,
    row: (p.row - 1) * 3 + 1,
    rowSpan: p.rowSpan * 3,
  }
}

function gridFine(
  desktop: GridPlacement,
  mobile: GridPlacement,
): { grid: { desktop: GridPlacement; mobile: GridPlacement } } {
  return { grid: { desktop: tripleRows(desktop), mobile: tripleRows(mobile) } }
}

const elements: ElementDef[] = [
  // --- Basic elements ---
  {
    type: 'section',
    label: 'Section',
    icon: LayoutTemplate,
    category: 'element',
    createNode: () => ({
      id: uid(),
      type: 'section',
      props: {
        padding: '24px',
        backgroundColor: '#f4f4f5',
        minHeight: '160px',
      },
      children: [],
    }),
  },
  {
    type: 'text',
    label: 'Text',
    icon: Type,
    category: 'element',
    createNode: () => ({
      id: uid(),
      type: 'text',
      props: {
        content: 'New text block',
        variant: 'p',
        color: '#09090b',
        fontSize: '16px',
        fontWeight: '400',
        textAlign: 'left',
      },
    }),
  },
  {
    type: 'image',
    label: 'Image',
    icon: ImageIcon,
    category: 'element',
    createNode: () => ({
      id: uid(),
      type: 'image',
      props: {
        src: 'https://placehold.co/600x400/e2e8f0/94a3b8?text=Image',
        alt: 'Image',
        width: '100%',
        height: 'auto',
        borderRadius: '8px',
      },
    }),
  },
  {
    type: 'button',
    label: 'Button',
    icon: RectangleHorizontal,
    category: 'element',
    createNode: () => ({
      id: uid(),
      type: 'button',
      props: {
        label: 'Click me',
        backgroundColor: '#3b82f6',
        color: '#ffffff',
        borderRadius: '8px',
        paddingX: '24px',
        paddingY: '12px',
        fontSize: '16px',
        fontWeight: '600',
      },
    }),
  },
  {
    type: 'form',
    label: 'Email Form',
    icon: Mail,
    category: 'element',
    createNode: () => ({
      id: uid(),
      type: 'form',
      props: {
        placeholder: 'your@email.com',
        buttonLabel: 'Subscribe',
        successMessage: 'Thanks! Check your inbox.',
        backgroundColor: '#ffffff',
        borderColor: '#e4e4e7',
        inputColor: '#09090b',
        buttonBackgroundColor: '#3b82f6',
        buttonColor: '#ffffff',
        borderRadius: '8px',
        paddingX: '14px',
        paddingY: '10px',
        gap: '8px',
        fontSize: '14px',
      },
    }),
  },
  // --- Pre-built sections ---
  {
    type: 'menu-bar',
    label: 'Menu Bar',
    icon: PanelTop,
    category: 'section',
    createNode: () => ({
      id: uid(),
      type: 'menu-bar',
      props: { backgroundColor: '#09090b', padding: '16px 32px' },
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
            ...gridFine(
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
            ...gridFine(
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
            ...gridFine(
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
            ...gridFine(
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
            ...gridFine(
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
            ...gridFine(
              { col: 22, row: 1, colSpan: 3, rowSpan: 2 },
              { col: 1, row: 5, colSpan: 8, rowSpan: 2 },
            ),
          },
        },
      ],
    }),
  },
  {
    type: 'section',
    label: 'Hero',
    icon: Sparkles,
    category: 'section',
    createNode: () => ({
      id: uid(),
      type: 'section',
      props: {
        padding: '80px 24px',
        backgroundColor: '#ffffff',
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
            ...gridFine(
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
            ...gridFine(
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
            ...gridFine(
              { col: 11, row: 13, colSpan: 4, rowSpan: 3 },
              { col: 2, row: 13, colSpan: 6, rowSpan: 3 },
            ),
          },
        },
      ],
    }),
  },
  {
    type: 'section',
    label: 'Hero with Image',
    icon: Columns2,
    category: 'section',
    createNode: () => ({
      id: uid(),
      type: 'section',
      props: {
        padding: '64px 48px',
        backgroundColor: '#ffffff',
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
            fontSize: '44px',
            fontWeight: '700',
            textAlign: 'left',
            ...gridFine(
              { col: 1, row: 3, colSpan: 11, rowSpan: 4 },
              { col: 1, row: 11, colSpan: 8, rowSpan: 4 },
            ),
          },
        },
        {
          id: uid(),
          type: 'text',
          props: {
            content:
              'Create beautiful landing pages in minutes. No coding required. Just drag, drop, and publish.',
            variant: 'p',
            color: '#71717a',
            fontSize: '18px',
            fontWeight: '400',
            textAlign: 'left',
            lineHeight: '1.7',
            ...gridFine(
              { col: 1, row: 8, colSpan: 11, rowSpan: 4 },
              { col: 1, row: 16, colSpan: 8, rowSpan: 4 },
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
            ...gridFine(
              { col: 1, row: 13, colSpan: 5, rowSpan: 3 },
              { col: 1, row: 21, colSpan: 6, rowSpan: 3 },
            ),
          },
        },
        {
          id: uid(),
          type: 'image',
          props: {
            src: 'https://placehold.co/560x400/e2e8f0/94a3b8?text=Hero+Image',
            alt: 'Hero image',
            width: '100%',
            height: '100%',
            borderRadius: '12px',
            objectFit: 'cover',
            ...gridFine(
              { col: 13, row: 1, colSpan: 12, rowSpan: 16 },
              { col: 1, row: 1, colSpan: 8, rowSpan: 9 },
            ),
          },
        },
      ],
    }),
  },
  {
    type: 'section',
    label: 'Features',
    icon: LayoutGrid,
    category: 'section',
    createNode: () => ({
      id: uid(),
      type: 'section',
      props: {
        padding: '80px 32px',
        backgroundColor: '#fafafa',
        minHeight: '600px',
      },
      children: [
        {
          id: uid(),
          type: 'text',
          props: {
            content: 'Powerful Features',
            variant: 'h2',
            color: '#09090b',
            fontSize: '36px',
            fontWeight: '700',
            textAlign: 'center',
            ...gridFine(
              { col: 4, row: 3, colSpan: 18, rowSpan: 3 },
              { col: 1, row: 1, colSpan: 8, rowSpan: 4 },
            ),
          },
        },
        {
          id: uid(),
          type: 'text',
          props: {
            content: 'Everything you need to build something amazing',
            variant: 'p',
            color: '#71717a',
            fontSize: '16px',
            fontWeight: '400',
            textAlign: 'center',
            ...gridFine(
              { col: 6, row: 7, colSpan: 14, rowSpan: 2 },
              { col: 1, row: 6, colSpan: 8, rowSpan: 3 },
            ),
          },
        },
        {
          id: uid(),
          type: 'image',
          props: {
            src: 'https://placehold.co/120x120/3b82f6/3b82f6',
            alt: 'Feature 1 icon',
            width: '64px',
            height: '64px',
            borderRadius: '14px',
            objectFit: 'cover',
            ...gridFine(
              { col: 4, row: 13, colSpan: 2, rowSpan: 3 },
              { col: 4, row: 11, colSpan: 2, rowSpan: 3 },
            ),
          },
        },
        {
          id: uid(),
          type: 'text',
          props: {
            content: 'Lightning Fast',
            variant: 'h3',
            color: '#09090b',
            fontSize: '20px',
            fontWeight: '600',
            textAlign: 'center',
            ...gridFine(
              { col: 1, row: 17, colSpan: 8, rowSpan: 2 },
              { col: 1, row: 15, colSpan: 8, rowSpan: 2 },
            ),
          },
        },
        {
          id: uid(),
          type: 'text',
          props: {
            content: 'Built for speed with optimized performance and instant loading.',
            variant: 'p',
            color: '#71717a',
            fontSize: '14px',
            fontWeight: '400',
            textAlign: 'center',
            lineHeight: '1.6',
            ...gridFine(
              { col: 1, row: 19, colSpan: 8, rowSpan: 4 },
              { col: 1, row: 17, colSpan: 8, rowSpan: 4 },
            ),
          },
        },
        {
          id: uid(),
          type: 'image',
          props: {
            src: 'https://placehold.co/120x120/8b5cf6/8b5cf6',
            alt: 'Feature 2 icon',
            width: '64px',
            height: '64px',
            borderRadius: '14px',
            objectFit: 'cover',
            ...gridFine(
              { col: 12, row: 13, colSpan: 2, rowSpan: 3 },
              { col: 4, row: 24, colSpan: 2, rowSpan: 3 },
            ),
          },
        },
        {
          id: uid(),
          type: 'text',
          props: {
            content: 'Beautiful Design',
            variant: 'h3',
            color: '#09090b',
            fontSize: '20px',
            fontWeight: '600',
            textAlign: 'center',
            ...gridFine(
              { col: 9, row: 17, colSpan: 8, rowSpan: 2 },
              { col: 1, row: 28, colSpan: 8, rowSpan: 2 },
            ),
          },
        },
        {
          id: uid(),
          type: 'text',
          props: {
            content: 'Pixel-perfect designs that look stunning on every device.',
            variant: 'p',
            color: '#71717a',
            fontSize: '14px',
            fontWeight: '400',
            textAlign: 'center',
            lineHeight: '1.6',
            ...gridFine(
              { col: 9, row: 19, colSpan: 8, rowSpan: 4 },
              { col: 1, row: 30, colSpan: 8, rowSpan: 4 },
            ),
          },
        },
        {
          id: uid(),
          type: 'image',
          props: {
            src: 'https://placehold.co/120x120/10b981/10b981',
            alt: 'Feature 3 icon',
            width: '64px',
            height: '64px',
            borderRadius: '14px',
            objectFit: 'cover',
            ...gridFine(
              { col: 20, row: 13, colSpan: 2, rowSpan: 3 },
              { col: 4, row: 37, colSpan: 2, rowSpan: 3 },
            ),
          },
        },
        {
          id: uid(),
          type: 'text',
          props: {
            content: 'Rock Solid',
            variant: 'h3',
            color: '#09090b',
            fontSize: '20px',
            fontWeight: '600',
            textAlign: 'center',
            ...gridFine(
              { col: 17, row: 17, colSpan: 8, rowSpan: 2 },
              { col: 1, row: 41, colSpan: 8, rowSpan: 2 },
            ),
          },
        },
        {
          id: uid(),
          type: 'text',
          props: {
            content: 'Battle-tested infrastructure with 99.9% uptime guarantee.',
            variant: 'p',
            color: '#71717a',
            fontSize: '14px',
            fontWeight: '400',
            textAlign: 'center',
            lineHeight: '1.6',
            ...gridFine(
              { col: 17, row: 19, colSpan: 8, rowSpan: 4 },
              { col: 1, row: 43, colSpan: 8, rowSpan: 4 },
            ),
          },
        },
      ],
    }),
  },
  {
    type: 'section',
    label: 'Pricing',
    icon: Tag,
    category: 'section',
    createNode: () => {
      const featureRow = (text: string, rowDesktop: number, rowMobile: number): Node => ({
        id: uid(),
        type: 'text',
        props: {
          content: `✓   ${text}`,
          variant: 'p',
          color: '#3f3f46',
          fontSize: '14px',
          fontWeight: '500',
          textAlign: 'left',
          ...gridFine(
            { col: 3, row: rowDesktop, colSpan: 20, rowSpan: 2 },
            { col: 1, row: rowMobile, colSpan: 8, rowSpan: 2 },
          ),
        },
      })

      const pricingCard = (
        planName: string,
        price: string,
        features: [string, string, string],
        ctaLabel: string,
        highlighted: boolean,
        cardDesktop: GridPlacement,
        cardMobile: GridPlacement,
      ): Node => {
        const badge: Node[] = highlighted
          ? [
              {
                id: uid(),
                type: 'text',
                props: {
                  content: 'MOST POPULAR',
                  variant: 'p',
                  color: '#3b82f6',
                  fontSize: '11px',
                  fontWeight: '700',
                  textAlign: 'center',
                  ...gridFine(
                    { col: 1, row: 1, colSpan: 24, rowSpan: 1 },
                    { col: 1, row: 1, colSpan: 8, rowSpan: 1 },
                  ),
                },
              },
            ]
          : []

        return {
          id: uid(),
          type: 'section',
          props: {
            padding: '32px 24px',
            backgroundColor: '#ffffff',
            borderRadius: '14px',
            border: highlighted ? '2px solid #3b82f6' : '1px solid #e4e4e7',
            boxShadow: highlighted
              ? '0 18px 40px -12px rgba(59,130,246,0.4)'
              : '0 1px 2px rgba(0,0,0,0.04)',
            ...gridFine(cardDesktop, cardMobile),
          },
          children: [
            ...badge,
            {
              id: uid(),
              type: 'text',
              props: {
                content: planName,
                variant: 'h3',
                color: '#09090b',
                fontSize: '20px',
                fontWeight: '700',
                textAlign: 'center',
                ...gridFine(
                  { col: 1, row: 2, colSpan: 24, rowSpan: 2 },
                  { col: 1, row: 2, colSpan: 8, rowSpan: 2 },
                ),
              },
            },
            {
              id: uid(),
              type: 'text',
              props: {
                content: price,
                variant: 'h2',
                color: '#09090b',
                fontSize: '44px',
                fontWeight: '800',
                textAlign: 'center',
                ...gridFine(
                  { col: 1, row: 4, colSpan: 24, rowSpan: 3 },
                  { col: 1, row: 4, colSpan: 8, rowSpan: 3 },
                ),
              },
            },
            featureRow(features[0], 9, 9),
            featureRow(features[1], 11, 11),
            featureRow(features[2], 13, 13),
            {
              id: uid(),
              type: 'button',
              props: {
                label: ctaLabel,
                backgroundColor: highlighted ? '#3b82f6' : '#ffffff',
                color: highlighted ? '#ffffff' : '#09090b',
                border: highlighted ? 'none' : '1px solid #d4d4d8',
                borderRadius: '8px',
                paddingX: '20px',
                paddingY: '11px',
                fontSize: '14px',
                fontWeight: '600',
                ...gridFine(
                  { col: 4, row: 16, colSpan: 18, rowSpan: 2 },
                  { col: 2, row: 16, colSpan: 6, rowSpan: 2 },
                ),
              },
            },
          ],
        }
      }

      return {
        id: uid(),
        type: 'section',
        props: {
          padding: '80px 32px',
          backgroundColor: '#fafafa',
          minHeight: '760px',
        },
        children: [
          {
            id: uid(),
            type: 'text',
            props: {
              content: 'Simple, transparent pricing',
              variant: 'h2',
              color: '#09090b',
              fontSize: '36px',
              fontWeight: '700',
              textAlign: 'center',
              ...gridFine(
                { col: 4, row: 2, colSpan: 18, rowSpan: 3 },
                { col: 1, row: 1, colSpan: 8, rowSpan: 4 },
              ),
            },
          },
          {
            id: uid(),
            type: 'text',
            props: {
              content: 'Choose the plan that fits your team. Cancel anytime.',
              variant: 'p',
              color: '#71717a',
              fontSize: '16px',
              fontWeight: '400',
              textAlign: 'center',
              ...gridFine(
                { col: 6, row: 6, colSpan: 14, rowSpan: 2 },
                { col: 1, row: 6, colSpan: 8, rowSpan: 3 },
              ),
            },
          },
          pricingCard(
            'Basic',
            '$9/mo',
            ['Up to 3 projects', 'Community support', 'Basic analytics'],
            'Get started',
            false,
            { col: 2, row: 10, colSpan: 7, rowSpan: 18 },
            { col: 1, row: 10, colSpan: 8, rowSpan: 18 },
          ),
          pricingCard(
            'Pro',
            '$29/mo',
            ['Unlimited projects', 'Priority support', 'Advanced analytics'],
            'Start free trial',
            true,
            { col: 10, row: 10, colSpan: 7, rowSpan: 18 },
            { col: 1, row: 30, colSpan: 8, rowSpan: 18 },
          ),
          pricingCard(
            'Business',
            '$99/mo',
            ['Everything in Pro', 'Dedicated manager', 'SLA & SSO'],
            'Contact sales',
            false,
            { col: 18, row: 10, colSpan: 7, rowSpan: 18 },
            { col: 1, row: 50, colSpan: 8, rowSpan: 18 },
          ),
        ],
      }
    },
  },
  {
    type: 'section',
    label: 'Call to Action',
    icon: Megaphone,
    category: 'section',
    createNode: () => ({
      id: uid(),
      type: 'section',
      props: {
        padding: '80px 32px',
        backgroundColor: '#09090b',
        minHeight: '420px',
      },
      children: [
        {
          id: uid(),
          type: 'text',
          props: {
            content: 'Ready to ship faster?',
            variant: 'h2',
            color: '#ffffff',
            fontSize: '40px',
            fontWeight: '700',
            textAlign: 'center',
            ...gridFine(
              { col: 4, row: 3, colSpan: 18, rowSpan: 3 },
              { col: 1, row: 2, colSpan: 8, rowSpan: 4 },
            ),
          },
        },
        {
          id: uid(),
          type: 'text',
          props: {
            content:
              'Join thousands of teams shipping with confidence — no credit card required.',
            variant: 'p',
            color: '#a1a1aa',
            fontSize: '17px',
            fontWeight: '400',
            textAlign: 'center',
            lineHeight: '1.55',
            ...gridFine(
              { col: 6, row: 7, colSpan: 14, rowSpan: 3 },
              { col: 1, row: 7, colSpan: 8, rowSpan: 4 },
            ),
          },
        },
        {
          id: uid(),
          type: 'button',
          props: {
            label: 'Start free trial',
            backgroundColor: '#3b82f6',
            color: '#ffffff',
            borderRadius: '8px',
            paddingX: '28px',
            paddingY: '13px',
            fontSize: '15px',
            fontWeight: '600',
            ...gridFine(
              { col: 9, row: 12, colSpan: 4, rowSpan: 3 },
              { col: 2, row: 13, colSpan: 6, rowSpan: 3 },
            ),
          },
        },
        {
          id: uid(),
          type: 'button',
          props: {
            label: 'Talk to sales',
            backgroundColor: 'transparent',
            color: '#ffffff',
            border: '1px solid #3f3f46',
            borderRadius: '8px',
            paddingX: '28px',
            paddingY: '13px',
            fontSize: '15px',
            fontWeight: '600',
            ...gridFine(
              { col: 13, row: 12, colSpan: 4, rowSpan: 3 },
              { col: 2, row: 17, colSpan: 6, rowSpan: 3 },
            ),
          },
        },
      ],
    }),
  },
  {
    type: 'section',
    label: 'Logo Cloud',
    icon: Building2,
    category: 'section',
    createNode: () => {
      const logoLabels = ['ACME', 'Globex', 'Initech', 'Umbrella', 'Hooli']
      const logos: Node[] = logoLabels.map((label, i) => ({
        id: uid(),
        type: 'image',
        props: {
          src: `https://placehold.co/140x44/e4e4e7/71717a?text=${label}`,
          alt: `${label} logo`,
          width: '100%',
          height: '32px',
          objectFit: 'contain',
          ...gridFine(
            { col: 3 + i * 4, row: 6, colSpan: 4, rowSpan: 2 },
            {
              col: i % 2 === 0 ? 1 : 5,
              row: 5 + Math.floor(i / 2) * 3,
              colSpan: 4,
              rowSpan: 2,
            },
          ),
        },
      }))
      return {
        id: uid(),
        type: 'section',
        props: {
          padding: '64px 32px',
          backgroundColor: '#fafafa',
          minHeight: '260px',
        },
        children: [
          {
            id: uid(),
            type: 'text',
            props: {
              content: 'Trusted by teams at',
              variant: 'p',
              color: '#71717a',
              fontSize: '14px',
              fontWeight: '500',
              textAlign: 'center',
              ...gridFine(
                { col: 7, row: 2, colSpan: 12, rowSpan: 2 },
                { col: 1, row: 1, colSpan: 8, rowSpan: 2 },
              ),
            },
          },
          ...logos,
        ],
      }
    },
  },
  {
    type: 'section',
    label: 'Testimonials',
    icon: Quote,
    category: 'section',
    createNode: () => {
      const card = (
        quote: string,
        name: string,
        role: string,
        avatarColor: string,
        cardDesktop: GridPlacement,
        cardMobile: GridPlacement,
      ): Node => ({
        id: uid(),
        type: 'section',
        props: {
          padding: '28px 24px',
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          border: '1px solid #e4e4e7',
          boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
          ...gridFine(cardDesktop, cardMobile),
        },
        children: [
          {
            id: uid(),
            type: 'text',
            props: {
              content: `"${quote}"`,
              variant: 'p',
              color: '#3f3f46',
              fontSize: '15px',
              fontWeight: '400',
              textAlign: 'left',
              lineHeight: '1.6',
              ...gridFine(
                { col: 1, row: 1, colSpan: 24, rowSpan: 6 },
                { col: 1, row: 1, colSpan: 8, rowSpan: 6 },
              ),
            },
          },
          {
            id: uid(),
            type: 'image',
            props: {
              src: `https://placehold.co/80x80/${avatarColor}/${avatarColor}`,
              alt: `${name} avatar`,
              width: '40px',
              height: '40px',
              borderRadius: '999px',
              objectFit: 'cover',
              ...gridFine(
                { col: 1, row: 8, colSpan: 3, rowSpan: 2 },
                { col: 1, row: 8, colSpan: 2, rowSpan: 2 },
              ),
            },
          },
          {
            id: uid(),
            type: 'text',
            props: {
              content: name,
              variant: 'p',
              color: '#09090b',
              fontSize: '14px',
              fontWeight: '600',
              textAlign: 'left',
              ...gridFine(
                { col: 4, row: 8, colSpan: 21, rowSpan: 1 },
                { col: 3, row: 8, colSpan: 6, rowSpan: 1 },
              ),
            },
          },
          {
            id: uid(),
            type: 'text',
            props: {
              content: role,
              variant: 'p',
              color: '#71717a',
              fontSize: '13px',
              fontWeight: '400',
              textAlign: 'left',
              ...gridFine(
                { col: 4, row: 9, colSpan: 21, rowSpan: 1 },
                { col: 3, row: 9, colSpan: 6, rowSpan: 1 },
              ),
            },
          },
        ],
      })
      return {
        id: uid(),
        type: 'section',
        props: {
          padding: '80px 32px',
          backgroundColor: '#ffffff',
          minHeight: '600px',
        },
        children: [
          {
            id: uid(),
            type: 'text',
            props: {
              content: 'Loved by teams everywhere',
              variant: 'h2',
              color: '#09090b',
              fontSize: '36px',
              fontWeight: '700',
              textAlign: 'center',
              ...gridFine(
                { col: 4, row: 2, colSpan: 18, rowSpan: 3 },
                { col: 1, row: 1, colSpan: 8, rowSpan: 4 },
              ),
            },
          },
          card(
            'This builder saved us weeks of dev time. We shipped our landing page in an afternoon.',
            'Sarah Chen',
            'PM at Acme',
            '3b82f6',
            { col: 2, row: 8, colSpan: 7, rowSpan: 11 },
            { col: 1, row: 6, colSpan: 8, rowSpan: 11 },
          ),
          card(
            'The grid layout is intuitive and the per-breakpoint controls are exactly what I needed.',
            'Marcus Rivera',
            'Designer at Globex',
            '8b5cf6',
            { col: 10, row: 8, colSpan: 7, rowSpan: 11 },
            { col: 1, row: 18, colSpan: 8, rowSpan: 11 },
          ),
          card(
            'Our marketing team can now ship pages without bothering engineering. Game changer.',
            'Priya Patel',
            'Founder at Initech',
            '10b981',
            { col: 18, row: 8, colSpan: 7, rowSpan: 11 },
            { col: 1, row: 30, colSpan: 8, rowSpan: 11 },
          ),
        ],
      }
    },
  },
  {
    type: 'section',
    label: 'FAQ',
    icon: HelpCircle,
    category: 'section',
    createNode: () => {
      const qa = (
        question: string,
        answer: string,
        qRowDesktop: number,
        qRowMobile: number,
      ): Node[] => [
        {
          id: uid(),
          type: 'text',
          props: {
            content: question,
            variant: 'h3',
            color: '#09090b',
            fontSize: '17px',
            fontWeight: '600',
            textAlign: 'left',
            ...gridFine(
              { col: 6, row: qRowDesktop, colSpan: 14, rowSpan: 2 },
              { col: 1, row: qRowMobile, colSpan: 8, rowSpan: 2 },
            ),
          },
        },
        {
          id: uid(),
          type: 'text',
          props: {
            content: answer,
            variant: 'p',
            color: '#71717a',
            fontSize: '15px',
            fontWeight: '400',
            textAlign: 'left',
            lineHeight: '1.6',
            ...gridFine(
              { col: 6, row: qRowDesktop + 2, colSpan: 14, rowSpan: 3 },
              { col: 1, row: qRowMobile + 2, colSpan: 8, rowSpan: 4 },
            ),
          },
        },
      ]
      return {
        id: uid(),
        type: 'section',
        props: {
          padding: '80px 32px',
          backgroundColor: '#ffffff',
          minHeight: '720px',
        },
        children: [
          {
            id: uid(),
            type: 'text',
            props: {
              content: 'Frequently asked questions',
              variant: 'h2',
              color: '#09090b',
              fontSize: '36px',
              fontWeight: '700',
              textAlign: 'center',
              ...gridFine(
                { col: 4, row: 2, colSpan: 18, rowSpan: 3 },
                { col: 1, row: 1, colSpan: 8, rowSpan: 4 },
              ),
            },
          },
          ...qa(
            'How does pricing work?',
            'Pricing scales with usage. Start free with our generous free tier and upgrade as you grow. Cancel anytime.',
            7,
            6,
          ),
          ...qa(
            'Can I customize my page?',
            'Yes — every element is fully editable. Adjust typography, colors, layout, and per-breakpoint overrides for desktop and mobile.',
            13,
            13,
          ),
          ...qa(
            'Do you support custom domains?',
            'Custom domains are available on the Pro plan and above. We handle SSL automatically.',
            19,
            22,
          ),
          ...qa(
            'Is there a free trial?',
            'Every paid plan starts with a 14-day free trial. No credit card required to start.',
            25,
            30,
          ),
        ],
      }
    },
  },
  {
    type: 'section',
    label: 'Stats',
    icon: BarChart3,
    category: 'section',
    createNode: () => {
      const stat = (
        number: string,
        label: string,
        col: number,
        colSpan: number,
        mobileRow: number,
      ): Node[] => [
        {
          id: uid(),
          type: 'text',
          props: {
            content: number,
            variant: 'h2',
            color: '#09090b',
            fontSize: '48px',
            fontWeight: '800',
            textAlign: 'center',
            ...gridFine(
              { col, row: 5, colSpan, rowSpan: 3 },
              { col: 1, row: mobileRow, colSpan: 8, rowSpan: 3 },
            ),
          },
        },
        {
          id: uid(),
          type: 'text',
          props: {
            content: label,
            variant: 'p',
            color: '#71717a',
            fontSize: '14px',
            fontWeight: '500',
            textAlign: 'center',
            ...gridFine(
              { col, row: 9, colSpan, rowSpan: 2 },
              { col: 1, row: mobileRow + 3, colSpan: 8, rowSpan: 2 },
            ),
          },
        },
      ]
      return {
        id: uid(),
        type: 'section',
        props: {
          padding: '80px 32px',
          backgroundColor: '#fafafa',
          minHeight: '380px',
        },
        children: [
          {
            id: uid(),
            type: 'text',
            props: {
              content: 'By the numbers',
              variant: 'h2',
              color: '#09090b',
              fontSize: '32px',
              fontWeight: '700',
              textAlign: 'center',
              ...gridFine(
                { col: 4, row: 1, colSpan: 18, rowSpan: 3 },
                { col: 1, row: 1, colSpan: 8, rowSpan: 3 },
              ),
            },
          },
          ...stat('10M+', 'Pages shipped', 1, 6, 5),
          ...stat('50k', 'Happy teams', 7, 6, 11),
          ...stat('99.9%', 'Uptime SLA', 13, 6, 17),
          ...stat('120+', 'Countries served', 19, 6, 23),
        ],
      }
    },
  },
  {
    type: 'section',
    label: 'How it works',
    icon: ListOrdered,
    category: 'section',
    createNode: () => {
      const step = (
        index: string,
        title: string,
        description: string,
        col: number,
        mobileRowStart: number,
      ): Node[] => [
        {
          id: uid(),
          type: 'text',
          props: {
            content: index,
            variant: 'p',
            color: '#3b82f6',
            fontSize: '32px',
            fontWeight: '800',
            textAlign: 'left',
            letterSpacing: '-0.02em',
            ...gridFine(
              { col, row: 11, colSpan: 7, rowSpan: 3 },
              { col: 1, row: mobileRowStart, colSpan: 8, rowSpan: 3 },
            ),
          },
        },
        {
          id: uid(),
          type: 'text',
          props: {
            content: title,
            variant: 'h3',
            color: '#09090b',
            fontSize: '20px',
            fontWeight: '700',
            textAlign: 'left',
            ...gridFine(
              { col, row: 14, colSpan: 7, rowSpan: 2 },
              { col: 1, row: mobileRowStart + 3, colSpan: 8, rowSpan: 2 },
            ),
          },
        },
        {
          id: uid(),
          type: 'text',
          props: {
            content: description,
            variant: 'p',
            color: '#71717a',
            fontSize: '15px',
            fontWeight: '400',
            textAlign: 'left',
            lineHeight: '1.6',
            ...gridFine(
              { col, row: 16, colSpan: 7, rowSpan: 4 },
              { col: 1, row: mobileRowStart + 5, colSpan: 8, rowSpan: 4 },
            ),
          },
        },
      ]
      return {
        id: uid(),
        type: 'section',
        props: {
          padding: '80px 32px',
          backgroundColor: '#ffffff',
          minHeight: '560px',
        },
        children: [
          {
            id: uid(),
            type: 'text',
            props: {
              content: 'How it works',
              variant: 'h2',
              color: '#09090b',
              fontSize: '36px',
              fontWeight: '700',
              textAlign: 'center',
              ...gridFine(
                { col: 4, row: 2, colSpan: 18, rowSpan: 3 },
                { col: 1, row: 1, colSpan: 8, rowSpan: 4 },
              ),
            },
          },
          {
            id: uid(),
            type: 'text',
            props: {
              content: 'Get from idea to live page in three simple steps.',
              variant: 'p',
              color: '#71717a',
              fontSize: '16px',
              fontWeight: '400',
              textAlign: 'center',
              ...gridFine(
                { col: 6, row: 6, colSpan: 14, rowSpan: 2 },
                { col: 1, row: 6, colSpan: 8, rowSpan: 3 },
              ),
            },
          },
          ...step(
            '01',
            'Pick a template',
            'Choose from production-ready sections — hero, features, pricing, and more — built for desktop and mobile.',
            1,
            10,
          ),
          ...step(
            '02',
            'Make it yours',
            'Drag, resize, and edit any element. Override styles per breakpoint without touching desktop.',
            9,
            20,
          ),
          ...step(
            '03',
            'Publish in one click',
            'Hit publish and your page goes live with a clean URL — no DevOps, no deploy pipeline.',
            17,
            30,
          ),
        ],
      }
    },
  },
  {
    type: 'footer',
    label: 'Footer',
    icon: PanelBottom,
    category: 'section',
    createNode: () => ({
      id: uid(),
      type: 'footer',
      props: { backgroundColor: '#09090b', padding: '40px 24px' },
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
            ...gridFine(
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
            ...gridFine(
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
            ...gridFine(
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
            ...gridFine(
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
            ...gridFine(
              { col: 8, row: 7, colSpan: 10, rowSpan: 2 },
              { col: 1, row: 9, colSpan: 8, rowSpan: 2 },
            ),
          },
        },
      ],
    }),
  },
]

const containerTypes: NodeType[] = ['section', 'menu-bar', 'footer']
const topLevelTypes: NodeType[] = ['section', 'menu-bar', 'footer']

export function ElementPicker() {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const addNode = useEditorStore((s) => s.addNode)
  const selectedId = useEditorStore((s) => s.selectedId)
  const tree = useEditorStore((s) => s.tree)

  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as HTMLElement)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  function handleAdd(element: ElementDef) {
    const newNode = element.createNode()

    let parentId = tree.id
    if (!topLevelTypes.includes(newNode.type) && selectedId) {
      const findNode = (node: Node): Node | null => {
        if (node.id === selectedId) return node
        if (node.children) {
          for (const child of node.children) {
            const found = findNode(child)
            if (found) return found
          }
        }
        return null
      }
      const selected = findNode(tree)
      if (selected && containerTypes.includes(selected.type)) {
        parentId = selected.id
      }
    }

    addNode(parentId, newNode)
    setOpen(false)
  }

  const basicElements = elements.filter((e) => e.category === 'element')
  const sectionTemplates = elements.filter((e) => e.category === 'section')

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="inline-flex items-center gap-1.5 rounded-lg bg-accent px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-accent-hover cursor-pointer"
      >
        <Plus className="h-3.5 w-3.5" />
        Add Element
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-2 w-52 rounded-xl border border-surface-3 bg-surface-1 p-1.5 shadow-xl shadow-black/30 z-50">
          <p className="px-3 pt-1.5 pb-1 text-[10px] font-semibold uppercase tracking-wider text-text-muted">
            Elements
          </p>
          {basicElements.map((el) => (
            <button
              key={el.label}
              onClick={() => handleAdd(el)}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-text-secondary transition-colors hover:bg-surface-2 hover:text-text-primary cursor-pointer"
            >
              <el.icon className="h-4 w-4 text-text-muted" />
              {el.label}
            </button>
          ))}
          <div className="my-1.5 border-t border-surface-3" />
          <p className="px-3 pt-1.5 pb-1 text-[10px] font-semibold uppercase tracking-wider text-text-muted">
            Sections
          </p>
          {sectionTemplates.map((el) => (
            <button
              key={el.label}
              onClick={() => handleAdd(el)}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-text-secondary transition-colors hover:bg-surface-2 hover:text-text-primary cursor-pointer"
            >
              <el.icon className="h-4 w-4 text-text-muted" />
              {el.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
