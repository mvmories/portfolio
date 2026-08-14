import { About, Experience, Footer, Header, Testimonial, Work } from './container'
import { Navbar, NavigationDots, SocialMedia } from './components'
import { useHashLanding } from '@/lib/useHashLanding'
import './App.scss'

const App = () => {
  useHashLanding()

  return (
    <div className='app'>
      {/* First thing in the tab order: lets a keyboard user past the nav in one key. */}
      <a className='sr-only sr-only-focusable' href='#main'>
        Skip to content
      </a>

      <Navbar />
      <SocialMedia />
      <NavigationDots />

      <main id='main' tabIndex={-1}>
        <Header />
        <About />
        <Experience />
        <Work />
        <Testimonial />
        <Footer />
      </main>

      <footer className='copyright'>
        <p className='p-text'>
          &copy; {new Date().getFullYear()} Miguel Vilhena. All rights reserved.
        </p>
      </footer>
    </div>
  )
}

export default App
