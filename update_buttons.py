import sys

path = 'src/app/learnmore/acc-to-boq/page.tsx'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

old_btn_1 = """                <Button
                  asChild
                  size="lg"
                  className="rounded-xl px-6 py-6 font-bold shadow-md cursor-pointer bg-blue-600 hover:bg-blue-700 text-white border-none"
                >
                  <a
                    href="https://calendar.app.google/mCq7zBhXrDnEAJvB7"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    Book a demo →
                  </a>
                </Button>"""

new_btn_1 = """                <Button
                  asChild
                  size="lg"
                  className="rounded-xl px-6 py-6 font-bold shadow-md cursor-pointer bg-yellow-400 text-black hover:bg-yellow-500 border-0"
                >
                  <a
                    href="https://calendar.app.google/mCq7zBhXrDnEAJvB7"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    Book a demo →
                  </a>
                </Button>"""

old_btn_2 = """          <div className="pt-4 flex justify-center">
            <Button
              asChild
              size="lg"
              className="rounded-full px-10 py-7 text-lg font-bold shadow-2xl bg-white text-blue-600 hover:bg-blue-50 cursor-pointer"
            >
              <a
                href="https://calendar.app.google/mCq7zBhXrDnEAJvB7"
                target="_blank"
                rel="noopener noreferrer"
              >
                Book a demo →
              </a>
            </Button>
          </div>"""

new_btn_2 = """          <div className="pt-4 flex justify-center">
            <Button
              asChild
              size="lg"
              className="rounded-full px-10 py-7 text-lg font-bold shadow-2xl bg-yellow-400 text-black hover:bg-yellow-500 cursor-pointer border-0"
            >
              <a
                href="https://calendar.app.google/mCq7zBhXrDnEAJvB7"
                target="_blank"
                rel="noopener noreferrer"
              >
                Book a demo →
              </a>
            </Button>
          </div>"""

old_btn_3 = """                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white border-none shadow-sm cursor-pointer" asChild>
                    <a href="https://calendar.app.google/mCq7zBhXrDnEAJvB7" target="_blank" rel="noopener noreferrer">
                      Get Started
                    </a>
                  </Button>"""

new_btn_3 = """                  <Button className="w-full rounded-xl py-6 font-bold shadow-md bg-yellow-400 text-black hover:bg-yellow-500 cursor-pointer border-0" asChild>
                    <a href="https://calendar.app.google/mCq7zBhXrDnEAJvB7" target="_blank" rel="noopener noreferrer">
                      Get Started
                    </a>
                  </Button>"""

count = 0
if old_btn_1 in content:
    content = content.replace(old_btn_1, new_btn_1)
    count += 1
if old_btn_2 in content:
    content = content.replace(old_btn_2, new_btn_2)
    count += 1
if old_btn_3 in content:
    content = content.replace(old_btn_3, new_btn_3)
    count += 1

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
print(f"Replaced {count} instances.")
