import sys
import yt_dlp
import os

SCRIPTDIR = os.path.dirname(os.path.abspath(__file__))
DOWNLOAD_PATH = os.path.join(SCRIPTDIR, '../temp/temp_downloads')
MAX_BYTES = 8*1024*1024
def download(url, quality=None):
    # Garante que a qualidade seja um número limpo
    height_limit = int(quality) if quality else 720
    
    # IMPORTANTE: Garante que a pasta existe antes de baixar
    if not os.path.exists(DOWNLOAD_PATH):
        os.makedirs(DOWNLOAD_PATH)

    ydl_opts = {
       'outtmpl': os.path.join(DOWNLOAD_PATH, '%(id)s.%(ext)s'),
        'extractor_args': {
            'youtube': {
                'player_client': ['android']
            }
        },
        'noplaylist': True,
        # 'best' é o comando mais seguro quando o YouTube está bloqueando formatos separados
        'format': f'bestvideo[height<={height_limit}]+bestaudio/best',
        'quiet': True, # Mude para False temporariamente para ver o que está acontecendo
    }
    
    try:
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            # download=True já baixa o arquivo
            info = ydl.extract_info(url, download=True)
            video_path = os.path.join(DOWNLOAD_PATH, info['id'] + '.mp4')
            
            size = os.path.getsize(video_path)
            if size > MAX_BYTES:
                print("ERROR:FILE_SIZE_MAX_EXCEEDED")
                os.remove(video_path)
                sys.exit(1)
                
            print(f"FILENAME:{info['id']}.mp4", flush=True)
    except Exception as e:
        print(f"ERROR:{str(e)}", flush=True)
        sys.exit(1)

if __name__ == "__main__":
    # Verifica se pelo menos a URL foi enviada
    if len(sys.argv) < 2:
        print("ERROR:URL_MISSING", flush=True)
        sys.exit(1)
        
    url_input = sys.argv[1]

    quality_input = sys.argv[2] if len(sys.argv) > 2 else None
       
    download(url_input, quality_input)