import { About, Footer, Header, Skills, Testimonial, Work } from './container'
import { Navbar } from './components'
import './App.scss'

const App = () => (
  <div className='app'>
    <Navbar />
    <main>
      <Header />
      <About />
      <Work />
      <Skills />
      <Testimonial />
      <Footer />
    </main>
  </div>
)

export default App
