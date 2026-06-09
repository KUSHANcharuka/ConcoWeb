with open('src/components/products/product-detail-view.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Find the cut point - the file ends with ": [" in the FAQ else clause
last_bracket = content.rfind('              : [')
print(f'Cut point at index: {last_bracket}')
print(f'Content after cut: {repr(content[last_bracket:last_bracket+80])}')

# Rest of the file content to append
rest = '''                {
                  q: "Which countries' planning codes does it cover?",
                  a: "Currently trained on UAE, Sri Lanka, KSA, UK, and Australia regulations. We are expanding coverage quarterly. Contact us if your target market is not yet included.",
                },
                {
                  q: "Can it handle plot overlays or special zones?",
                  a: "Yes. If a plot is in a heritage zone, industrial area, or special development corridor, the tool identifies the overlay and applies the relevant restrictions.",
                },
                {
                  q: "How is this different from ChatGPT?",
                  a: "ChatGPT is not trained on construction law and misreads tabular content in planning books. Our tool is FIDIC-grade accurate and trained specifically on planning regulations across multiple jurisdictions.",
                },
                {
                  q: "Can we integrate it into our own portal?",
                  a: "Yes, via API. We have integration packages for architecture firms and consultancies. Pricing starts at USD 2,000/month.",
                },
                {
                  q: "What if the planning rules change?",
                  a: "We update the knowledge base quarterly. Your maintenance fee covers these updates automatically.",
                },
              ]
          ).map((faq, idx) => (
            <div
              key={idx}
              className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden transition-all duration-300"
            >
              <button
                onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                className="w-full flex items-center justify-between p-6 text-left font-bold text-sm tracking-tight text-zinc-950 dark:text-zinc-50 cursor-pointer"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  className={`w-4 h-4 text-zinc-400 transition-transform duration-300 shrink-0 ml-4 ${
                    activeFaq === idx ? "rotate-180" : "rotate-0"
                  }`}
                />
              </button>

              <AnimatePresence initial={false}>
                {activeFaq === idx && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-6">
                      <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed">
                        {faq.a}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </section>

      {/* 9. Final CTA Footer */}
      <section className="py-24 px-6 bg-[#F4F2F0] dark:bg-zinc-900/40 border-t border-zinc-200 dark:border-zinc-800 relative overflow-hidden">
        <div className="max-w-4xl mx-auto text-center space-y-6 relative z-10">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50 leading-tight">
            {product.id === "cost-plan-calculator"
              ? "Give clients a cost estimate on day one."
              : product.id === "auto-conversion-2d-to-3d"
                ? "Stop drawing the same geometry twice."
                : "Start your feasibility with data, not guesswork."}
          </h2>
          <p className="text-zinc-500 text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
            {product.id === "cost-plan-calculator"
              ? "See how Cost Plan Calculator turns a 2-day manual task into a 2-minute output."
              : product.id === "auto-conversion-2d-to-3d"
                ? "See how Auto Conversion 2D to 3D cuts modelling time in half."
                : "See how Planning Law Chatbot answers planning questions before your team picks up the phone."}
          </p>
          <div className="pt-4 flex justify-center">
            <Button
              asChild
              size="lg"
              className="rounded-xl px-8 py-6 font-bold shadow-md bg-primary text-black hover:bg-primary/90 cursor-pointer"
            >
              <a
                href="https://calendar.app.google/mCq7zBhXrDnEAJvB7"
                target="_blank"
                rel="noopener noreferrer"
              >
                Book a demo →
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* 10. Lightbox for Demo Video */}
      <AnimatePresence>
        {isLightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setIsLightboxOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6 max-w-3xl w-full space-y-6 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setIsLightboxOpen(false)}
                className="float-right text-zinc-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="space-y-2">
                <span className="text-xs font-bold text-lime uppercase tracking-widest">
                  Interactive Video Demo
                </span>
                <h3 className="text-xl font-bold">
                  {product.id === "cost-plan-calculator"
                    ? "Cost Plan Calculator Walkthrough"
                    : product.id === "auto-conversion-2d-to-3d"
                      ? "Auto Conversion 2D to 3D Demo"
                      : "Planning Law Chatbot Walkthrough"}
                </h3>
              </div>

              {/* Video Embed Simulation or Real Player */}
              <div className="relative w-full aspect-video rounded-2xl bg-zinc-950 overflow-hidden border border-zinc-800 flex items-center justify-center group">
                {product.id === "planning-law-chatbot" ? (
                  <video
                    src="/videos/planning-law-chatbot-hero.mp4"
                    controls
                    autoPlay
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="relative w-full h-full flex items-center justify-center bg-zinc-900">
                    <Image
                      src={product.image}
                      alt={product.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 720px"
                      className="object-cover opacity-30"
                    />
                    <div className="relative z-10 text-center space-y-4">
                      <a
                        href={
                          product.id === "cost-plan-calculator"
                            ? "https://drive.google.com/file/d/1hCtxWtFzPzOcWqu7VBon84aMdadLac35/view?usp=sharing"
                            : product.id === "auto-conversion-2d-to-3d"
                              ? "https://drive.google.com/drive/folders/1H63HxhRAEjOyEDD424G4Yh1BNrKz-6U9?usp=sharing"
                              : "https://drive.google.com/drive/folders/1WbhlgnVj0X2F73J6R_TlOxBr1JHJmkDI?usp=sharing"
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-primary text-black px-6 py-3 rounded-xl font-bold text-sm hover:bg-primary/90 transition-colors"
                      >
                        <Play className="w-4 h-4" />
                        Watch Demo Video
                      </a>
                      <p className="text-sm text-zinc-400">
                        {product.id === "cost-plan-calculator"
                          ? "Explore the GFA-based cost estimation workflow with our interactive walkthrough demo."
                          : product.id === "auto-conversion-2d-to-3d"
                            ? "See how computer vision converts 2D structural PDFs to 3D BIM models automatically."
                            : "Watch how Planning Law Chatbot returns instant feasibility rules from any plot location."}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Meta info */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-zinc-500">
                  <Clock className="w-4 h-4" />
                  <span>Total Duration:</span>
                  <span className="font-bold text-zinc-300">
                    {product.id === "cost-plan-calculator" ? "3:30" : "2:45"}
                  </span>
                </div>
                <p className="text-xs text-zinc-600 italic">
                  {product.id === "cost-plan-calculator"
                    ? "Concept drawing \u2192 GFA \u2192 Cost output"
                    : "Full walkthrough of the planning feasibility workflow."}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 11. Closing */}
    </div>
  );
}

/* --- Sub-components --- */
function UploadIcon({ component: Icon }: { component: LucideIcon }) {
  return (
    <div className="w-12 h-12 rounded-full bg-zinc-800 text-zinc-300 flex items-center justify-center">
      <Icon className="w-6 h-6" />
    </div>
  );
}

function ZoningVideoShowcase() {
  return (
    <div className="bg-zinc-950 text-white rounded-3xl border border-zinc-800 p-6 shadow-xl relative overflow-hidden">
      <div className="flex items-center justify-between border-b border-zinc-800 pb-4 mb-4">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
          <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
          <span className="text-xs text-zinc-500 font-bold ml-2">
            Interactive Demo
          </span>
        </div>
        <div className="px-2 py-1 rounded bg-zinc-800 text-[10px] uppercase font-bold tracking-widest text-zinc-400">
          Playground
        </div>
      </div>

      <div className="space-y-6">
        <p className="text-sm text-zinc-400 leading-relaxed">
          Try a live simulation. Select a plot location to see what the
          Planning Law Chatbot returns.
        </p>

        {/* Location Selector */}
        <div className="grid grid-cols-3 gap-2">
          {simulatorPrompts.map((prompt) => (
            <button
              key={prompt.value}
              onClick={() => runChatSimulation(prompt.value)}
              className={`text-xs p-3 rounded-xl border transition-all cursor-pointer text-left ${
                chatLocation === prompt.value
                  ? "bg-primary/10 border-primary text-primary font-bold scale-[1.02]"
                  : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200"
              }`}
            >
              {prompt.label}
            </button>
          ))}
        </div>

        {/* Chat Messages */}
        <div className="space-y-4 min-h-[320px]">
          {chatMessages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${
                msg.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[90%] p-4 rounded-2xl text-sm leading-relaxed ${
                  msg.sender === "user"
                    ? "bg-primary/10 text-primary font-bold"
                    : "bg-zinc-900 text-zinc-300"
                }`}
              >
                {msg.sender === "bot" ? (
                  <div className="prose prose-sm prose-invert max-w-none">
                    <div className="whitespace-pre-line font-mono text-xs leading-relaxed text-zinc-300">
                      {msg.text}
                    </div>
                    {msg.pdf && (
                      <div className="mt-3 flex items-center gap-2 text-[10px] font-bold text-emerald-400 uppercase tracking-wider border-t border-zinc-800 pt-3">
                        <FileText className="w-3 h-3" />
                        <span>Feasibility Report Generated</span>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="font-semibold">{msg.text}</p>
                )}
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-zinc-900 p-4 rounded-2xl text-sm">
                <span className="inline-flex gap-1">
                  <motion.span
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                    className="w-2 h-2 bg-zinc-500 rounded-full inline-block"
                  />
                  <motion.span
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{
                      repeat: Infinity,
                      duration: 1.5,
                      delay: 0.2,
                    }}
                    className="w-2 h-2 bg-zinc-500 rounded-full inline-block"
                  />
                  <motion.span
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{
                      repeat: Infinity,
                      duration: 1.5,
                      delay: 0.4,
                    }}
                    className="w-2 h-2 bg-zinc-500 rounded-full inline-block"
                  />
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function WorkflowShowcase() {
  return (
    <section className="bg-white dark:bg-zinc-900 border-y border-zinc-200 dark:border-zinc-800 py-24 px-6">
      <div className="max-w-6xl mx-auto space-y-16">
        <div className="text-center space-y-3">
          <span className="text-xs font-bold text-zinc-450 uppercase tracking-widest block">
            Workflow Hook
          </span>
          <h2 className="text-3xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50">
            Fits into your workflow
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto pb-8">
          <div className="p-6 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-850 rounded-2xl space-y-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
              What feeds in
            </span>
            <h4 className="font-bold text-lg text-zinc-900 dark:text-zinc-100">
              Plot location
            </h4>
            <p className="text-sm text-zinc-500">
              Simple text input: address, parcel identifier, or coordinates.
            </p>
          </div>
          <div className="p-6 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-850 rounded-2xl space-y-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
              What it feeds into
            </span>
            <h4 className="font-bold text-lg text-zinc-900 dark:text-zinc-100">
              Cost Plan Calculator
            </h4>
            <p className="text-sm text-zinc-500">
              The planning feasibility output constrains the cost estimate.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-stretch relative">
          <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 h-0.5 bg-zinc-200 dark:bg-zinc-800 hidden md:block z-0" />
          {[
            { title: "1. Plot Location", desc: "Address, parcel boundary, or coordinates are entered.", highlight: false },
            { title: "2. Planning Law Chatbot", desc: "Zoning, max height, FAR, and setbacks are returned instantly.", highlight: true },
            { title: "3. Cost Plan Calculator", desc: "Budget model uses feasibility constraints to estimate cost.", highlight: false },
            { title: "4. Client Report", desc: "Feasibility PDF + cost plan ready for first client meeting.", highlight: false },
          ].map((step, idx) => (
            <div
              key={idx}
              className={`relative z-10 p-6 rounded-2xl border flex flex-col justify-between transition-all duration-300 ${step.highlight ? "bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 border-transparent shadow-xl scale-[1.02]" : "bg-white dark:bg-zinc-900 border-zinc-250 dark:border-zinc-850 text-zinc-800 dark:text-zinc-200 shadow-xs"}`}
            >
              <div className="space-y-4">
                <h4 className={`text-xs font-bold tracking-wider uppercase ${step.highlight ? "text-primary dark:text-zinc-900" : "text-zinc-400"}`}>{step.title}</h4>
                <p className={`text-xs leading-relaxed ${step.highlight ? "text-zinc-250 dark:text-zinc-650" : "text-zinc-500"}`}>{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
'''

new_content = content[:last_bracket] + rest

with open('src/components/products/product-detail-view.tsx', 'w', encoding='utf-8') as f:
    f.write(new_content)

print(f'File reconstructed successfully: {len(new_content)} chars')
print(f'Original was: {len(content)} chars')
print(f'Added: {len(new_content) - len(content)} chars')
