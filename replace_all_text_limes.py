import os
import re

learnmore_dir = r"c:\Users\charu\Documents\concolabs-com\src\app\learnmore"

# We want to traverse all files in the learnmore directory (recursively, but skipping the main page.tsx of learnmore to avoid breaking SVGs there).
# Wait, let's double check if there are other TSX files directly in learnmore. Only page.tsx is directly in learnmore. So we skip any file that is named page.tsx and lies directly in learnmore_dir.

for root, dirs, files in os.walk(learnmore_dir):
    for file in files:
        if file.endswith(".tsx"):
            # Skip the main page.tsx
            if os.path.normpath(root) == os.path.normpath(learnmore_dir) and file == "page.tsx":
                print(f"Skipping main page: {file}")
                continue
                
            path = os.path.join(root, file)
            with open(path, "r", encoding="utf-8") as f:
                content = f.read()
                
            original = content
            
            # 1. Standalone text-lime (not preceded by dark:, group-hover:, selection:, focus:, etc.)
            # Match word boundary text-lime but not dark:text-lime or group-hover:text-lime
            # Replace it with text-emerald-600 dark:text-lime
            # Regex details: (?<![\w:-])text-lime\b
            # Let's replace "text-lime dark:text-lime" first (some templates might have it)
            content = content.replace("text-lime dark:text-lime", "text-emerald-600 dark:text-lime")
            content = re.sub(r'(?<![\w:-])text-lime\b', 'text-emerald-600 dark:text-lime', content)
            
            # 2. group-hover:text-lime
            # Replace with group-hover:text-emerald-600 dark:group-hover:text-lime
            content = re.sub(r'(?<![\w-])group-hover:text-lime\b', 'group-hover:text-emerald-600 dark:group-hover:text-lime', content)
            
            # 3. fill-lime (when not preceded by dark:, group-hover:)
            # Replace with fill-emerald-600 dark:fill-lime
            content = content.replace("fill-lime dark:fill-lime", "fill-emerald-600 dark:fill-lime")
            content = re.sub(r'(?<![\w:-])fill-lime\b', 'fill-emerald-600 dark:fill-lime', content)
            
            # 4. In case there is an icon like Check with text-lime:
            # Change text-lime inside <Check ...> to text-emerald-500
            # E.g. <Check className="w-12 h-12 text-lime mb-2 animate-bounce" />
            # Wait, our first regex already replaced text-lime inside <Check ...> to text-emerald-600 dark:text-lime, which is also fine, but if we want it to be text-emerald-500 or text-emerald-600, let's look:
            # If the class contains text-emerald-600 dark:text-lime inside Check, that's high contrast. But standardizing to text-emerald-500 is good too.
            # Let's replace any Check with text-lime or text-emerald-600 dark:text-lime to text-emerald-500
            
            if content != original:
                with open(path, "w", encoding="utf-8") as f:
                    f.write(content)
                print(f"Updated: {os.path.relpath(path, learnmore_dir)}")
            else:
                print(f"No change: {os.path.relpath(path, learnmore_dir)}")

print("All replacements completed.")
