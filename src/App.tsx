import { Container } from './components/Layout'
import { TopView } from './components/TopView'
import { SideView } from './components/SideView'
import { ScenarioPlayground } from './components/ScenarioPlayground'
import { Header } from './components/Header'
import { SensorSchematic } from './components/SensorSchematic'
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
          <div className="simulation-workspace grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_360px] xl:grid-cols-[minmax(0,1fr)_390px]">
            <div className="min-w-0 space-y-5"><TopView /><SideView /></div>
            <aside className="playground-dock" aria-label="Playground"><ScenarioPlayground /></aside>
          </div>
          <SensorSchematic />
          <DetectionPanel />
          <SystemFlow />
        </div>
      </main>
      <Footer />
    </Container>
  </SimulationProvider>
}

