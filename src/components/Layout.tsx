import type { PropsWithChildren } from 'react'
import SpotlightCard from './react-bits/SpotlightCard'
export function Container({ children }: PropsWithChildren) {
  return <div className="mx-auto w-full max-w-[1440px] px-4 sm:px-6 lg:px-10">{children}</div>
}
export function Section({ id, title, children }: PropsWithChildren<{ id: string; title: string }>) {
  return <section id={id} aria-labelledby={`${id}-heading`} className="section-shell min-w-0">
    <SpotlightCard className="section-card p-4 sm:p-5 lg:p-6" spotlightColor="rgba(103, 214, 237, 0.4)" intensity={0.13}>
    <div className="mb-5 flex items-center gap-3 border-b border-border pb-3">
      <span aria-hidden="true" className="size-1.5 shrink-0 bg-accent" />
      <h2 id={`${id}-heading`} className="text-sm font-semibold tracking-wide sm:text-base">{title}</h2>
    </div>{children}</SpotlightCard>
  </section>
}
