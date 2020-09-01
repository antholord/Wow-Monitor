
import CaptureScreen from '@/electron/renderer/capture-screen';
import settings from '../../settings';

const x = 0;
const y = 0;

const displayWidthModifier = 0.5;
const displayHeightModifier = 0.5;

const createCanvas = (screen: Electron.Display) => {
  const canvas = document.createElement('canvas');

  canvas.width = screen.workArea.width * displayWidthModifier;
  canvas.height = screen.workArea.height * displayHeightModifier;
  return canvas;
};

const createVideo = (stream: MediaStream): Promise<HTMLVideoElement> => {
  const video = document.createElement('video');
  video.autoplay = true;
  video.srcObject = stream;
  return new Promise(resolve => {
    video.addEventListener('playing', () => {
      resolve(video);
    });
  });
};

export default {
  async start(parentDiv: HTMLDivElement, windowNameToExclude?: string) : Promise<{canvas: HTMLCanvasElement, windowId: string} | void> {
    if (windowNameToExclude === '') windowNameToExclude = undefined;

    const { stream, screen, windowId } = await CaptureScreen.captureScreen(settings.windowName, windowNameToExclude ? [windowNameToExclude] : undefined) || {};
    if (stream == null || screen == null) return;

    const canvas = createCanvas(screen);
    const ctx = canvas.getContext('2d');

    // const availTop = (window.screen as any).availTop - screen.bounds.y;
    const video = await createVideo(stream);
    const loop = () => {
      if (!video || video.paused || video.hidden || video.ended) return false;

          ctx!.drawImage(
            video,
            x,
            y,
            screen.workArea.width,
            screen.workArea.height,
            0,
            0,
            canvas.width,
            canvas.height
          );
          requestAnimationFrame(loop);

      // ctx!.drawImage(
      //   video,
      //   x,
      //   y,
      //   captureWidth * displayWidthModifier,
      //   captureHeight * displayHeightModifier,
      //   0,
      //   0,
      //   captureWidth * displayWidthModifier,
      //   captureHeight * displayHeightModifier
      // );
      // requestAnimationFrame(loop);
    };

    parentDiv.appendChild(canvas);
    loop();
    return { canvas, windowId: windowId! };
  }
};
