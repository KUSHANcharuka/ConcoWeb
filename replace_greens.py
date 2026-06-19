import os
import re

learnmore_dir = r"c:\Users\charu\Documents\concolabs-com\src\app\learnmore"

# List of files we want to edit: all TSX files in subdirectories of learnmore.
# Skip the main page.tsx of learnmore.

for root, dirs, files in os.walk(learnmore_dir):
    for file in files:
        if file.endswith(".tsx"):
            # Skip the main page.tsx
            if os.path.normpath(root) == os.path.normpath(learnmore_dir) and file == "page.tsx":
                continue
                
            path = os.path.join(root, file)
            with open(path, "r", encoding="utf-8") as f:
                content = f.read()
                
            original = content
            
            # Perform specific replacements for text elements
            
            # Taglines: text-emerald-600 dark:text-lime font-bold -> text-zinc-950 dark:text-white font-bold
            content = content.replace("text-emerald-600 dark:text-lime font-bold", "text-zinc-950 dark:text-white font-bold")
            
            # Subheading labels in comparisons, bentos:
            content = content.replace("text-xs font-bold text-emerald-600 dark:text-lime uppercase tracking-wider", "text-xs font-bold text-zinc-900 dark:text-zinc-300 uppercase tracking-wider")
            content = content.replace("text-[9px] font-bold text-emerald-600 dark:text-lime uppercase tracking-widest block", "text-[9px] font-bold text-zinc-600 dark:text-zinc-400 uppercase tracking-widest block")
            content = content.replace("text-[9px] font-bold uppercase tracking-widest text-emerald-600 dark:text-lime", "text-[9px] font-bold uppercase tracking-widest text-zinc-650 dark:text-zinc-400")
            content = content.replace("text-[6px] text-emerald-600 dark:text-lime font-black uppercase tracking-wider", "text-[6px] text-zinc-950 dark:text-white font-black uppercase tracking-wider")
            content = content.replace("text-xs font-bold text-emerald-600 dark:text-lime uppercase tracking-widest block", "text-xs font-bold text-zinc-600 dark:text-zinc-400 uppercase tracking-widest block")
            content = content.replace("text-xs font-bold text-emerald-600 dark:text-lime uppercase tracking-widest", "text-xs font-bold text-zinc-600 dark:text-zinc-400 uppercase tracking-widest")
            
            # Hover states:
            content = content.replace("group-hover:text-emerald-600 dark:group-hover:text-lime", "group-hover:text-zinc-955 dark:group-hover:text-white")
            
            # Specific elements:
            # acc-to-boq list item font-bold
            content = content.replace("text-emerald-600 dark:text-emerald-400 text-sm items-start bg-white/40 dark:bg-zinc-800/40 p-3 rounded-xl border border-white/60 dark:border-zinc-700/50 font-bold", "text-zinc-900 dark:text-zinc-100 text-sm items-start bg-white/40 dark:bg-zinc-800/40 p-3 rounded-xl border border-white/60 dark:border-zinc-700/50 font-bold")
            # pricing text
            content = content.replace("font-bold text-emerald-600 dark:text-lime", "font-bold text-zinc-950 dark:text-white")
            # Scene description text in 2d to 3d
            content = content.replace("text-emerald-600 dark:text-lime font-black", "text-zinc-950 dark:text-white font-black")
            # Clause reference in builderbot
            content = content.replace("text-xs font-bold text-emerald-600 dark:text-lime mb-1 block", "text-xs font-bold text-zinc-600 dark:text-zinc-400 mb-1 block")
            # builderbot engine
            content = content.replace("text-xs text-emerald-600 dark:text-lime uppercase tracking-widest font-bold", "text-xs text-zinc-600 dark:text-zinc-400 uppercase tracking-widest font-bold")
            # erp model efficiency label color
            content = content.replace('"text-emerald-600 dark:text-lime"', '"text-zinc-900 dark:text-white"')
            # erp posted label text
            content = content.replace("text-emerald-600 dark:text-lime font-bold", "text-zinc-950 dark:text-white font-bold")
            # measureonair active label background and text
            content = content.replace("text-emerald-600 dark:text-lime bg-lime/10 px-2 py-0.5 rounded", "text-zinc-900 dark:text-white bg-zinc-150 dark:bg-zinc-800 px-2 py-0.5 rounded")
            # measureonair explore link text
            content = content.replace("text-[10px] font-semibold text-emerald-600 dark:text-lime", "text-[10px] font-semibold text-zinc-900 dark:text-zinc-300")
            content = content.replace("text-emerald-600 dark:text-lime transition-transform group-hover:translate-x-0.5", "text-zinc-900 dark:text-zinc-300 transition-transform group-hover:translate-x-0.5")
            # revit-to-boq identified tag bg/text
            content = content.replace("bg-lime/10 text-emerald-600 dark:text-lime rounded text-[10px]", "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-300 rounded text-[10px]")
            # wordtobim BIM text
            content = content.replace('<span className="text-emerald-600 dark:text-lime">BIM.</span>', '<span className="text-zinc-950 dark:text-white font-bold">BIM.</span>')
            
            # Active FAQ background and text toggles:
            content = content.replace('activeFaq === idx ? "bg-lime/20 dark:bg-zinc-800 text-emerald-600 dark:text-lime"', 'activeFaq === idx ? "bg-zinc-900 dark:bg-white text-white dark:text-black"')
            content = content.replace('activeFaq === idx ? "bg-lime/20 dark:bg-zinc-800 text-emerald-600 dark:text-lime" : "bg-zinc-100 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-500"', 'activeFaq === idx ? "bg-zinc-900 dark:bg-white text-white dark:text-black" : "bg-zinc-100 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-500"')
            content = content.replace('activeFaq === i ? "bg-lime/20 text-emerald-600 dark:text-lime"', 'activeFaq === i ? "bg-zinc-900 dark:bg-white text-white dark:text-black"')
            content = content.replace('activeFaq === i ? "bg-lime/20 dark:bg-zinc-800 text-emerald-600 dark:text-lime"', 'activeFaq === i ? "bg-zinc-900 dark:bg-white text-white dark:text-black"')
            
            # Icons and indicator general mapping:
            # Replaces general icon text-emerald-600 dark:text-lime to text-zinc-900 dark:text-zinc-300
            # E.g. Play icons, Cloud, Zap, Smartphone, ExternalLink, Bot, PencilRuler, Lock, Sparkles
            content = re.sub(r'text-emerald-600 dark:text-lime\b', 'text-zinc-900 dark:text-zinc-300', content)
            content = re.sub(r'fill-emerald-600 dark:fill-lime\b', 'fill-zinc-900 dark:fill-zinc-300', content)

            if content != original:
                with open(path, "w", encoding="utf-8") as f:
                    f.write(content)
                print(f"Updated: {os.path.relpath(path, learnmore_dir)}")
            else:
                print(f"No change: {os.path.relpath(path, learnmore_dir)}")

print("All replacements completed.")
