import { contact } from '@/contact-links'
import { EmailIcon, FacebookIcon, GithubIcon, LinkedinIcon, TwitterIcon } from '../icons'

interface ContactProps {}

const LINKS = [
  {
    href: contact.github,
    title: contact.githubUsername,
    Icon: GithubIcon,
  },
  {
    href: `mailto:${contact.email}`,
    title: contact.email,
    Icon: EmailIcon,
  },
  {
    href: contact.linkedin,
    title: contact.linkedinUsername,
    Icon: LinkedinIcon,
  },
  {
    href: contact.twitter,
    title: `@${contact.twitterUsername}`,
    Icon: TwitterIcon,
  },
  {
    href: contact.facebook,
    title: contact.facebookUsername,
    Icon: FacebookIcon,
  },
]

const Contact: React.FC<ContactProps> = () => {
  return (
    <div className="px-4 py-6 sm:p-8 bg-drac-curr rounded-3xl">
      <h3 className="mb-6 text-4xl font-bold font-display">Contact</h3>
      <div className="grid grid-cols-1 gap-8 text-xl sm:grid-cols-2">
        <div className="">
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
    </div>
  )
}

export default Contact
