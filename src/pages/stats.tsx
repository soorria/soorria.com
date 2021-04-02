import MainLayout from '@/components/MainLayout'
import { PostHeading } from '@/components/PostLayout'
import Hits from '@/components/stats/Hits'
import { GetServerSideProps } from 'next'
import { useRouter } from 'next/router'
import { FormEventHandler, useEffect, useRef, useState } from 'react'

interface StatsProps {
  isPreview: boolean
}

const Login: React.FC = () => {
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)
  const [type, setType] = useState<'text' | 'password'>('password')

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const handleSubmit: FormEventHandler<HTMLFormElement> = async event => {
    event.preventDefault()
    const fd = new FormData(event.target as HTMLFormElement)
    await fetch('/api/stats/init', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ pw: fd.get('password') }),
    })
    router.push('/stats')
  }

  return (
    <form onSubmit={handleSubmit} className="relative max-w-xs mx-auto">
      <input
        ref={inputRef}
        name="password"
        id="password"
        type={type}
        className="block w-full px-4 py-4 rounded appearance-none bg-drac-curr focus:outline-none focus:ring-2 focus:ring-drac-pink"
      />
      <button
        onClick={() => setType(t => (t === 'text' ? 'password' : 'text'))}
        className="absolute px-2 rounded-sm inset-y-4 right-4 bg-drac-pink text-drac-bg hover:bg-drac-purple"
        type="button"
      >
        {type === 'text' ? 'hide' : 'show'}
      </button>
    </form>
  )
}

const Stats: React.FC = () => {
  const router = useRouter()

  const handleLogout = async () => {
    await fetch('/api/stats/init', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: '{}',
    })
    router.push('/stats')
  }

  return (
    <div className="max-w-md mx-auto">
      <Hits />
      <div className="text-center">
        <button
          onClick={handleLogout}
          className="px-4 py-2 rounded bg-drac-pink text-drac-bg hover:bg-drac-purple"
        >
          LogOut
        </button>
      </div>
    </div>
  )
}

const StatsPage: React.FC<StatsProps> = () => {
  const router = useRouter()
  return (
    <MainLayout>
      <PostHeading>Stats</PostHeading>
      {router.isPreview ? <Stats /> : <Login />}
    </MainLayout>
  )
}

export default StatsPage

export const getServerSideProps: GetServerSideProps = async context => {
  return { props: { isPreview: !!context.preview } }
}
