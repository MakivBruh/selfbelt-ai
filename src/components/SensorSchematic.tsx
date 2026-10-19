import { useState } from 'react'
import { Section } from './Layout'
import { useCopy, useSimulation } from '../simulation/context'
import type { SeatId } from '../simulation/model'
const ids: SeatId[] = ['driver','frontPassenger','rearLeft','rearRight']
export function SensorSchematic() {
  const t = useCopy()
  const { state, derived } = useSimulation()
  const [selected, setSelected] = useState(0)
  const names = {driver:t.driverSeat,frontPassenger:t.frontPassengerSeat,rearLeft:t.rearLeftSeat,rearRight:t.rearRightSeat}
  const signals = ids.flatMap(id => [
    {label:`${names[id]} · ${t.occupiedControl}`, value:state.seats[id].occupied, detail:t.occupancySensor},
    {label:`${names[id]} · ${t.beltedControl}`, value:state.seats[id].belted, detail:t.buckleSensor},
  ]).concat([{label:t.speed,value:derived.moving,detail:t.speedSensor}])
  const active = derived.level !== 'safe'
  return <Section id="sensor-schematic" title={t.sensorTitle}>
    <p className="mb-5 text-sm text-muted">{t.sensorNote}</p>
    <div className="grid gap-5 lg:grid-cols-[2fr_1fr]">
      <div className="overflow-x-auto"><svg viewBox={`0 0 800 ${signals.length * 55 + 20}`} role="group" aria-label={t.sensorTitle} className="min-w-[620px] w-full">
        {signals.map((signal,i) => <g key={signal.label}>
          <path d={`M270 ${35+i*55} H325 V220 H370`} fill="none" stroke={signal.value ? '#67d6ed' : '#334a5a'} strokeWidth={signal.value ? 3 : 1} />
          <g role="button" tabIndex={0} aria-pressed={selected===i} aria-label={signal.label} onClick={()=>setSelected(i)} onKeyDown={e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();setSelected(i)}}} className="cursor-pointer">
            <rect x="10" y={12+i*55} width="260" height="46" rx="4" fill="#142735" stroke={selected===i?'#ffffff':signal.value?'#67d6ed':'#456071'} strokeWidth="2" />
            <text x="22" y={40+i*55} fill="#e1edf3" fontSize="12">{signal.label}</text>
            <circle cx="252" cy={35+i*55} r="5" fill={signal.value?'#67d6ed':'#536573'} />
          </g>
        </g>)}
        <rect x="370" y="160" width="190" height="120" rx="5" fill="#1b3443" stroke="#7f9dad" strokeWidth="2" />
        <text x="465" y="202" textAnchor="middle" fill="#fff" fontSize="14">{t.ruleProcessor}</text>
        <text x="465" y="229" textAnchor="middle" fill="#aac5d2" fontSize="12">occupied ∧ ¬belted</text>
        <text x="465" y="252" textAnchor="middle" fill="#aac5d2" fontSize="12">speed &gt; 0</text>
        <path d="M560 220H615" stroke={active?'#ffba78':'#405768'} strokeWidth="3" />
        <rect x="615" y="186" width="175" height="68" rx="4" fill="#192c39" stroke={active?'#ffba78':'#78d7b1'} strokeWidth="2" />
        <text x="702" y="214" textAnchor="middle" fill="#fff" fontSize="13">{t.logicAlert}</text>
        <text x="702" y="237" textAnchor="middle" fill="#c7dbe5" fontSize="12">{({safe:t.levelSafe,notice:t.levelNotice,warning:t.levelWarning,critical:t.levelCritical})[derived.level]}</text>
      </svg></div>
      <aside className="border border-border p-4" aria-live="polite"><h3 className="font-semibold">{signals[selected].label}</h3><p className="my-4 text-sm text-muted">{signals[selected].detail}</p><p className="font-mono text-accent">{selected===signals.length-1?`${state.speedKmh} km/h`:signals[selected].value?t.yes:t.no}</p><p className="mt-4 text-xs text-muted">{t.signalLegend}</p></aside>
    </div>
  </Section>
}
