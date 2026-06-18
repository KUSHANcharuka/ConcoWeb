import sys

path = 'src/app/learnmore/acc-to-boq/page.tsx'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

old_str = '''                  <Button className="w-full rounded-xl px-8 py-6 font-bold cursor-pointer border-0 shadow-xl bg-[var(--color-lime)] text-black hover:bg-[var(--color-lime)]/90" asChild>
                    <a href="https://calendar.app.google/mCq7zBhXrDnEAJvB7" target="_blank" rel="noopener noreferrer">
                      Get Started
                    </a>
                  </Button>'''

new_str = '''                  <Button className="w-full rounded-xl px-8 py-6 font-bold cursor-pointer border-0 shadow-xl bg-[var(--color-lime)] text-black hover:bg-[var(--color-lime)]/90" asChild>
                    <Link href="/pricing">
                      Buy Products
                    </Link>
                  </Button>'''

if old_str in content:
    content = content.replace(old_str, new_str)
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)
    print("Successfully replaced.")
else:
    print("String not found. Please double-check the text.")
