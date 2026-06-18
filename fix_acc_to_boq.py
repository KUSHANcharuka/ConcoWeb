import sys

path = 'src/app/learnmore/acc-to-boq/page.tsx'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

old_str = "opacity: useTransform(scrollYProgress, [0.65, 0.75, 1, 1], [0, 1, 1, 1])"
new_str = "opacity: useTransform(scrollYProgress, [0.65, 0.75, 1], [0, 1, 1])"

if old_str in content:
    content = content.replace(old_str, new_str)
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)
    print("Fixed.")
else:
    print("Not found.")
