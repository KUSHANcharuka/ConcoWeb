import sys

path = 'src/app/learnmore/acc-to-boq/page.tsx'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. State Variables
old_state = '''  // Video Lightbox State
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [videoPassword, setVideoPassword] = useState("");
  const [isVideoUnlocked, setIsVideoUnlocked] = useState(false);
  const [passwordError, setPasswordError] = useState(false);'''
new_state = ''

# 2. handleVideoUnlock
old_func = '''  const handleVideoUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple mockup password check
    if (videoPassword.length > 3) {
      setIsVideoUnlocked(true);
      setPasswordError(false);
    } else {
      setPasswordError(true);
    }
  };'''
new_func = ''

# 3. Watch Demo Button
old_btn = '''                <Button
                  onClick={() => setIsVideoOpen(true)}
                  variant="outline"
                  size="lg"
                  className="rounded-xl px-6 py-6 font-bold shadow-sm cursor-pointer border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                >
                  <Play className="w-4 h-4 mr-2" />
                  Watch Demo
                </Button>'''
new_btn = ''

# 4. Modal block
old_modal = '''      {/* ─── RESTRICTED VIDEO LIGHTBOX ─── */}
      <AnimatePresence>
        {isVideoOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-zinc-950/90 backdrop-blur-md"
          >
            <div className="absolute inset-0" onClick={() => setIsVideoOpen(false)} />
            
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative w-full max-w-5xl bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl z-10"
            >
              <button
                onClick={() => setIsVideoOpen(false)}
                className="absolute top-4 right-4 z-20 p-2 bg-black/50 hover:bg-black/80 rounded-full text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              {!isVideoUnlocked ? (
                <div className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center space-y-6">
                  <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center">
                    <Lock className="w-8 h-8 text-red-500" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-2xl font-bold text-white">Restricted Content</h3>
                    <p className="text-zinc-400 max-w-md mx-auto text-sm">
                      This demo is internal and restricted. Please enter any access code to continue.
                    </p>
                  </div>
                  
                  <form onSubmit={handleVideoUnlock} className="w-full max-w-sm space-y-4">
                    <input
                      type="password"
                      placeholder="Access Code"
                      value={videoPassword}
                      onChange={(e) => setVideoPassword(e.target.value)}
                      className={`w-full px-4 py-3 bg-zinc-950 border ${passwordError ? 'border-red-500' : 'border-zinc-800'} rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    />
                    {passwordError && <p className="text-red-500 text-xs text-left">Incorrect access code.</p>}
                    <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white cursor-pointer">
                      Unlock Video
                    </Button>
                    <p className="text-xs text-zinc-500 pt-4">
                      Security Note: This video is restricted. Implement access control before public launch.
                    </p>
                  </form>
                </div>
              ) : (
                <div className="aspect-video bg-black flex items-center justify-center relative">
                  <div className="absolute inset-0 flex items-center justify-center flex-col space-y-4 bg-zinc-900">
                     <p className="text-zinc-400">Video unlocked. Click below to view demo on Google Drive.</p>
                     <a href="https://drive.google.com/file/d/1V0bIZCuIMfOVcrqw2iaIcLcD-pksGPXU/view?usp=sharing" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline flex items-center gap-2">
                        Open Demo in Google Drive <ArrowUpRight className="w-4 h-4"/>
                     </a>
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>'''
new_modal = ''

count = 0
for old_s, new_s in [(old_state, new_state), (old_func, new_func), (old_btn, new_btn), (old_modal, new_modal)]:
    if old_s in content:
        content = content.replace(old_s, new_s)
        count += 1
    else:
        print(f"Not found: {old_s[:60]}...")

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
print(f"Replaced {count} occurrences.")
