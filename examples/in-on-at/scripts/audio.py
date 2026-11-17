import asyncio, pathlib, wave, math, struct, random, json, subprocess
import edge_tts
ROOT=pathlib.Path(__file__).resolve().parents[1]
A=ROOT/'public'/'audio'; A.mkdir(parents=True,exist_ok=True)
LINES=[('hook',.25,'In, on, at? So confusing!'),('in',4.45,'In. In a box.'),('on',10.45,'On. On the table.'),('at',16.65,'At. At the bus stop.'),('outro',22.3,'Save this video for later!')]
async def main():
 for name,start,text in LINES:
  await edge_tts.Communicate(text,'en-US-GuyNeural',rate='-5%',pitch='+0Hz').save(str(A/(name+'.mp3')))
try:
 asyncio.run(main())
 VOICE='en-US-GuyNeural'
except Exception as error:
 print('Edge endpoint unavailable; using local Kokoro neural male am_michael:', type(error).__name__)
 import os, soundfile as sf
 from kokoro_onnx import Kokoro
 models=pathlib.Path(os.environ.get('KOKORO_MODEL_DIR',str(ROOT/'models')))
 engine=Kokoro(str(models/'kokoro.onnx'),str(models/'voices.bin'))
 for name,start,text in LINES:
  samples,rate=engine.create(text,voice='am_michael',speed=.96,lang='en-us')
  sf.write(str(A/(name+'.wav')),samples,rate)
  subprocess.run(['ffmpeg','-v','error','-y','-i',str(A/(name+'.wav')),'-codec:a','libmp3lame','-q:a','2',str(A/(name+'.mp3'))],check=True)
 VOICE='Kokoro am_michael (local neural male)'
SR=48000
random.seed(26)
for name,dur in [('pop',.16),('boing',.65),('thud',.35),('swoosh',.55)]:
 data=[]; phase=0
 for i in range(int(dur*SR)):
  t=i/SR; u=t/dur
  if name=='pop':
   phase+=2*math.pi*(1000-750*u)/SR; v=math.sin(phase)*math.exp(-30*t)*.6
  elif name=='boing':
   phase+=2*math.pi*(190+450*math.exp(-9*t)+55*math.sin(35*t)*math.exp(-5*t))/SR
   v=(math.sin(phase)+.2*math.sin(phase*2))*math.exp(-5*t)*.42
  elif name=='thud':
   phase+=2*math.pi*(45+95*math.exp(-25*t))/SR
   v=(math.sin(phase)*.7+random.uniform(-1,1)*.12)*math.exp(-18*t)
  else:
   v=random.uniform(-1,1)*math.sin(math.pi*u)**2*.35
  data.append(int(max(-1,min(1,v))*32767))
 with wave.open(str(A/(name+'.wav')),'wb') as w:
  w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes(struct.pack('<'+'h'*len(data),*data))
(ROOT/'audio-manifest.json').write_text(json.dumps({'voice':VOICE,'gender':'Male','language':'en-US','narration':[{'file':name+'.mp3','start':start,'text':text} for name,start,text in LINES]},indent=2))
print('Male English narration and four synthesized SFX ready.')
