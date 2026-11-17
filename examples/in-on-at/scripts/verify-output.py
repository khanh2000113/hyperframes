"""Verify the delivered video container, dimensions, duration, streams and decoding."""
import json,sys,subprocess
path=sys.argv[1] if len(sys.argv)>1 else 'output.mp4'
r=json.loads(subprocess.check_output(['ffprobe','-v','error','-show_streams','-show_format','-of','json',path]))
v=next(s for s in r['streams'] if s['codec_type']=='video'); a=next(s for s in r['streams'] if s['codec_type']=='audio')
assert (v['width'],v['height'])==(1080,1920)
assert v['r_frame_rate']=='30/1'
assert int(v['nb_frames'])==780
assert abs(float(v['duration'])-26)<.04
assert v['codec_name']=='h264' and v['pix_fmt']=='yuv420p'
assert a['codec_name']=='aac' and float(a['duration'])>25.9
subprocess.run(['ffmpeg','-v','error','-i',path,'-f','null','-'],check=True)
print(json.dumps({'ok':True,'video':'H.264 / yuv420p','audio':'AAC','width':1080,'height':1920,'fps':30,'frames':780,'duration':26},indent=2))
