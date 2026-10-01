import { About } from '../components/home/About'
import { Contact } from '../components/home/Contact'
import { CursorLabel } from '../components/home/CursorLabel'
import { Faq } from '../components/home/Faq'
import { Footer } from '../components/home/Footer'
import { Hero } from '../components/home/Hero'
import { Nav } from '../components/home/Nav'
import { Process } from '../components/home/Process'
import { Services } from '../components/home/Services'
import { Why } from '../components/home/Why'
import { Work } from '../components/home/Work'
import { useSeo } from '../lib/seo'
import { useBodyTheme } from '../lib/useBodyTheme'

export function Home() {
  useSeo('/')
  useBodyTheme('#f1efea')

  return (
    <>
      <a href="#main" className="skip-link">
        Přeskočit na obsah
      </a>
      <Nav />
      <main id="main">
        <Hero />
        <Work />
        <About />
        <Services />
        <Process />
        <Why />
        <Faq />
        <Contact />
      </main>
      <Footer />
      <CursorLabel />
    </>
  )
}
