import type { ReactNode } from 'react'
import { EmailIcon, type IconComponent } from '~/components/icons'
import LandingSection from '~/components/landing/LandingSection'
import PostLayout from '~/components/posts/PostLayout'
import QRDialog from './qr-dialog'
import { getAllPosts, sortPostsForRender } from '~/lib/data'
import AllPostsGrid from '~/components/posts/AllPostsGrid'

const DRIVE_LINK = 'https://drive.google.com/drive/u/0/folders/1R2NkpjFDaeMO0JjHUMhpdmEERB79Pvav'
const UNI_EMAIL = 's.saruva@unsw.edu.au'

const links: { icon: IconComponent; title: ReactNode; href: string }[] = [
  {
    icon: props => (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 15 15" {...props}>
        <path
          fill="currentColor"
          d="M4.563 1.258A.5.5 0 0 1 5 1h5a.5.5 0 0 1 .436.255L14.23 8H8.473L4.576 1.765a.5.5 0 0 1-.013-.507M3.91 14h8.59a.5.5 0 0 0 .447-.276l2-4A.5.5 0 0 0 14.5 9H7.092zM.064 9.255l3.792-6.742l3.05 4.88l-3.982 6.372a.5.5 0 0 1-.871-.041l-2-4a.5.5 0 0 1 .011-.47"
        ></path>
      </svg>
    ),
    title: 'Google Drive (tute code)',
    href: DRIVE_LINK,
  },
  {
    icon: EmailIcon,
    title: UNI_EMAIL,
    href: `mailto:${UNI_EMAIL}`,
  },
]

const RelevantPosts = async () => {
  const allPosts = await getAllPosts()

  const relevantPosts = allPosts.filter(post => post.tags.includes('comp6080'))

  const sorted = sortPostsForRender(relevantPosts)

  return <AllPostsGrid posts={sorted} />
}

const COMP6080Page = () => {
  return (
    <PostLayout title="COMP6080 Stuff">
      <LandingSection title="Links" id="links">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {links.map(({ title, href, icon: Icon }) => (
            <a
              key={href}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="focus-ring group flex items-center gap-3 rounded-lg bg-drac-base-light px-6 py-4 text-lg text-drac-pink transition-colors hover:bg-drac-base-dark hover:text-drac-purple"
            >
              <Icon className="h-6 w-6 transition-transform group-hocus:-rotate-20" />
              <span>{title}</span>
            </a>
          ))}

          <div className="flex justify-center" style={{ gridColumn: '1 / -1' }}>
            <QRDialog />
          </div>
        </div>
      </LandingSection>

      <LandingSection title="Relevant posts" id="posts">
        <RelevantPosts />
      </LandingSection>
    </PostLayout>
  )
}

export default COMP6080Page
