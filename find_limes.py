import os
import sys

# Set standard output encoding to utf-8
sys.stdout.reconfigure(encoding='utf-8')

learnmore_dir = r"c:\Users\charu\Documents\concolabs-com\src\app\learnmore"

# We want to find any text-lime that is not preceded by a high contrast light mode color like text-emerald or text-zinc or text-black.
# Also we want to find any other instances of text-lime or checkmarks.

with open(r"c:\Users\charu\Documents\concolabs-com\limes.txt", "w", encoding="utf-8") as out:
    for root, dirs, files in os.walk(learnmore_dir):
        for file in files:
            if file.endswith(".tsx"):
                path = os.path.join(root, file)
                rel = os.path.relpath(path, learnmore_dir)
                with open(path, "r", encoding="utf-8") as f:
                    lines = f.readlines()
                for idx, line in enumerate(lines):
                    # Search for text-lime
                    if "text-lime" in line:
                        out.write(f"{rel}:{idx+1}: {line.strip()}\n")
