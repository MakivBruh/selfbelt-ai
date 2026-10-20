import { useEffect, useRef, useState } from 'react'

export function useBuzzer(active: boolean) {
  const context = useRef<AudioContext | null>(null)
  const [audioState, setAudioState] = useState<'off' | 'ready' | 'blocked'>('off')

  async function toggleBuzzer() {
    if (audioState === 'ready') { setAudioState('off'); return }
    try {
      context.current ??= new AudioContext()
      await context.current.resume()
      setAudioState(context.current.state === 'running' ? 'ready' : 'blocked')
    } catch { setAudioState('blocked') }
  }

  useEffect(() => {
    const audio = context.current
    if (!active || audioState !== 'ready' || !audio) return
    let oscillator: OscillatorNode | null = null
    let gain: GainNode | null = null
    function stopPulse() {
      try { oscillator?.stop() } catch { /* An ended pulse is already silent. */ }
      oscillator?.disconnect()
      gain?.disconnect()
      oscillator = null
      gain = null
    }
    function pulse() {
      if (!audio || audio.state !== 'running') return
      stopPulse()
      oscillator = audio.createOscillator()
      gain = audio.createGain()
      oscillator.type = 'sine'
      oscillator.frequency.value = 880
      const now = audio.currentTime
      gain.gain.setValueAtTime(0, now)
      gain.gain.linearRampToValueAtTime(0.045, now + 0.02)
      gain.gain.setValueAtTime(0.045, now + 0.12)
      gain.gain.linearRampToValueAtTime(0, now + 0.2)
      oscillator.connect(gain)
      gain.connect(audio.destination)
      oscillator.start(now)
      oscillator.stop(now + 0.21)
    }
    pulse()
    const timer = window.setInterval(pulse, 800)
    return () => { clearInterval(timer); stopPulse() }
  }, [active, audioState])

  useEffect(() => () => {
    void context.current?.close().catch(() => {})
    context.current = null
  }, [])

  return { audioState, toggleBuzzer }
}
