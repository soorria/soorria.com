import {
  CodeIcon,
  IconComponent,
  JavascriptIcon,
  ReactIcon,
  ScriptIcon,
  SolidJsIcon,
  TailwindIcon,
  TypescriptIcon,
} from './icons'

export const categoryLowerCaseToIcon: Record<string, IconComponent> = {
  react: ReactIcon,
  'react hook': ReactIcon,
  javascript: JavascriptIcon,
  typescript: TypescriptIcon,
  script: ScriptIcon,
  miscellaneous: CodeIcon,
  solidjs: SolidJsIcon,
  tailwindcss: TailwindIcon,
}

export const defaultCategoryIcon = CodeIcon
