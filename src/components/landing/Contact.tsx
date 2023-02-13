import { ComponentProps, createSignal, For, VoidComponent } from 'solid-js'
import { Dynamic } from 'solid-js/web'
import { useTrackFirstEvent } from '~/lib/analytics'
import { contactLinks } from '~/links'
import cx from '~/utils/cx'
import LandingSection from './LandingSection'

interface ContactProps {
  random?: number
}

const classes = {
  formGroup: 'flex flex-col space-y-4 group',
  label: 'block group-focus-within:text-drac-pink transition-colors',
  input:
    'block w-full bg-drac-base-light focus:outline-none focus:ring focus:ring-drac-pink transition p-2 rounded',
}

enum FormStatus {
  NONE,
  SUBMITTING,
  SUBMITTED,
  ERROR,
}

const FORM_ENDPOINT = 'https://formsubmit.co/5d2ddd98ec02b30e98e75354af576d8c'

const titles = ['Get in touch', 'Talk to me!', 'Contact me', 'Reach out']

const IDS = {
  errorEl: 'contact-form-error',
}

const ContactForm: VoidComponent = () => {
  const [status, setStatus] = createSignal(FormStatus.NONE)

  const handleSubmit: ComponentProps<'form'>['onSubmit'] = async event => {
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
      {status() === FormStatus.SUBMITTED ? (
        <div class="rounded border-2 border-drac-green/70 bg-drac-green/30 p-4">
          Thanks for contacting me! I&apos;ll try to get back to you in 24 hours.
        </div>
      ) : null}
      {status() !== FormStatus.SUBMITTED ? (
        <form
          onSubmit={handleSubmit}
          method="post"
          action={FORM_ENDPOINT}
          class={cx('space-y-8')}
          aria-describedby={status() === FormStatus.ERROR ? IDS.errorEl : undefined}
        >
          {status() === FormStatus.ERROR ? (
            <div
              aria-live="polite"
              id={IDS.errorEl}
              class="rounded border-2 border-drac-red/70 bg-drac-red/30 p-4"
            >
              Looks like something went wrong with my form, or you&apos;re offline ☹. You can try
              again later, or just shoot me an email.
            </div>
          ) : null}

          <div class={classes.formGroup}>
            <label for="name" class={classes.label}>
              Your Name
            </label>
            <input
              id="name"
              type="text"
              name="name"
              autocomplete="name"
              required
              class={classes.input}
            />
          </div>

          <div class={classes.formGroup}>
            <label for="email" class={classes.label}>
              Your Email
            </label>
            <input
              id="email"
              type="email"
              name="email"
              autocomplete="email"
              required
              class={classes.input}
            />
          </div>

          <div class={classes.formGroup}>
            <label for="message" class={classes.label}>
              Message
            </label>
            <textarea
              id="message"
              name="message"
              autocomplete="off"
              class={classes.input}
              placeholder="be nice 😊"
              rows={5}
            />
          </div>

          <input type="text" name="_honey" class="hidden" />
          <input
            readOnly
            type="text"
            name="_next"
            value="https://soorria.com/contact-success"
            class="hidden"
          />
          <input
            readOnly
            type="text"
            name="_subject"
            value="soorria.com Form Submission"
            class="hidden"
          />

          <button
            type="submit"
            class={cx(
              'block w-full rounded bg-drac-pink px-4 py-2 font-semibold text-drac-base transition-colors',
              status() === FormStatus.SUBMITTING
                ? 'cursor-not-allowed opacity-70'
                : 'hover:bg-drac-purple'
            )}
            disabled={status() === FormStatus.SUBMITTING}
          >
            {status() === FormStatus.SUBMITTING ? 'Submitting' : 'Submit'}
          </button>
        </form>
      ) : null}
    </>
  )
}

const Contact: VoidComponent<ContactProps> = props => {
  const [showForm, setShowForm] = createSignal(false)
  const track = useTrackFirstEvent()

  return (
    <LandingSection title={titles[(props.random ?? 0) % titles.length]} id="contact">
      <div class="grid grid-flow-row-dense grid-cols-1 gap-y-8 gap-x-16 sm:grid-cols-2">
        <div class="row-start space-y-4 sm:row-start-1">
          <p class="text-lg">
            Want to work with me, or just want to chat? Shoot me an email or a message on Messenger{' '}
            <button
              type="button"
              tabIndex={-1}
              onClick={() => {
                track('Easter Egg', { props: { which: 'Contact Form' } })
                setShowForm(p => !p)
              }}
              class={cx(
                'no-js-text break-words focus:outline-none',
                showForm() ? 'text-drac-purple' : 'text-drac-base hover:text-drac-purple'
              )}
            >
              or use this <span class={showForm() ? 'line-through' : ''}>secret</span> form
            </button>
          </p>
          <div
            class="no-js-block"
            classList={{
              hidden: !showForm(),
            }}
          >
            <ContactForm />
          </div>
        </div>
        <div class="flex flex-col space-y-4 text-lg">
          <For each={contactLinks}>
            {({ href, title, icon }) => (
              <a
                href={href}
                class="focus-ring group flex items-center rounded py-1 text-drac-pink nmpl-2 hocus:text-drac-purple"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Dynamic
                  component={icon}
                  class="mr-3 h-5 w-5 transition-transform group-hocus:-rotate-20"
                />
                <span>{title}</span>
              </a>
            )}
          </For>
        </div>
      </div>
    </LandingSection>
  )
}

export default Contact
