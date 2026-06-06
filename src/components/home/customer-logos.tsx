import Image from "next/image"

const companies = [
  { name: "KKR", logo: "/logos/trusted/kkr.svg", width: 120, height: 34 },
  { name: "Morgan Stanley", logo: "/logos/trusted/morgan-stanley.svg", width: 240, height: 34 },
  { name: "MetLife", logo: "/logos/trusted/metlife.svg", width: 140, height: 34 },
  { name: "Centerview", logo: "/logos/trusted/centerview.svg", width: 210, height: 34 },
  { name: "OHA", logo: "/logos/trusted/oha.svg", width: 120, height: 38 },
  { name: "Rice Management", logo: "/logos/trusted/rice.svg", width: 130, height: 38 },
  { name: "New Mountain Capital", logo: "/logos/trusted/new-mountain-capital.svg", width: 230, height: 42 },
  { name: "Latham & Watkins", logo: "/logos/trusted/latham-watkins.svg", width: 280, height: 34 },
]

export function CustomerLogos() {
  return (
    <section className="border-y borde-white  bg-[#F4F2F0] py-16">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-10 text-center">
          <p className="mb-2 text-xs uppercase tracking-[0.18em] text-zinc-600">
            Trusted by industry leaders
          </p>
          <h2 className="text-2xl font-semibold text-zinc-700 sm:text-3xl">
            Powering the world&apos;s best construction companies
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-px bg-zinc-400 md:grid-cols-4">
          {companies.map((company) => (
            <div
              key={company.name}
              className="aspect-[2.6/1] bg-[#F4F2F0] px-4 py-6"
            >
              <div className="flex h-full items-center justify-center">
                <Image
                  src={company.logo}
                  alt={company.name}
                  width={company.width}
                  height={company.height}
                  className="h-auto max-h-10 w-auto opacity-100"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
