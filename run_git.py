import subprocess

try:
    res = subprocess.run(
        ["git", "status"], 
        cwd=r"c:\Users\charu\Documents\concolabs-com",
        capture_output=True, 
        text=True, 
        check=True
    )
    print("STDOUT:")
    print(res.stdout)
except Exception as e:
    print("Error:", e)
    if hasattr(e, 'stderr'):
        print("STDERR:")
        print(e.stderr)
