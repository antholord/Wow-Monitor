import CaptureScreen from '@/electron/renderer/capture-screen';
import { settings } from '../../settings';

const x = 0;
const y = 0;

const displayWidthModifier = 0.5;
const displayHeightModifier = 0.5;

const createCanvas = (screen: Electron.Display) => {
  const canvas = document.createElement('canvas');

  canvas.width = screen.size.width * displayWidthModifier;
  canvas.height = screen.size.height * displayHeightModifier;
  return canvas;
};

const createVideo = (stream: MediaStream, screen: Electron.Display | null): Promise<HTMLVideoElement> => {
  const video = document.createElement('video');
  video.id = 'video';
  if (screen) {
    video.width = screen.size.width * displayWidthModifier;
    video.height = screen.size.height * displayHeightModifier;
  }
  video.autoplay = true;
  video.srcObject = stream;

  return new Promise(resolve => {
    video.addEventListener('playing', () => {
      resolve(video);
    });
  });
};

export default {
  async startVideo(parentDiv: HTMLDivElement, windowNameToExclude?: string): Promise<{ video: HTMLVideoElement, windowId: string } | void> {
    if (windowNameToExclude === '') windowNameToExclude = undefined;

    const { stream, screen, windowId } = await CaptureScreen.captureScreen(settings.windowName, windowNameToExclude ? [windowNameToExclude] : undefined) || {};
    if (stream == null || screen == null) return;

    const video = await createVideo(stream, screen);
    parentDiv.appendChild(video);

    return { video, windowId: windowId! };
  }
};
