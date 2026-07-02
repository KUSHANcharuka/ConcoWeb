
const companies = [
  {
    name: "Ark Draft Pty Ltd",
    logo: "https://images.squarespace-cdn.com/content/v1/65fa19a21657386c527d70e8/2f5be0b6-6c14-478f-bd47-7480ef0ced4c/Arkdraft+Logo+Text.png?format=1500w",
  },
  {
    name: "International Construction Consortium",
    logo: "https://icc-construct.com/wp-content/uploads/2023/01/cropped-ICC-LOGO-192x192.jpg",
  },
  {
    name: "Sanken overseas Pvt Ltd",
    logo: "https://www.sankenoverseas.com/wp-content/themes/sanken/assets/img/logo.svg",
  },
  {
    name: "Design Group Five Pvt Ltd",
    logo: "https://www.dgfivei.com/wp-content/uploads/2025/11/Main-LOGO-2048x1098-1sss.png",
  },
  {
    name: "Downer Group Nz",
    logo: "https://downergroup.co.nz/wp-content/uploads/sites/5/2025/10/Downer-Logo.svg",
  },
  {
    name: "John Keells Properties",
    logo: "https://www.johnkeellsproperties.com/images/logos/sitelogo.svg",
  },
  {
    name: "Land Sterling",
    logo: "https://landsterling.com/wp-content/uploads/2023/12/LS-logo.svg",
  },
  {
    name: "NEOM",
    logo: "https://neom.scene7.com/is/image/neom/logo-neom-en-spaced?fmt=png-alpha&scl=1",
  },
]

export function CustomerLogos() {
  return (
    <section className="border-y border-zinc-200/50 bg-[#F4F2F0] py-16">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-10 text-center">
          <p className="mb-2 text-xs uppercase tracking-[0.18em] text-zinc-600 font-bold">
            Trusted by industry leaders
          </p>
          <h2 className="text-2xl font-bold text-zinc-800 sm:text-3xl tracking-tight">
            Powering the world&apos;s best construction companies
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-px bg-zinc-300 md:grid-cols-4 rounded-xl overflow-hidden border border-zinc-300/60 shadow-xs">
          {companies.map((company) => (
            <div
              key={company.name}
              className="aspect-[2.6/1] bg-[#F4F2F0] p-6 flex items-center justify-center hover:bg-zinc-50/50 transition-colors duration-300"
            >
              <img
                src={company.logo}
                alt={`${company.name} construction company logo on the Concolabs customer wall`}
                loading="lazy"
                className={`h-auto max-h-12 w-auto max-w-[85%] object-contain opacity-75 transition-all duration-300 ${
                  company.name === "John Keells Properties"
                    ? "brightness-0 hover:opacity-100"
                    : company.name === "Sanken overseas Pvt Ltd"
                    ? "invert grayscale hover:grayscale-0 hover:hue-rotate-180 hover:opacity-100"
                    : "grayscale hover:grayscale-0 hover:opacity-100 mix-blend-multiply"
                }`}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
