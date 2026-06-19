import os
import re

learnmore_dir = r"c:\Users\charu\Documents\concolabs-com\src\app\learnmore"

for root, dirs, files in os.walk(learnmore_dir):
    for file in files:
        if file == "page.tsx":
            path = os.path.join(root, file)
            relative_path = os.path.relpath(path, learnmore_dir)
            with open(path, "r", encoding="utf-8") as f:
                content = f.read()
            
            # Let's search for "Back" button Link and the subsequent 10 lines
            # or search for "flex items-center gap-3" or similar
            matches = list(re.finditer(r"(BackLink|<Link\s+href=\"/learnmore\".*?>.*?Back.*?</Link>)", content, re.DOTALL))
            print(f"File: {relative_path}")
            if not matches:
                # search for simple Back link
                matches = list(re.finditer(r"Back", content))
            
            # Let's find occurrences of px-4 py-1.5 rounded-full, px-3 py-1 rounded-full, etc.
            badge_matches = list(re.finditer(r"(rounded-full.*?bg-lime/10|rounded-full.*?bg-black/5|rounded-full.*?bg-zinc-250|rounded-full.*?bg-zinc-150|rounded-full.*?bg-zinc-100|rounded-full.*?bg-primary/10)", content))
            for m in badge_matches:
                start = max(0, m.start() - 100)
                end = min(len(content), m.end() + 100)
                print(f"  Badge found around: {content[start:end]}\n---")
