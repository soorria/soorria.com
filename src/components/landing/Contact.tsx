import { contact } from '@/contact-links'
import {
  EmailIcon,
  FacebookIconSolid,
  GithubIconSolid,
  LinkedinIconSolid,
  TwitterIconSolid,
} from '../icons'
import LandingSection from './LandingSection'

interface ContactProps {}

const LINKS = [
  {
    href: contact.github,
    title: contact.githubUsername,
    Icon: GithubIconSolid,
  },
  {
    href: `mailto:${contact.email}`,
    title: contact.email,
    Icon: EmailIcon,
  },
  {
    href: contact.linkedin,
    title: contact.linkedinUsername,
    Icon: LinkedinIconSolid,
  },
  {
    href: contact.twitter,
    title: `@${contact.twitterUsername}`,
    Icon: TwitterIconSolid,
  },
  {
    href: contact.facebook,
    title: contact.facebookUsername,
    Icon: FacebookIconSolid,
  },
]

const Contact: React.FC<ContactProps> = () => {
  return (
    <LandingSection title="Contact" id="contact">
      <div className="grid grid-cols-1 text-xl gap-y-8 gap-x-16 sm:grid-cols-2">
        <div>
          The best way to get in touch is probably to email me or shoot me a message on Facebook
          Messenger.
        </div>
        <div className="flex flex-col space-y-4">
          {LINKS.map(({ href, title, Icon }) => (
            <a
              key={title}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center text-drac-pink hover:text-drac-purple group"
            >
              <Icon className="w-5 h-5 mr-2 transition-transform transform group-hover:-rotate-12" />
              <span>{title}</span>
            </a>
          ))}
        </div>
      </div>
    </LandingSection>
  )
}

export default Contact
