import {
  IconComponent,
  JavascriptIcon,
  MiscCodeIcon,
  ReactIcon,
  ScriptIcon,
  SolidJsIcon,
  TypescriptIcon,
} from './icons'

export const categoryLowerCaseToIcon: Record<string, IconComponent> = {
  react: ReactIcon,
  'react hook': ReactIcon,
  javascript: JavascriptIcon,
  typescript: TypescriptIcon,
  script: ScriptIcon,
  miscellaneous: MiscCodeIcon,
  solidjs: SolidJsIcon,
}
