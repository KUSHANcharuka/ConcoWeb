"use client"

import Image from "next/image"

type Customer = {
  name: string
  logo: string
  industry: string
  size: string
  region: string
  quote: string
  author: string
  role: string
  result: string
  metric: string
  metricLabel: string
  product: string
  image: string
  avatar: string
  slug: string
}

export function CustomerCard({
  customer,
}: {
  customer: Customer
  index: number
  isInView: boolean
}) {
  return (
    <article className="group overflow-hidden rounded-[28px] border border-zinc-200 bg-white shadow-sm transition-transform duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-zinc-800 dark:bg-zinc-900">
      <div className="relative h-56 overflow-hidden">
        <Image
          src={customer.image}
          alt={customer.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
        <div className="absolute left-5 top-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/95 text-sm font-bold text-zinc-950 shadow-sm">
          {customer.logo}
        </div>
        <div className="absolute bottom-5 left-5 right-5">
          <div className="mb-2 flex flex-wrap gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/85">
            <span>{customer.product}</span>
            <span>{customer.region}</span>
          </div>
          <h3 className="text-2xl font-semibold text-white">{customer.name}</h3>
        </div>
      </div>

      <div className="space-y-5 p-6">
        <div className="flex flex-wrap gap-2 text-xs font-medium text-zinc-600 dark:text-zinc-300">
          <span className="rounded-full bg-zinc-100 px-3 py-1 dark:bg-zinc-800">{customer.industry}</span>
          <span className="rounded-full bg-zinc-100 px-3 py-1 dark:bg-zinc-800">{customer.size}</span>
        </div>

        <p className="text-sm leading-6 text-zinc-600 dark:text-zinc-300">"{customer.quote}"</p>

        <div className="grid grid-cols-2 gap-3 rounded-2xl bg-zinc-50 p-4 dark:bg-zinc-950">
          <div>
            <div className="text-lg font-semibold text-zinc-950 dark:text-white">{customer.metric}</div>
            <div className="text-xs text-zinc-500 dark:text-zinc-400">{customer.metricLabel}</div>
          </div>
          <div>
            <div className="text-lg font-semibold text-zinc-950 dark:text-white">{customer.result}</div>
            <div className="text-xs text-zinc-500 dark:text-zinc-400">Measured outcome</div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative h-11 w-11 overflow-hidden rounded-full">
            <Image
              src={customer.avatar}
              alt={customer.author}
              fill
              className="object-cover"
              sizes="44px"
            />
          </div>
          <div>
            <div className="font-medium text-zinc-950 dark:text-white">{customer.author}</div>
            <div className="text-sm text-zinc-500 dark:text-zinc-400">{customer.role}</div>
          </div>
        </div>
      </div>
    </article>
  )
}
