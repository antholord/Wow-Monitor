
import CaptureScreen from '@/electron/renderer/capture-screen';
import settings from '../../settings';

const x = 0;
const y = 0;
const captureWidth = settings.width;
const captureHeight = settings.height;
const displayWidthModifier = 1;
const displayHeightModifier = 1;

const createCanvas = () => {
  const canvas = document.createElement('canvas');
  canvas.width = captureWidth * displayWidthModifier;
  canvas.height = captureHeight * displayHeightModifier;
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

    const canvas = createCanvas();
    const ctx = canvas.getContext('2d');

    // const availTop = (window.screen as any).availTop - screen.bounds.y;
    const video = await createVideo(stream);
    const loop = () => {
      if (!video || video.paused || video.hidden || video.ended) return false;

          ctx!.drawImage(
            video,
            x,
            y,
            captureWidth,
            captureHeight,
            0,
            0,
            captureWidth * displayWidthModifier,
            captureHeight * displayHeightModifier
          );
          //   const imageData = ctx!.getImageData(0, 0, captureWidth * displayWidthModifier, captureHeight * displayHeightModifier);
          //   PixelUtils.keepOnlyPixels(imageData.data, 5, RGBA(248, 215, 151, 255));
          //   ctx!.putImageData(imageData, 0, 0);
          setTimeout(() => requestAnimationFrame(loop), 1000 / 60);
    };

    parentDiv.appendChild(canvas);
    loop();
    return { canvas, windowId: windowId! };
  }
};
