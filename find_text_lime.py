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
            print(f"File: {relative_path}")
            for i, line in enumerate(lines):
                if 'text-lime' in line:
                    print(f"  L{i+1}: {line.strip()}")
            print("-" * 40)
