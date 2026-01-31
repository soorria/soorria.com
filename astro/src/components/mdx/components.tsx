import CustomLink from '../CustomLink'
import Note from './Note'
import { SlightBleedContentWrapper } from './SlightBleedContentWrapper'
import type { ReactNode } from 'react'

// Sandbox component for embedded iframes
const Sandbox = (props: Record<string, unknown>) => (
  <SlightBleedContentWrapper>
    <iframe
      loading="lazy"
      allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
      sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
      {...props}
    />
  </SlightBleedContentWrapper>
)

// Simple placeholder for demos until full implementation
const Demo = ({ children }: { children?: ReactNode }) => (
  <div className="rounded-lg border border-drac-base-light p-4">
    {children}
  </div>
)

// Sparkles effect component
const Sparkles = ({ children }: { children?: ReactNode }) => (
  <span className="relative inline-block">
    {children}
  </span>
)

// Collapsible content component
const Collapse = ({ children, summary }: { children?: ReactNode; summary?: string }) => (
  <details className="my-4">
    <summary className="cursor-pointer font-bold">{summary || 'Details'}</summary>
    <div className="mt-2">{children}</div>
  </details>
)

// Image component placeholder
const Image = (props: Record<string, unknown>) => (
  // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
  <img {...props} className="mx-auto rounded-lg" />
)

// TypeScript/JavaScript switcher placeholder
const TsJsSwitcher = ({ children }: { children?: ReactNode }) => (
  <div>{children}</div>
)

const TsJsToggle = ({ children }: { children?: ReactNode }) => (
  <div>{children}</div>
)

const OnlyIsTs = ({ children }: { children?: ReactNode }) => (
  <div>{children}</div>
)

// Generic component stub factory for undefined components
const createStub = (name: string) => ({ children }: { children?: ReactNode }) => (
  <div className="rounded-lg border border-drac-orange/30 bg-drac-orange/10 p-4 my-4">
    <p className="text-sm text-drac-orange">Component "{name}" placeholder</p>
    {children}
  </div>
)

// MDX components to be passed to Content
export const mdxComponents = {
  a: CustomLink,
  Note,
  Sandbox,
  Demo,
  ReactDemo: Demo,
  SolidDemo: Demo,
  Sparkles,
  sparkles: Sparkles,
  's-sparkles': Sparkles,
  Collapse,
  Image,
  TsJsSwitcher,
  TsJsToggle,
  OnlyIsTs,
  // Blog post specific component stubs
  BubblingDemo: createStub('BubblingDemo'),
  CapturingDemo: createStub('CapturingDemo'),
  Spreadsheet: createStub('Spreadsheet'),
  AnimatedHat: createStub('AnimatedHat'),
  PromiseAllResult: createStub('PromiseAllResult'),
  PromiseAllSettledResult: createStub('PromiseAllSettledResult'),
  CreatePreviousMemoDemo: createStub('CreatePreviousMemoDemo'),
  UsePreviousDemo: createStub('UsePreviousDemo'),
  UseCssVarDemo: createStub('UseCssVarDemo'),
  UseIsMouseInactiveDemo: createStub('UseIsMouseInactiveDemo'),
  FileDownloadDemo: createStub('FileDownloadDemo'),
}
