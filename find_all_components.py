import os
import sys

# Set standard output encoding to utf-8
sys.stdout.reconfigure(encoding='utf-8')

learnmore_dir = r"c:\Users\charu\Documents\concolabs-com\src\app\learnmore"

for root, dirs, files in os.walk(learnmore_dir):
    for file in files:
        if file == "page.tsx":
            path = os.path.join(root, file)
            relative_path = os.path.relpath(path, learnmore_dir)
            with open(path, "r", encoding="utf-8") as f:
                content = f.read()
            
            lines = content.split('\n')
            print(f"========================================")
            print(f"FILE: {relative_path}")
            print(f"========================================")
            
            # Find Hero Badges
            back_idx = -1
            h1_idx = -1
            for i, line in enumerate(lines):
                if 'href="/learnmore"' in line or 'BackLink' in line or 'Link href="/learnmore"' in line:
                    back_idx = i
                if '<h1' in line or '<motion.h1' in line:
                    h1_idx = i
                    break
            
            if back_idx != -1 and h1_idx != -1 and h1_idx > back_idx:
                print("--- HERO BADGES ZONE ---")
                for idx in range(back_idx, h1_idx + 1):
                    print(f"  L{idx+1}: {lines[idx]}")
            
            # Find Checkmarks and Compare sections
            print("--- CHECKMARKS & text-lime INSTANCES ---")
            for i, line in enumerate(lines):
                if 'text-lime' in line or '<Check' in line:
                    print(f"  L{i+1}: {line.strip()}")
            print("\n")
