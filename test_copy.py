import os
import shutil

src = r"C:\Users\charu\.gemini\antigravity-ide\brain\88735475-665d-4012-9646-d16293b7a89e"
dst = r"c:\Users\charu\Documents\concolabs-com\public\images"

print("Listing files in src:")
try:
    files = os.listdir(src)
    print("Files:", files)
except Exception as e:
    print("Error listing:", e)
    files = []

for file in files:
    if "revit_to_boq" in file or "glowing_digital_globe" in file or "bim_manager_avatar" in file:
        if file.endswith(".png"):
            src_file = os.path.join(src, file)
            # determine clean name
            if "mascot" in file:
                clean_name = "revit_to_boq_mascot.png"
            elif "globe" in file:
                clean_name = "glowing_digital_globe.png"
            elif "avatar" in file:
                clean_name = "bim_manager_avatar.png"
            elif "bottom_bg" in file:
                clean_name = "revit_to_boq_bottom_bg.png"
            else:
                clean_name = file
            
            dst_file = os.path.join(dst, clean_name)
            print(f"Copying {src_file} -> {dst_file}")
            try:
                shutil.copyfile(src_file, dst_file)
                print("Success")
            except Exception as e:
                print("Error:", e)
