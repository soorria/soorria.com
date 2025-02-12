import { contactLinks } from '~/lib/constants/links'
import { cx } from '~/lib/utils/styles'
import { type FormEventHandler, useState } from 'react'
import LandingSection from './LandingSection'
import { createTrackFirstEvent } from '~/lib/analytics/utils'

interface ContactProps {
  random?: number
}

const classes = {
  formGroup: 'flex flex-col space-y-4 group',
  label: 'block group-focus-within:text-drac-pink transition-colors',
  input:
    'block w-full bg-drac-base-light focus:outline-hidden focus:ring-3 focus:ring-drac-pink transition p-2 rounded-sm',
}

enum FormStatus {
  NONE,
  SUBMITTING,
  SUBMITTED,
  ERROR,
}

const FORM_ENDPOINT = 'https://formsubmit.co/5d2ddd98ec02b30e98e75354af576d8c'

const titles = ['Get in Touch', 'Talk to me!', 'Contact', 'Reach Out']

const IDS = {
  errorEl: 'contact-form-error',
}

const ContactForm: React.FC = () => {
  const [status, setStatus] = useState(FormStatus.NONE)

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
    setStatus(FormStatus.SUBMITTING)
    event.preventDefault()
    const form = event.target as HTMLFormElement
    const data = Object.fromEntries(new FormData(form) as unknown as Iterable<[string, any]>)
    data._captcha = 'false'
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
    <>
      {status === FormStatus.SUBMITTED ? (
        <div className="border-drac-green/70 bg-drac-green/30 rounded-sm border-2 p-4">
          Thanks for contacting me! I&apos;ll try to get back to you in 24 hours.
        </div>
      ) : null}
      {status !== FormStatus.SUBMITTED ? (
        <form
          onSubmit={handleSubmit}
          method="POST"
          action={FORM_ENDPOINT}
          className={cx('space-y-8')}
          aria-describedby={status === FormStatus.ERROR ? IDS.errorEl : undefined}
        >
          {status === FormStatus.ERROR ? (
            <div
              aria-live="polite"
              id={IDS.errorEl}
              className="border-drac-red/70 bg-drac-red/30 rounded-sm border-2 p-4"
            >
              Looks like something went wrong with my form, or you&apos;re offline ☹. You can try
              again later, or just shoot me an email.
            </div>
          ) : null}

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
              placeholder="be nice 😊"
              rows={5}
            />
          </div>

          <input type="text" name="_honey" className="hidden" />
          <input
            readOnly
            type="text"
            name="_next"
            value="https://soorria.com/contact-success"
            className="hidden"
          />
          <input
            readOnly
            type="text"
            name="_subject"
            value="soorria.com Form Submission"
            className="hidden"
          />

          <button
            type="submit"
            className={cx(
              'bg-drac-pink text-drac-base block w-full rounded-sm px-4 py-2 font-semibold transition-colors',
              status === FormStatus.SUBMITTING
                ? 'cursor-not-allowed opacity-70'
                : 'hover:bg-drac-purple',
            )}
            disabled={status === FormStatus.SUBMITTING}
          >
            {status === FormStatus.SUBMITTING ? 'Submitting' : 'Submit'}
          </button>
        </form>
      ) : null}
    </>
  )
}

const track = createTrackFirstEvent()

const Contact: React.FC<ContactProps> = ({ random = 0 }) => {
  const [showForm, setShowForm] = useState(false)

  return (
    <LandingSection title={titles[random % titles.length]} id="contact">
      <div className="grid grid-flow-row-dense grid-cols-1 gap-x-16 gap-y-8 sm:grid-cols-2">
        <div className="row-start space-y-4 sm:row-start-1">
          <p className="text-lg">
            Want to work with me, or just want to chat? Shoot me an email or a message on Messenger{' '}
            <button
              type="button"
              tabIndex={-1}
              onClick={() => {
                track('Easter Egg', { props: { which: 'Contact Form' } })
                setShowForm((p) => !p)
              }}
              className={cx(
                'no-js-text break-words focus:outline-hidden',
                showForm ? 'text-drac-purple' : 'text-drac-base hover:text-drac-purple',
              )}
            >
              or use this <span className={showForm ? 'line-through' : ''}>secret</span> form
            </button>
          </p>
          <div className={cx('no-js-block', !showForm && 'hidden')}>
            <ContactForm key={showForm.toString()} />
          </div>
        </div>
        <div className="flex flex-col space-y-4 text-lg">
          {contactLinks.map(({ href, title, icon: Icon, newTab }) => (
            <a
              key={href}
              href={href}
              className="focus-ring group text-drac-pink nmpl-2 hocus:text-drac-purple flex items-center rounded-sm py-1"
              {...(newTab ? { target: '_blank', rel: 'noopener noreferrer' } : null)}
            >
              <Icon className="group-hocus:-rotate-20 mr-3 h-5 w-5 transition-transform" />
              <span>{title}</span>
            </a>
          ))}
        </div>
      </div>
    </LandingSection>
  )
}

export default Contact
