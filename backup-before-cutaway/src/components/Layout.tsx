import type { PropsWithChildren } from 'react'
export function Container({ children }: PropsWithChildren) {
  return <div className="mx-auto w-full max-w-[1440px] px-4 sm:px-6 lg:px-10">{children}</div>
}
export function Section({ id, title, children }: PropsWithChildren<{ id: string; title: string }>) {
  return <section id={id} aria-labelledby={`${id}-heading`} className="min-w-0 rounded border border-border bg-surface p-4 sm:p-5 lg:p-6">
    <div className="mb-5 flex items-center gap-3 border-b border-border pb-3">
      <span aria-hidden="true" className="size-1.5 shrink-0 bg-accent" />
      <h2 id={`${id}-heading`} className="text-sm font-semibold tracking-wide sm:text-base">{title}</h2>
    </div>{children}
  </section>
}
