import sys

path = 'src/app/learnmore/acc-to-boq/page.tsx'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Button 1 (Hero)
old_1 = 'className="rounded-xl px-6 py-6 font-bold shadow-md cursor-pointer bg-yellow-400 text-black hover:bg-yellow-500 border-0"'
new_1 = 'className="rounded-xl px-8 py-6 font-bold cursor-pointer border-0 shadow-xl bg-[var(--color-lime)] text-black hover:bg-[var(--color-lime)]/90"'

# Button 2 (Pricing)
old_2 = 'className="w-full rounded-xl py-6 font-bold shadow-md bg-yellow-400 text-black hover:bg-yellow-500 cursor-pointer border-0"'
new_2 = 'className="w-full rounded-xl px-8 py-6 font-bold cursor-pointer border-0 shadow-xl bg-[var(--color-lime)] text-black hover:bg-[var(--color-lime)]/90"'

# Button 3 (Footer)
old_3 = 'className="rounded-full px-10 py-7 text-lg font-bold shadow-2xl bg-yellow-400 text-black hover:bg-yellow-500 cursor-pointer border-0"'
new_3 = 'className="rounded-xl px-8 py-6 font-bold cursor-pointer border-0 shadow-xl bg-[var(--color-lime)] text-black hover:bg-[var(--color-lime)]/90"'

count = 0
for old_s, new_s in [(old_1, new_1), (old_2, new_2), (old_3, new_3)]:
    if old_s in content:
        content = content.replace(old_s, new_s)
        count += 1
    else:
        print(f"Not found: {old_s[:40]}...")

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)

print(f"Replaced {count} instances.")
