import re

with open('src/app/learnmore/auto-conversion-2d-to-3d/page.tsx', 'r', encoding='utf-8') as f:
    lines = f.readlines()

new_lines = []
for i, line in enumerate(lines):
    # Only replace text-lime if it's in a span or div (not an icon like <Check className="text-lime" />)
    if 'group-hover:text-lime' in line:
        line = line.replace('group-hover:text-lime', 'group-hover:text-zinc-600 dark:group-hover:text-zinc-300')
    
    if '<span' in line or '<div' in line:
        # Check if it contains text-lime but NOT if it's just a wrapper around an icon
        if 'text-lime' in line and not '<Check' in line and not '<Sparkles' in line and not '<Cpu' in line and not '<Cube' in line and not '<Play' in line and not 'text-lime shrink-0' in line and not 'rounded-full bg-lime/10 border border-lime/30 flex items-center justify-center text-lime' in line and not 'w-8 h-8 rounded-lg bg-lime/10 border border-lime/20 flex items-center justify-center text-lime' in line:
            line = line.replace('text-lime', 'text-zinc-900 dark:text-white')

    new_lines.append(line)

with open('src/app/learnmore/auto-conversion-2d-to-3d/page.tsx', 'w', encoding='utf-8') as f:
    f.writelines(new_lines)

print("Done replacing fonts.")
