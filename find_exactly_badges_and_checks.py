import os
import sys
import re

sys.stdout.reconfigure(encoding='utf-8')

learnmore_dir = r"c:\Users\charu\Documents\concolabs-com\src\app\learnmore"
files_to_scan = []

for root, dirs, files in os.walk(learnmore_dir):
    for file in files:
        if file == "page.tsx":
            path = os.path.join(root, file)
            files_to_scan.append(path)

for path in sorted(files_to_scan):
    rel_path = os.path.relpath(path, learnmore_dir)
    print(f"\n========================================\nFILE: {rel_path}\n========================================")
    
    with open(path, "r", encoding="utf-8") as f:
        lines = f.readlines()
    
    # 1. Look for Hero Badges
    # We want to identify the block that contains badges immediately after the back link.
    # Typically, the back button is a Link containing ArrowLeft or text "Back" or "Back to Learn More".
    # And then we have a gap-3 or flex container with rounded-full spans representing tags before H1.
    back_idx = -1
    h1_idx = -1
    for idx, line in enumerate(lines):
        if 'href="/learnmore"' in line or 'BackLink' in line:
            back_idx = idx
        if '<h1' in line or '<motion.h1' in line:
            h1_idx = idx
            break
            
    if back_idx != -1 and h1_idx != -1 and h1_idx > back_idx:
        print("Hero Badge Candidates:")
        found_badge = False
        # Search for flex/motion.div containing rounded-full and bg-lime/10 or bg-zinc- or bg-black or similar
        i = back_idx
        while i < h1_idx:
            line = lines[i]
            if 'rounded-full' in line and ('bg-lime/10' in line or 'bg-zinc-' in line or 'bg-black/' in line or 'bg-white/' in line or 'bg-primary/' in line or 'bg-lime/25' in line):
                # Let's trace upwards to find the container div start
                container_start = i
                while container_start > back_idx:
                    if 'className="flex' in lines[container_start] or 'className={`flex' in lines[container_start] or 'className="hidden sm:inline-flex' in lines[container_start] or 'variants={fadeInUp}' in lines[container_start] or '<motion.div' in lines[container_start] or '<div' in lines[container_start]:
                        break
                    container_start -= 1
                
                # Let's trace downwards to find the container div end or span end
                # We can print the block around this
                start_print = max(back_idx, container_start - 2)
                end_print = min(h1_idx, i + 8)
                print(f"  Line range: {start_print+1} to {end_print}")
                for print_idx in range(start_print, end_print):
                    print(f"    L{print_idx+1}: {lines[print_idx].rstrip()}")
                found_badge = True
                i = end_print # skip forward
            i += 1
        if not found_badge:
            print("  None found")
    else:
        print("Hero Badge Candidates: Could not determine back_idx/h1_idx")
        
    # 2. Look for Comparison Checkmarks
    # Checkmarks inside the "Compare Workflows" or before/after switcher
    print("Checkmarks in file:")
    for idx, line in enumerate(lines):
        if '<Check' in line or 'Check className' in line:
            print(f"  L{idx+1}: {line.strip()}")
            
    # 3. Look for other text-lime occurrences
    print("Other text-lime lines:")
    for idx, line in enumerate(lines):
        if 'text-lime' in line:
            print(f"  L{idx+1}: {line.strip()}")
