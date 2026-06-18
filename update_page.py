import sys
path = 'src/app/learnmore/revit-to-boq/page.tsx'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

old_1 = '''            {/* Related Products */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}'''
new_1 = '''            {/* Related Products */}
            <motion.div
              id="product-suite"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}'''
content = content.replace(old_1, new_1)

old_2 = '''<Link href="/pricing">
                    Buy Products →
                  </Link>'''
new_2 = '''<a href="#product-suite" onClick={(e) => { e.preventDefault(); document.getElementById('product-suite')?.scrollIntoView({ behavior: 'smooth' }); }} className="flex items-center justify-center">show all products <ChevronDown className="w-4 h-4 ml-1" /></a>'''
content = content.replace(old_2, new_2)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated page.tsx")
