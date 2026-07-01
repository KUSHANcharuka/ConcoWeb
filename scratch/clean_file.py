import os

file_path = r"c:\Users\charu\Documents\concolabs-com\src\app\learnmore\revit-to-boq\page.tsx"

with open(file_path, "r", encoding="utf-8") as f:
    lines = f.readlines()

# We want to keep lines up to line 694 (index 693 inclusive)
# and resume from line 873 (index 872 inclusive)
new_lines = lines[:694] + lines[872:]

with open(file_path, "w", encoding="utf-8") as f:
    f.writelines(new_lines)

print("Successfully cleaned file.")
