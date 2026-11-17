"""Optional offline neural male TTS assets; not needed to render bundled audio."""
from pathlib import Path
from urllib.request import urlretrieve
root=Path(__file__).resolve().parents[1]/'models'
root.mkdir(exist_ok=True)
base='https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.1/'
for remote,local in [('kokoro-v1.0.onnx','kokoro.onnx'),('voices-v1.0.bin','voices.bin')]:
 target=root/local
 if not target.exists():
  print('Downloading',remote)
  urlretrieve(base+remote,target)
print('Local Kokoro assets ready.')
