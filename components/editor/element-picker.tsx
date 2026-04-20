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

function grid(
  desktop: GridPlacement,
  mobile: GridPlacement,
): { grid: { desktop: GridPlacement; mobile: GridPlacement } } {
  return { grid: { desktop, mobile } }
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
        rowHeight: 24,
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
            fontSize: '44px',
            fontWeight: '700',
            textAlign: 'left',
            ...grid(
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
            ...grid(
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
            ...grid(
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
            ...grid(
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
        rowHeight: 24,
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
            ...grid(
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
            ...grid(
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
            ...grid(
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
            ...grid(
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
            ...grid(
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
            ...grid(
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
            ...grid(
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
            ...grid(
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
            ...grid(
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
            ...grid(
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
            ...grid(
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
      const pricingCard = (
        planName: string,
        price: string,
        features: [string, string, string],
        ctaLabel: string,
        highlighted: boolean,
        cardDesktop: GridPlacement,
        cardMobile: GridPlacement,
      ): Node => ({
        id: uid(),
        type: 'section',
        props: {
          padding: '28px 20px',
          backgroundColor: '#ffffff',
          rowHeight: 24,
          borderRadius: '12px',
          border: highlighted ? '2px solid #3b82f6' : '1px solid #e4e4e7',
          boxShadow: highlighted
            ? '0 10px 30px -8px rgba(59,130,246,0.35)'
            : '0 1px 2px rgba(0,0,0,0.04)',
          ...grid(cardDesktop, cardMobile),
        },
        children: [
          {
            id: uid(),
            type: 'text',
            props: {
              content: planName,
              variant: 'h3',
              color: highlighted ? '#3b82f6' : '#09090b',
              fontSize: '18px',
              fontWeight: highlighted ? '700' : '600',
              textAlign: 'center',
              ...grid(
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
              fontSize: '40px',
              fontWeight: '700',
              textAlign: 'center',
              ...grid(
                { col: 1, row: 4, colSpan: 24, rowSpan: 3 },
                { col: 1, row: 4, colSpan: 8, rowSpan: 3 },
              ),
            },
          },
          {
            id: uid(),
            type: 'text',
            props: {
              content: features[0],
              variant: 'p',
              color: '#52525b',
              fontSize: '14px',
              fontWeight: '400',
              textAlign: 'center',
              ...grid(
                { col: 3, row: 8, colSpan: 20, rowSpan: 2 },
                { col: 1, row: 8, colSpan: 8, rowSpan: 2 },
              ),
            },
          },
          {
            id: uid(),
            type: 'text',
            props: {
              content: features[1],
              variant: 'p',
              color: '#52525b',
              fontSize: '14px',
              fontWeight: '400',
              textAlign: 'center',
              ...grid(
                { col: 3, row: 10, colSpan: 20, rowSpan: 2 },
                { col: 1, row: 10, colSpan: 8, rowSpan: 2 },
              ),
            },
          },
          {
            id: uid(),
            type: 'text',
            props: {
              content: features[2],
              variant: 'p',
              color: '#52525b',
              fontSize: '14px',
              fontWeight: '400',
              textAlign: 'center',
              ...grid(
                { col: 3, row: 12, colSpan: 20, rowSpan: 2 },
                { col: 1, row: 12, colSpan: 8, rowSpan: 2 },
              ),
            },
          },
          {
            id: uid(),
            type: 'button',
            props: {
              label: ctaLabel,
              backgroundColor: highlighted ? '#3b82f6' : '#ffffff',
              color: highlighted ? '#ffffff' : '#09090b',
              borderRadius: '8px',
              paddingX: '20px',
              paddingY: '10px',
              fontSize: '14px',
              fontWeight: '600',
              ...grid(
                { col: 6, row: 15, colSpan: 14, rowSpan: 2 },
                { col: 2, row: 15, colSpan: 6, rowSpan: 2 },
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
          backgroundColor: '#fafafa',
          rowHeight: 24,
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
              ...grid(
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
              ...grid(
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
    type: 'footer',
    label: 'Footer',
    icon: PanelBottom,
    category: 'section',
    createNode: () => ({
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
    }),
  },
]

const containerTypes: NodeType[] = ['section', 'menu-bar', 'footer']

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
    if (selectedId) {
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
