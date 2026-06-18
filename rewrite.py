import sys

path = 'src/app/learnmore/auto-conversion-2d-to-3d/page.tsx'
with open(path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

start_idx = -1
end_idx = -1

for i, line in enumerate(lines):
    if '// ─── 5. NODE-BASED WORKFLOW MAP (RECREATION) ───' in line:
        start_idx = i
    if start_idx != -1 and line.startswith('// ─── Main Page Component ───'):
        end_idx = i - 1
        break

if start_idx == -1 or end_idx == -1:
    print(f"Could not find bounds: {start_idx}, {end_idx}")
    sys.exit(1)

new_component = """// ─── 5. NODE-BASED WORKFLOW MAP (RECREATION) ───
function NodeBasedWorkflow() {
  return (
    <div className="w-full max-w-[1300px] mx-auto relative py-20 bg-[#0A0A0A] border border-zinc-800 rounded-[2.5rem] overflow-hidden shadow-2xl flex justify-center items-center my-16">
      
      {/* Background glow effects */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-[radial-gradient(circle_at_center,var(--color-lime)_0%,transparent_70%)] opacity-5 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[radial-gradient(circle_at_center,#3b82f6_0%,transparent_70%)] opacity-5 pointer-events-none" />

      {/* Responsive Canvas Container */}
      <div 
        className="relative shrink-0 transition-transform origin-center scale-[0.35] sm:scale-50 md:scale-[0.65] lg:scale-100 xl:scale-110" 
        style={{ width: '1200px', height: '750px' }}
      >
        <div className="absolute inset-0 w-full h-full">

          {/* SVG Connecting Lines */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
            <defs>
              <linearGradient id="line-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="var(--color-lime)" />
              </linearGradient>
              <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Base paths (darker) */}
            <g stroke="#1f2937" strokeWidth="2" fill="none">
              <path d="M 290 150 C 370 150, 370 200, 450 200" />
              <path d="M 690 200 C 780 200, 780 240, 880 240" />
              <path d="M 570 360 C 570 400, 530 400, 530 440" />
              <path d="M 1000 480 L 1000 400" />
              <path d="M 940 400 C 940 500, 800 500, 680 500" />
              <path d="M 680 600 L 800 600" />
            </g>

            {/* Animated glowing paths */}
            <g stroke="url(#line-grad)" strokeWidth="2.5" fill="none" filter="url(#glow)" strokeDasharray="10 20" className="animate-[dash_2s_linear_infinite]">
              <path d="M 290 150 C 370 150, 370 200, 450 200" />
              <path d="M 690 200 C 780 200, 780 240, 880 240" />
              <path d="M 570 360 C 570 400, 530 400, 530 440" />
              <path d="M 1000 480 L 1000 400" />
              <path d="M 940 400 C 940 500, 800 500, 680 500" />
              <path d="M 680 600 L 800 600" />
            </g>

            {/* Connection Dots */}
            <g fill="#3b82f6" filter="url(#glow)">
              <circle cx="290" cy="150" r="3" />
              <circle cx="450" cy="200" r="3" />
              <circle cx="690" cy="200" r="3" />
              <circle cx="880" cy="240" r="3" />
              <circle cx="570" cy="360" r="3" />
              <circle cx="530" cy="440" r="3" />
              <circle cx="1000" cy="480" r="3" />
              <circle cx="1000" cy="400" r="3" />
              <circle cx="940" cy="400" r="3" />
              <circle cx="680" cy="500" r="3" />
              <circle cx="680" cy="600" r="3" />
              <circle cx="800" cy="600" r="3" />
            </g>
          </svg>

          {/* Node A: Input */}
          <div className="absolute flex flex-col bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-[0_0_30px_rgba(249,115,22,0.1)] hover:border-orange-500/50 transition-colors z-10 group" style={{ width: 240, height: 280, left: 50, top: 50 }}>
            <div className="absolute inset-0 bg-gradient-to-tr from-orange-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="p-3 border-b border-zinc-800 flex items-center gap-2 bg-zinc-900/90 z-10">
              <FileText className="w-3.5 h-3.5 text-orange-400" />
              <span className="text-[10px] font-bold text-zinc-300">Input Source</span>
            </div>
            <div className="p-3 flex-1 flex flex-col gap-2 z-10 bg-zinc-900">
              <div className="w-full h-36 bg-zinc-800 rounded-lg overflow-hidden relative">
                <img src="/images/2d_structural_drawing.png" alt="2D Plan" className="w-full h-full object-cover opacity-80" />
              </div>
              <div className="flex gap-2 h-16">
                <div className="w-1/3 bg-zinc-800 rounded-lg overflow-hidden opacity-50"><img src="/images/2d_structural_drawing.png" alt="2D Plan" className="w-full h-full object-cover" /></div>
                <div className="w-1/3 bg-zinc-800 rounded-lg overflow-hidden opacity-50"><img src="/images/2d_structural_drawing.png" alt="2D Plan" className="w-full h-full object-cover" /></div>
                <div className="w-1/3 bg-zinc-800 rounded-lg flex items-center justify-center text-xs font-bold text-zinc-400">
                  +15
                </div>
              </div>
            </div>
          </div>

          {/* Node B: AI Segmentation */}
          <div className="absolute flex flex-col bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-[0_0_30px_rgba(59,130,246,0.1)] hover:border-blue-500/50 transition-colors z-10 group" style={{ width: 240, height: 240, left: 450, top: 120 }}>
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="p-3 border-b border-zinc-800 flex items-center gap-2 bg-zinc-900/90 z-10">
              <Cpu className="w-3.5 h-3.5 text-blue-400" />
              <span className="text-[10px] font-bold text-zinc-300">AI Segmentation</span>
            </div>
            <div className="p-3 flex-1 z-10 bg-zinc-900">
              <div className="w-full h-full bg-zinc-800 rounded-lg overflow-hidden relative">
                <img src="/images/cv_blueprint_analysis.png" alt="AI Analysis" className="w-full h-full object-cover" />
                {/* Simulated bounding boxes over the image */}
                <div className="absolute inset-0 bg-blue-500/10 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Node C: Generate 3D */}
          <div className="absolute flex flex-col bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-[0_0_30px_rgba(211,253,80,0.05)] hover:border-lime/50 transition-colors z-10 group" style={{ width: 240, height: 240, left: 880, top: 160 }}>
            <div className="absolute inset-0 bg-gradient-to-tr from-[var(--color-lime)]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="p-3 border-b border-zinc-800 flex items-center gap-2 bg-zinc-900/90 z-10">
              <Cube className="w-3.5 h-3.5 text-[var(--color-lime)]" />
              <span className="text-[10px] font-bold text-zinc-300">Extrude Geometry</span>
            </div>
            <div className="p-3 flex-1 z-10 bg-zinc-900">
              <div className="w-full h-full bg-zinc-800 rounded-lg overflow-hidden relative">
                <img src="/images/3d_revit_model.png" alt="3D Geometry" className="w-full h-full object-cover opacity-80" />
              </div>
            </div>
          </div>

          {/* Node D: BIM Config */}
          <div className="absolute flex flex-col bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden shadow-lg z-10" style={{ width: 200, height: 180, left: 920, top: 480 }}>
            <div className="p-3 border-b border-zinc-800 flex items-center gap-2 bg-zinc-900/90">
              <Sliders className="w-3.5 h-3.5 text-zinc-400" />
              <span className="text-[10px] font-bold text-zinc-300">BIM Properties</span>
            </div>
            <div className="p-4 flex-1 flex flex-col justify-center gap-3 text-[11px] bg-zinc-950">
              <div className="flex justify-between items-center">
                <span className="text-zinc-500">Thickness</span>
                <span className="bg-zinc-800 px-2 py-0.5 rounded text-white font-mono">200mm</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-zinc-500">Material</span>
                <span className="bg-zinc-800 px-2 py-0.5 rounded text-white font-mono">Concrete</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-zinc-500">Level</span>
                <span className="bg-zinc-800 px-2 py-0.5 rounded text-white font-mono">L01</span>
              </div>
            </div>
          </div>

          {/* Node E: Output Project Folder */}
          <div className="absolute flex flex-col bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-[0_0_30px_rgba(211,253,80,0.1)] hover:border-[var(--color-lime)]/50 transition-colors z-10 group" style={{ width: 300, height: 220, left: 380, top: 440 }}>
            <div className="absolute -inset-20 bg-gradient-to-tr from-[var(--color-lime)]/5 via-transparent to-transparent opacity-50 pointer-events-none" />
            <div className="p-3 flex-1 flex gap-2 z-10 bg-zinc-900/80">
              <div className="w-1/2 h-full bg-zinc-800 rounded-lg overflow-hidden relative border border-zinc-700/50">
                <img src="/images/3d_revit_model.png" alt="Revit Main" className="w-full h-full object-cover" />
                <div className="absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-black/80 to-transparent">
                  <span className="text-[9px] font-bold text-white block">Main Structure</span>
                </div>
              </div>
              <div className="w-1/2 h-full flex flex-col gap-2">
                <div className="h-1/2 bg-zinc-800 rounded-lg overflow-hidden relative border border-zinc-700/50">
                   <img src="/images/3d_revit_model.png" alt="Revit View 2" className="w-[150%] h-[150%] max-w-none -ml-4 -mt-2 object-cover opacity-60" />
                </div>
                <div className="h-1/2 bg-zinc-800 rounded-lg flex items-center justify-center text-xs font-bold text-zinc-400 border border-zinc-700/50">
                   +3 Views
                </div>
              </div>
            </div>
            <div className="p-3 border-t border-zinc-800 bg-zinc-950 z-10 flex justify-between items-center">
              <span className="text-[11px] font-bold text-zinc-300">Phase 1 Delivery</span>
              <Folder className="w-3.5 h-3.5 text-zinc-500" />
            </div>
          </div>

          {/* Node F: Action Button */}
          <button className="absolute flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-full shadow-[0_0_20px_rgba(37,99,235,0.4)] transition-all z-20 cursor-pointer" style={{ width: 160, height: 48, left: 800, top: 576 }}>
            <Download className="w-4 h-4" />
            <span className="text-sm">Export Model</span>
          </button>

        </div>
      </div>
    </div>
  );
}
"""

lines = lines[:start_idx] + [new_component + '\n'] + lines[end_idx:]

with open(path, 'w', encoding='utf-8') as f:
    f.writelines(lines)

print("Workflow replaced successfully.")
