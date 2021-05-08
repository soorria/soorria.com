import { contact } from '@/contact-links'
import { FormEventHandler, useState } from 'react'
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
    href: contact.facebook,
    title: contact.facebookUsername,
    Icon: FacebookIconSolid,
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
    href: contact.github,
    title: contact.githubUsername,
    Icon: GithubIconSolid,
  },
]

const classes = {
  formGroup: 'flex flex-col space-y-4',
  label: 'block',
  input:
    'block w-full bg-drac-curr focus:outline-none focus:ring focus:ring-drac-pink transition p-2 rounded',
}

enum FormStatus {
  NONE,
  SUBMITTING,
  SUBMITTED,
  ERROR,
}

const FORM_ENDPOINT = 'https://formsubmit.co/5d2ddd98ec02b30e98e75354af576d8c'

const Contact: React.FC<ContactProps> = () => {
  const [showForm, setShowForm] = useState(false)
  const [status, setStatus] = useState(FormStatus.NONE)

  const handleSubmit: FormEventHandler<HTMLFormElement> = async event => {
    setStatus(FormStatus.SUBMITTING)
    event.preventDefault()
    const form = event.target as HTMLFormElement
    const data = Object.fromEntries(new FormData(form) as any)
    delete data._next
    try {
      const response = await fetch(FORM_ENDPOINT, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      })
      if (response.ok) {
        setStatus(FormStatus.SUBMITTED)
        form.reset()
      } else {
        setStatus(FormStatus.ERROR)
      }
    } catch (err) {
      setStatus(FormStatus.ERROR)
    }
  }

  return (
    <LandingSection title="Contact" id="contact">
      <div className="grid grid-flow-row-dense grid-cols-1 gap-y-8 gap-x-16 sm:grid-cols-2">
        <div className="space-y-4 row-start sm:row-start-1">
          <p>
            The best way to get in touch is probably to email me, shoot me a message on Facebook
            Messenger{' '}
            <button
              tabIndex={-1}
              onClick={() => setShowForm(p => !p)}
              aria-hidden
              className="break-words text-drac-bg hover:text-drac-purple focus:outline-none"
            >
              or with this <span className={showForm ? 'line-through' : ''}>secret</span> form
            </button>
          </p>
          {status === FormStatus.SUBMITTED && (
            <div className="p-2 border-2 rounded bg-opacity-30 border-drac-green bg-drac-green">
              Thanks for contacting me! I&apos;ll get back to you via email in 24 hours.
            </div>
          )}
          {status === FormStatus.ERROR && (
            <div className="p-2 border-2 rounded bg-opacity-30 border-drac-red bg-drac-red">
              Looks like something went wrong with my form, or you&apos;re offline ☹. You can try
              again later, or shoot me an email.
            </div>
          )}
          {showForm && (
            <form
              onSubmit={handleSubmit}
              method="POST"
              action={FORM_ENDPOINT}
              className="space-y-4"
            >
              <div className={classes.formGroup}>
                <label htmlFor="name" className={classes.label}>
                  Your Name
                </label>
                <input
                  id="name"
                  type="text"
                  name="name"
                  autoComplete="name"
                  required
                  className={classes.input}
                />
              </div>

              <div className={classes.formGroup}>
                <label htmlFor="email" className={classes.label}>
                  Your Email
                </label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  autoComplete="email"
                  required
                  className={classes.input}
                />
              </div>

              <div className={classes.formGroup}>
                <label htmlFor="message" className={classes.label}>
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  autoComplete="off"
                  className={classes.input}
                />
              </div>

              <input type="text" name="_honey" className="hidden" />
              <input readOnly type="text" name="_captcha" value="false" className="hidden" />
              <input
                readOnly
                type="text"
                name="_next"
                value="https://mooth.tech/contact-success"
                className="hidden"
              />
              <input
                readOnly
                type="text"
                name="_subject"
                value="mooth.tech Form Submission"
                className="hidden"
              />

              <button
                type="submit"
                className={`block px-4 py-2 mx-auto font-semibold transition-colors rounded bg-drac-pink ${
                  status === FormStatus.SUBMITTING ? 'opacity-70' : 'hover:bg-drac-purple'
                }`}
                disabled={status === FormStatus.SUBMITTING}
              >
                {status === FormStatus.SUBMITTING ? 'Submitting' : 'Submit'}
              </button>
            </form>
          )}
        </div>
        <div className="flex flex-col space-y-4 text-lg">
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
