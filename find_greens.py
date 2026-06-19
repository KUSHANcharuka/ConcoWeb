import os

learnmore_dir = r"c:\Users\charu\Documents\concolabs-com\src\app\learnmore"

with open(r"c:\Users\charu\Documents\concolabs-com\greens.txt", "w", encoding="utf-8") as out:
    for root, dirs, files in os.walk(learnmore_dir):
        for file in files:
            if file.endswith(".tsx"):
                # Skip the main page.tsx
                if os.path.normpath(root) == os.path.normpath(learnmore_dir) and file == "page.tsx":
                    continue
                path = os.path.join(root, file)
                rel = os.path.relpath(path, learnmore_dir)
                with open(path, "r", encoding="utf-8") as f:
                    lines = f.readlines()
                for idx, line in enumerate(lines):
                    if "emerald" in line:
                        out.write(f"{rel}:{idx+1}: {line.strip()}\n")
