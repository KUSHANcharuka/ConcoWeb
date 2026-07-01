export interface BlogPost {
  title: string
  category: string
  date: string
  readTime: string
  description: string
  image: string
  author: string
  avatar: string
  slug: string
  content: string
}

export const blogPosts: BlogPost[] = [
  {
    title: "Announcing the AI Cost Control Engine: Predict and Prevent Project Overruns",
    category: "Product News",
    date: "May 25, 2026",
    readTime: "5 min read",
    description: "How our new predictive AI models help general contractors identify supplier budget anomalies and schedule bottlenecks before they happen, saving millions in delay costs.",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&auto=format&fit=crop&q=80",
    author: "Marcus Vance",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80",
    slug: "announcing-ai-cost-control-engine",
    content: `
      <p className="text-lg text-zinc-700 dark:text-zinc-300 leading-relaxed mb-6 font-medium">
        Construction projects operate on razor-thin margins. An unexpected delay in material delivery or a subcontractor dispute can wipe out months of projected profitability. Today, we are proud to introduce the Concolabs AI Cost Control Engine, a predictive intelligence layer designed to identify financial anomalies and schedule bottlenecks before they affect your bottom line.
      </p>

      <h2 className="text-2xl font-bold text-zinc-950 dark:text-zinc-50 mt-8 mb-4">
        The Cost of Reactive Management
      </h2>
      <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed mb-6">
        Historically, project managers have managed budgets retrospectively. Receipts, daily logs, and sub-invoices are collected at the end of the week, transcribed manually into spreadsheets, and reviewed against the master budget. By the time a cost overrun is spotted, the resources have already been spent.
      </p>
      <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed mb-6">
        The Concolabs AI Cost Control Engine turns this reactive model on its head. By continuously ingestion site telemetry, purchase orders, and supplier communication, our system predicts cost trajectories and alerts you to potential overruns in real-time.
      </p>

      <blockquote className="border-l-4 border-primary pl-4 my-8 italic text-zinc-800 dark:text-zinc-200">
        "Before Concolabs, we were always reacting to cost overruns weeks after they happened. Now, the AI engine flags potential anomalies in real-time, letting us adjust on the fly and stay on budget."
        <span className="block text-xs font-semibold text-zinc-500 mt-2">— Elena Rostova, VP of Product Development</span>
      </blockquote>

      <h2 className="text-2xl font-bold text-zinc-950 dark:text-zinc-50 mt-8 mb-4">
        How It Works: Predictive Telemetry
      </h2>
      <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed mb-6">
        Our cost engine operates on three main data pipelines:
      </p>
      <ul className="list-disc pl-6 space-y-2 text-zinc-600 dark:text-zinc-400 mb-6">
        <li><strong>Logistics Tracking:</strong> Monitored material deliveries and flags early delays that ripple into subcontractor scheduling bottlenecks.</li>
        <li><strong>Automatic Rate Auditing:</strong> Checks supplier invoice rates against purchase order commitments to prevent double billing or incorrect invoicing.</li>
        <li><strong>Historical Benchmarking:</strong> Compares active pour schedules and material utilization rates with past projects to detect wastage anomalies.</li>
      </ul>

      <h2 className="text-2xl font-bold text-zinc-950 dark:text-zinc-50 mt-8 mb-4">
        Immediate Fiscal Impact
      </h2>
      <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed mb-6">
        In early deployments across commercial developments in the UK and UAE, construction firms using the Cost Control Engine saw a <strong>15% reduction</strong> in concrete wastage and saved an average of <strong>20 hours weekly</strong> in manual administrative auditing per site manager.
      </p>
    `
  },
  {
    title: "Field Operations 101: Eliminating the Pen-and-Paper Bottleneck on the Jobsite",
    category: "Best Practices",
    date: "May 18, 2026",
    readTime: "4 min read",
    description: "A comprehensive guide to transitioning your site crew from manual logs and paper receipts to real-time digital operational sync without operational friction.",
    image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&auto=format&fit=crop&q=80",
    author: "Elena Rostova",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80",
    slug: "field-operations-eliminating-paper-bottleneck",
    content: `
      <p className="text-lg text-zinc-700 dark:text-zinc-300 leading-relaxed mb-6 font-medium">
        Despite the rapid digitization of the corporate office, the typical construction jobsite remains heavily reliant on paper logs, handwritten schedules, and physical receipts. This manual bottleneck slows down project managers, delays payments, and creates communication blindspots between the field and the office.
      </p>

      <h2 className="text-2xl font-bold text-zinc-950 dark:text-zinc-50 mt-8 mb-4">
        The Reality of Site Administration
      </h2>
      <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed mb-6">
        Site managers spend an average of two hours at the end of every shift filling out paper Daily Progress Reports (DPRs), logging subcontractor hours, and documenting safety audits. This paperwork represents administrative overhead that keeps them away from safety supervision and quality control.
      </p>

      <h2 className="text-2xl font-bold text-zinc-950 dark:text-zinc-50 mt-8 mb-4">
        Transitioning to Real-Time Digital Sync
      </h2>
      <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed mb-6">
        To transition field operations without disrupting daily workflows, construction leaders should focus on three steps:
      </p>
      <ol className="list-decimal pl-6 space-y-3 text-zinc-600 dark:text-zinc-400 mb-6">
        <li><strong>Mobile-First Tools:</strong> Deploy simple mobile apps that allow site teams to snap photos and input progress directly on site instead of in the trailer.</li>
        <li><strong>Automated PDF Generation:</strong> Use systems that compile mobile inputs directly into your client's required contract report format.</li>
        <li><strong>Offline Compatibility:</strong> Ensure tools run offline, storing data locally in remote zones and syncing automatically when connection is restored.</li>
      </ol>

      <h2 className="text-2xl font-bold text-zinc-950 dark:text-zinc-50 mt-8 mb-4">
        Reclaiming Field Hours
      </h2>
      <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed mb-6">
        Firms implementing digital field logs report reclaiming over 15 hours per week per site manager, allowing teams to focus on construction quality and safety protocols instead of data transcription.
      </p>
    `
  },
  {
    title: "Connecting Jobsite and Office: Seamless Sage 300 & Procore Financial Sync",
    category: "Integrations",
    date: "May 10, 2026",
    readTime: "6 min read",
    description: "How double-entry accounting errors cost construction firms millions annually, and how automated Procore and Sage ledger sync solves invoice discrepancies.",
    image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600&auto=format&fit=crop&q=80",
    author: "Elena Rostova",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80",
    slug: "connecting-jobsite-and-office-sage-procore-sync",
    content: `
      <p className="text-lg text-zinc-700 dark:text-zinc-300 leading-relaxed mb-6 font-medium">
        Double-entry accounting and transcription lag are silent profit killers in mid-to-large construction projects. When site managers log variations in Procore, and corporate accountants manually copy those line items into Sage 300, discrepancies are bound to arise, delaying financial close.
      </p>

      <h2 className="text-2xl font-bold text-zinc-950 dark:text-zinc-50 mt-8 mb-4">
        The Disconnect Between Jobsite and Ledger
      </h2>
      <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed mb-6">
        When operational data is siloed from financial systems, managers must manually cross-reference work progress against invoices. This creates weeks of payment delays and makes accurate cash-flow planning nearly impossible.
      </p>

      <h2 className="text-2xl font-bold text-zinc-950 dark:text-zinc-50 mt-8 mb-4">
        The Solution: Automatic ERP Ledger Sync
      </h2>
      <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed mb-6">
        Concolabs unifies operations and finance by connecting Sage 300, Procore, and site tools. Our automated financial sync matches field progress records with vendor ledger entries, ensuring that payment applications are generated with zero double entry.
      </p>
    `
  },
  {
    title: "Mobile 3.0: Behind the Scenes of Our Offline-First Database Architecture",
    category: "Engineering",
    date: "May 3, 2026",
    readTime: "8 min read",
    description: "An in-depth technical walkthrough of how our engineering team built a local-first SQLite cache system to sync site telemetry seamlessly in remote zones.",
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&auto=format&fit=crop&q=80",
    author: "Marcus Vance",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80",
    slug: "mobile-3-offline-first-database-architecture",
    content: `
      <p className="text-lg text-zinc-700 dark:text-zinc-300 leading-relaxed mb-6 font-medium">
        Jobsites are notoriously hostile environments for cellular connectivity. Basements, heavy concrete structures, and remote civil engineering regions often have zero network service. To ensure zero data loss, we built an offline-first architecture for the Concolabs Mobile App.
      </p>

      <h2 className="text-2xl font-bold text-zinc-950 dark:text-zinc-50 mt-8 mb-4">
        Designing for Disconnected States
      </h2>
      <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed mb-6">
        Most site applications fail in remote locations because they rely on active API connections. If the network drops during an inspection, the data is lost. Concolabs writes all transactions locally to a high-speed SQLite cache before syncing with the cloud database.
      </p>
    `
  },
  {
    title: "Concolabs Secures Series A Funding to Expand AI Construction Engines",
    category: "News",
    date: "April 20, 2026",
    readTime: "3 min read",
    description: "We are excited to partner with leading capital firms to accelerate our product roadmap and scale unified construction operations engines globally.",
    image: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=600&auto=format&fit=crop&q=80",
    author: "Charu Dev",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
    slug: "concolabs-secures-series-a-funding",
    content: `
      <p className="text-lg text-zinc-700 dark:text-zinc-300 leading-relaxed mb-6 font-medium">
        We are thrilled to announce that Concolabs has secured $12 million in Series A funding. This capital round will accelerate development of our core AI budget prediction models and help us expand operations in the UK, Australia, and the Middle East.
      </p>

      <h2 className="text-2xl font-bold text-zinc-950 dark:text-zinc-50 mt-8 mb-4">
        Unifying Construction Software
      </h2>
      <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed mb-6">
        Our mission has always been to build a single, unified operating system for construction. By scaling our team, we will continue delivering automated solutions that eliminate manual redrawing, paperwork, and invoice discrepancies.
      </p>
    `
  },
  {
    title: "Reducing Concrete Wastage: Quantitative Analysis of Site Delivery Bottlenecks",
    category: "Research",
    date: "April 12, 2026",
    readTime: "7 min read",
    description: "Analyzing real-world telemetry from 150+ active jobsites to identify concrete pour coordination delays, logistics bottlenecks, and their fiscal impact.",
    image: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=600&auto=format&fit=crop&q=80",
    author: "Elena Rostova",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80",
    slug: "reducing-concrete-wastage-quantitative-analysis",
    content: `
      <p className="text-lg text-zinc-700 dark:text-zinc-300 leading-relaxed mb-6 font-medium">
        Concrete is the second most consumed material on Earth, but it is also one of the most wasted on construction jobsites. Our quantitative analysis of over 150 active jobsites reveals that pour delays are the leading cause of concrete wastage and cost overruns.
      </p>

      <h2 className="text-2xl font-bold text-zinc-950 dark:text-zinc-50 mt-8 mb-4">
        Logistics and Pour Coordination
      </h2>
      <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed mb-6">
        Concrete pours require precise timing. A delay of 30 minutes in truck delivery can cause concrete to set too early, leading to wasted batches. By coordinating logistics digitally, contractors can align deliveries with live site pour schedules, saving thousands per project.
      </p>
    `
  },
]
