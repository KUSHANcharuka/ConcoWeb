import os
import sys

# Set standard output encoding to utf-8
sys.stdout.reconfigure(encoding='utf-8')

learnmore_dir = r"c:\Users\charu\Documents\concolabs-com\src\app\learnmore"

def modify_file(rel_path, replacements):
    path = os.path.join(learnmore_dir, rel_path)
    if not os.path.exists(path):
        print(f"File not found: {path}")
        return
        
    with open(path, "r", encoding="utf-8") as f:
        content = f.read()
        
    original = content
    for old, new in replacements:
        if old in content:
            content = content.replace(old, new)
            print(f"  Successfully replaced block in {rel_path}")
        else:
            # Let's clean up whitespace variations just in case
            print(f"  Warning: Target block not found in {rel_path}:")
            print(f"    {repr(old[:60])}...")
            
    if content != original:
        with open(path, "w", encoding="utf-8") as f:
            f.write(content)
        print(f"  Saved changes to {rel_path}")
    else:
        print(f"  No changes made to {rel_path}")

print("Applying fixes...")

# 1. 2D Drawing to BOQ
modify_file("2d-drawing-to-boq/page.tsx", [
    (
        '''                <motion.div variants={fadeInUp} className="flex items-center gap-3">
                  <span className="px-4 py-1.5 rounded-full text-xs font-bold bg-lime/10 border border-lime/30 text-zinc-900 dark:text-white backdrop-blur-md">
                    Estimation &amp; Tendering
                  </span>
                </motion.div>''',
        ''
    ),
    (
        '<Check className="w-5 h-5 text-lime shrink-0 mt-0.5" />',
        '<Check className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />'
    ),
    (
        '<span className="text-lime dark:text-lime font-bold">No 3D model required.</span>',
        '<span className="text-emerald-600 dark:text-lime font-bold">No 3D model required.</span>'
    )
])

# 2. ACC to BOQ
modify_file("acc-to-boq/page.tsx", [
    (
        '''              <div className="flex items-center gap-3">
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-lime/10 text-zinc-900 dark:text-white border border-lime/30">
                  Tendering
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-500 dark:text-zinc-400">
                  UK & Australia
                </span>
              </div>''',
        ''
    ),
    (
        '<div className="text-xs font-bold text-lime uppercase tracking-wider">',
        '<div className="text-xs font-bold text-emerald-600 dark:text-lime uppercase tracking-wider">'
    ),
    (
        '<Check className="w-4 h-4 text-lime shrink-0 mt-0.5" />',
        '<Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />'
    ),
    (
        '<Check className="w-4 h-4 text-lime" />',
        '<Check className="w-4 h-4 text-emerald-500" />'
    ),
    (
        '<li className="flex gap-3 text-lime text-sm items-start bg-white/40 dark:bg-zinc-800/40 p-3 rounded-xl border border-white/60 dark:border-zinc-700/50 font-bold">',
        '<li className="flex gap-3 text-emerald-600 dark:text-emerald-400 text-sm items-start bg-white/40 dark:bg-zinc-800/40 p-3 rounded-xl border border-white/60 dark:border-zinc-700/50 font-bold">'
    ),
    (
        '<span className="font-bold text-lime">USD 1,200/month</span>',
        '<span className="font-bold text-emerald-600 dark:text-lime">USD 1,200/month</span>'
    )
])

# 3. Auto Conversion 2D to 3D
modify_file("auto-conversion-2d-to-3d/page.tsx", [
    (
        '<Check className="w-4 h-4 text-lime" />',
        '<Check className="w-4 h-4 text-emerald-500" />'
    )
])

# 4. Auto Reinforcement
modify_file("auto-reinforcement/page.tsx", [
    (
        '''                <motion.div variants={fadeInUp} className="flex items-center gap-3">
                  <span className="px-4 py-1.5 rounded-full text-xs font-bold bg-lime/10 border border-lime/30 text-zinc-900 dark:text-white backdrop-blur-md">
                    Estimation & Detail
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-zinc-100/50 dark:bg-white/5 border border-zinc-205 dark:border-white/10 text-zinc-600 dark:text-zinc-300">
                    UAE & Australia
                  </span>
                </motion.div>''',
        ''
    ),
    (
        '<span className="text-lime font-bold">Automatically.</span>',
        '<span className="text-emerald-600 dark:text-lime font-bold">Automatically.</span>'
    ),
    (
        '<div className="text-xs font-bold text-lime uppercase tracking-wider">',
        '<div className="text-xs font-bold text-emerald-600 dark:text-lime uppercase tracking-wider">'
    ),
    (
        '<Check className="w-4 h-4 text-lime shrink-0 mt-0.5" />',
        '<Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />'
    )
])

