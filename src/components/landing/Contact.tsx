import { contact } from '@/contact-links'
import { EmailIcon, GithubIcon, TwitterIcon } from '../icons'

interface ContactProps {}

const Contact: React.FC<ContactProps> = () => {
  return (
    <div className="px-4 py-6 sm:p-8 bg-drac-curr rounded-3xl">
      <h3 className="mb-6 text-4xl font-bold font-display">Contact</h3>
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
        <div className="text-xl">
          The best way to get in touch is probably to email me or shoot me a message on FaceBook
          Messenger.
        </div>
        <div className="flex flex-col space-y-4">
          <a
            className="flex items-center text-xl text-drac-pink hover:text-drac-purple"
            href={contact.github}
          >
            <GithubIcon className="w-5 h-5 mr-3" />
            <div>{contact.githubUsername}</div>
          </a>
          <a
            className="flex items-center text-xl text-drac-pink hover:text-drac-purple"
            href={`mailto:${contact.email}`}
          >
            <EmailIcon className="w-5 h-5 mr-3" />
            <div>{contact.email}</div>
          </a>
          <a
            className="flex items-center text-xl text-drac-pink hover:text-drac-purple"
            href={contact.twitter}
          >
            <TwitterIcon className="w-5 h-5 mr-3" />
            <div>{contact.twitterUsername}</div>
          </a>
          <a
            className="flex items-center text-xl text-drac-pink hover:text-drac-purple"
            href={contact.facebook}
          >
            <TwitterIcon className="w-5 h-5 mr-3" />
            <div>FaceBook</div>
          </a>
        </div>
      </div>
    </div>
  )
}

export default Contact
