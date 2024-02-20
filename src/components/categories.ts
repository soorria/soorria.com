import {
  CodeIcon,
  type IconComponent,
  JavascriptIcon,
  ReactIcon,
  ScriptIcon,
  SolidJsIcon,
  TailwindIcon,
  TypescriptIcon,
  VueIcon,
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
  'vue composable': VueIcon,
  vue: VueIcon,
}

export const defaultCategoryIcon = CodeIcon
