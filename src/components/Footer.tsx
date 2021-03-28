import Container from './Container'
import { HeartIcon } from './icons'

interface FooterProps {}

const Footer: React.FC<FooterProps> = () => {
  return (
    <Container>
      <footer className="py-8 text-center border-t border-drac-curr">
        Made with{' '}
        <span className="relative inline-block w-5 h-5 align-middle group">
          <HeartIcon className="absolute inset-0 fill-current text-drac-pink" />
          <HeartIcon className="absolute inset-0 fill-current text-drac-purple group-hover:animate-ping" />
        </span>{' '}
        by Soorria
      </footer>
    </Container>
  )
}

export default Footer