# 5. BuilderBot
modify_file("builderbot/page.tsx", [
    (
        '''          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: appleEase, delay: 0.1 }}
            className="flex justify-center"
          >
            <span className="px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase bg-black/5 dark:bg-white/10 backdrop-blur-md text-zinc-800 dark:text-zinc-200 flex items-center gap-2">
              <Scale className="w-3 h-3 text-lime" /> Contract Management
            </span>
          </motion.div>''',
        ''
    ),
    (
        '<span className="text-xs font-bold text-lime mb-1 block">Clause Reference: FIDIC Sub-Clause 8.4</span>',
        '<span className="text-xs font-bold text-emerald-600 dark:text-lime mb-1 block">Clause Reference: FIDIC Sub-Clause 8.4</span>'
    ),
    (
        '<Check className="w-5 h-5 text-lime shrink-0 mt-0.5" />',
        '<Check className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />'
    ),
    (
        '<Check className="w-4 h-4 text-lime" />',
        '<Check className="w-4 h-4 text-emerald-500" />'
    )
])

# 6. BuildMarketlk
modify_file("buildmarketlk/page.tsx", [
    (
        '''          {/* Tag / Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: appleEase }}
          >
            <span className="px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase bg-lime/25 border border-lime/30 text-zinc-800 dark:text-zinc-200 flex items-center gap-2 shadow-xs">
              <Store className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-400" /> Operations / Marketplace
            </span>
          </motion.div>''',
        ''
    )
])

# 7. BuildMonitor
modify_file("buildmonitor/page.tsx", [
    (
        '''          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: appleEase, delay: 0.1 }}
            className="flex justify-center"
          >
            <span className="px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase bg-black/5 dark:bg-white/10 backdrop-blur-md text-zinc-800 dark:text-zinc-200">
              Stage: Construction
            </span>
          </motion.div>''',
        ''
    )
])

# 8. Cost Plan Calculator
modify_file("cost-plan-calculator/page.tsx", [
    (
        '''              <div className="flex items-center gap-3">
                <span className="px-4 py-1.5 rounded-full text-xs font-bold bg-lime/10 border border-lime/30 text-zinc-900 dark:text-white backdrop-blur-md">
                  Pre-design
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-zinc-150/80 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-550 dark:text-zinc-400">
                  QS Firms &amp; Cost Consultancies
                </span>
              </div>''',
        ''
    ),
    (
        '<div className="text-xs font-bold text-lime uppercase tracking-wider">',
        '<div className="text-xs font-bold text-emerald-600 dark:text-lime uppercase tracking-wider">'
    ),
    (
        '<Check className="w-5 h-5 text-lime shrink-0 mt-0.5" />',
        '<Check className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />'
    )
])

# 9. ERP Automations
modify_file("erp-automations/page.tsx", [
    (
        '''                <motion.div variants={fadeInUp} className="flex items-center gap-3">
                  <span className="px-4 py-1.5 rounded-full text-xs font-bold bg-lime/10 border border-lime/30 text-zinc-900 dark:text-white backdrop-blur-md">
                    Operations
                  </span>
                  <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-zinc-250/50 dark:bg-zinc-800 border border-zinc-350 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400">
                    Global
                  </span>
                </motion.div>''',
        ''
    ),
    (
        '<span className="text-lime dark:text-lime font-bold">Automated end-to-end.</span>',
        '<span className="text-emerald-600 dark:text-lime font-bold">Automated end-to-end.</span>'
    ),
    (
        '{ label: "Model Efficiency", value: "99.4%", color: "text-lime" },',
        '{ label: "Model Efficiency", value: "99.4%", color: "text-emerald-600 dark:text-lime" },'
    ),
    (
        '<ArrowRight className="w-3 h-3 text-lime shrink-0" />',
        '<ArrowRight className="w-3 h-3 text-emerald-600 dark:text-lime shrink-0" />'
    ),
    (
        '<span className="text-lime font-bold">ERP Posted ✓</span>',
        '<span className="text-emerald-600 dark:text-lime font-bold">ERP Posted ✓</span>'
    ),
    (
        '<Icon className={`w-7 h-7 ${highlight ? "text-zinc-950" : "text-lime"}`} />',
        '<Icon className={`w-7 h-7 ${highlight ? "text-zinc-950" : "text-emerald-600 dark:text-lime"}`} />'
    )
])

# 10. Hand Drawn to AutoCAD
modify_file("hand-drawn-to-autocad/page.tsx", [
    (
        '''                <motion.div variants={fadeInUp} className="flex items-center gap-3">
                  <span className="px-4 py-1.5 rounded-full text-xs font-bold bg-primary/10 border border-primary/20 text-primary">
                    Design
                  </span>
                  <span className="px-4 py-1.5 rounded-full text-xs font-bold bg-zinc-200/50 border border-zinc-300 text-zinc-600">
                    UK & Australia
                  </span>
                </motion.div>''',
        ''
    )
])

