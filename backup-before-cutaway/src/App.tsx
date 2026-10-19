import { Container } from './components/Layout'
import { TopView } from './components/TopView'
import { SideView } from './components/SideView'
import { ScenarioPlayground } from './components/ScenarioPlayground'
import { Header } from './components/Header'
import { DetectionPanel } from './components/DetectionPanel'
import { Hero, Dashboard, SystemFlow, Footer } from './components/Sections'
import { SimulationProvider } from './simulation/SimulationProvider'
export default function App() {
  return <SimulationProvider>
    <Header />
    <Container>
      <main id="main" tabIndex={-1}>
        <Hero />
        <div className="space-y-5">
          <Dashboard />
          <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1.4fr)_minmax(320px,1fr)]">
            <div className="min-w-0 space-y-5"><TopView /><SideView /></div>
            <ScenarioPlayground />
          </div>
          <DetectionPanel />
          <SystemFlow />
        </div>
      </main>
      <Footer />
    </Container>
  </SimulationProvider>
}

