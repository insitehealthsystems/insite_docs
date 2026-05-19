import Hero from '../components/Hero'
import Features from '../components/Features'
import Solutions from '../components/Solutions'
import WhyChoose from '../components/WhyChoose'
import StatisticsSimple from '../components/StatisticsSimple'
import FAQ from '../components/FAQ'
import Contact from '../components/Contact'

const HomePage = () => {
  return (
    <main>
      <Hero />
      <Features />
      <Solutions />
      <StatisticsSimple />
      <WhyChoose />
      <FAQ />
      <Contact />
    </main>
  )
}

export default HomePage