# 11. MeasureonAir
modify_file("measureonair/page.tsx", [
    (
        '''                <motion.div variants={fadeInUp} className="flex items-center gap-3">
                  <span className="px-4 py-1.5 rounded-full text-xs font-bold bg-lime/10 border border-lime/30 text-zinc-900 dark:text-white backdrop-blur-md">
                    Construction Stage
                  </span>
                  <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-zinc-250/50 dark:bg-zinc-800 border border-zinc-350 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400">
                    <MapPin className="w-3.5 h-3.5 text-lime" />
                    Middle East · Sri Lanka
                  </span>
                </motion.div>''',
        ''
    ),
    (
        '<span className="text-lime dark:text-lime font-bold">One continuous workflow.</span>',
        '<span className="text-emerald-600 dark:text-lime font-bold">One continuous workflow.</span>'
    ),
    (
        '<Smartphone className="w-4 h-4 text-lime" />',
        '<Smartphone className="w-4 h-4 text-emerald-600 dark:text-lime" />'
    ),
    (
        '<span className="text-[10px] font-semibold text-lime">Explore</span>',
        '<span className="text-[10px] font-semibold text-emerald-600 dark:text-lime">Explore</span>'
    ),
    (
        '<ChevronRight className="w-3 h-3 text-lime transition-transform group-hover:translate-x-0.5" />',
        '<ChevronRight className="w-3 h-3 text-emerald-600 dark:text-lime transition-transform group-hover:translate-x-0.5" />'
    ),
    (
        '<Smartphone className="w-5 h-5 text-lime" />',
        '<Smartphone className="w-5 h-5 text-emerald-600 dark:text-lime" />'
    ),
    (
        '<FileSearch className="w-3.5 h-3.5 text-lime" />',
        '<FileSearch className="w-3.5 h-3.5 text-emerald-600 dark:text-lime" />'
    ),
    (
        '<ShieldCheck className="w-3.5 h-3.5 text-lime" />',
        '<ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-lime" />'
    )
])

# 12. Revit to BOQ
modify_file("revit-to-boq/page.tsx", [
    (
        '''                <motion.div variants={fadeInUp} className="flex items-center gap-3">
                  <span className="px-4 py-1.5 rounded-full text-xs font-bold bg-lime/10 border border-lime/30 text-zinc-900 dark:text-white backdrop-blur-md">
                    Tendering & Estimation
                  </span>
                  <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-zinc-250/50 dark:bg-zinc-800 border border-zinc-350 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400">
                    Revit Plugin · Middle East & Sri Lanka
                  </span>
                </motion.div>''',
        ''
    ),
    (
        '<span className="text-lime dark:text-lime font-bold">Automated quantity mapping.</span>',
        '<span className="text-emerald-600 dark:text-lime font-bold">Automated quantity mapping.</span>'
    ),
    (
        '<span className="text-[10px] font-semibold text-lime">Explore</span>',
        '<span className="text-[10px] font-semibold text-emerald-600 dark:text-lime">Explore</span>'
    ),
    (
        '<ChevronRight className="w-3 h-3 text-lime transition-transform group-hover:translate-x-0.5" />',
        '<ChevronRight className="w-3 h-3 text-emerald-600 dark:text-lime transition-transform group-hover:translate-x-0.5" />'
    )
])

# 13. Tender Evaluations
modify_file("tender-evaluations/page.tsx", [
    (
        '''                <motion.div variants={fadeInUp} className="flex items-center gap-3">
                  <span className="px-4 py-1.5 rounded-full text-xs font-bold bg-lime/10 border border-lime/30 text-zinc-900 dark:text-white backdrop-blur-md">
                    Tendering & Intake
                  </span>
                  <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-zinc-250/50 dark:bg-zinc-800 border border-zinc-350 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400">
                    Middle East · Sri Lanka
                  </span>
                </motion.div>''',
        ''
    ),
    (
        '<span className="text-lime dark:text-lime font-bold">No manual data entry.</span>',
        '<span className="text-emerald-600 dark:text-lime font-bold">No manual data entry.</span>'
    ),
    (
        '<span className="text-[10px] font-semibold text-lime">Explore</span>',
        '<span className="text-[10px] font-semibold text-emerald-600 dark:text-lime">Explore</span>'
    ),
    (
        '<ChevronRight className="w-3 h-3 text-lime transition-transform group-hover:translate-x-0.5" />',
        '<ChevronRight className="w-3 h-3 text-emerald-600 dark:text-lime transition-transform group-hover:translate-x-0.5" />'
    )
])

# 14. Word to BIM
modify_file("wordtobim/page.tsx", [
    (
        '<Check className="w-5 h-5 text-lime shrink-0" />',
        '<Check className="w-5 h-5 text-emerald-500 shrink-0" />'
    ),
    (
        '<Check className="w-3.5 h-3.5 text-lime" />',
        '<Check className="w-3.5 h-3.5 text-emerald-500" />'
    ),
    (
        '${activeFaq === idx ? "bg-lime/20 dark:bg-zinc-800 text-lime dark:text-lime" : "bg-zinc-100 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-500"}',
        '${activeFaq === idx ? "bg-lime/20 dark:bg-zinc-800 text-emerald-600 dark:text-lime" : "bg-zinc-100 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-500"}'
    )
])

print("Fixes execution finished.")
