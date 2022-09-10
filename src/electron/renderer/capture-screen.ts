/* eslint-disable space-before-function-paren */
import { desktopCapturer, Display, remote, globalShortcut } from 'electron';

const getSourcesAttempts = 8;

let globalStream: MediaStream | null;

const findFittingSource = async function (windowName: string, windowIdsToAvoid: string[] = []): Promise<Electron.DesktopCapturerSource | null> {
  for (let i = 0; i <= getSourcesAttempts; i++) {
    const sources = await desktopCapturer.getSources({ types: ['window'] });
    const source = sources.find(s => s.name.toUpperCase() === windowName.toUpperCase() && windowIdsToAvoid.find(w => s.id === w) == null);
    if (source) return source;
  }

  return null;
};

const captureScreen = async (windowName: string, windowIdsToAvoid: string[] = []): Promise<{ screen: Display, stream: MediaStream, windowId: string } | null> => {
  if (globalStream) {
    globalStream.getTracks().forEach(track => {
      track.stop();
    });
  }
  let source = await findFittingSource(windowName, windowIdsToAvoid);
  if (!source) {
    source = await findFittingSource(windowName);
  }
  if (!source) return null;

  const screen = remote.screen.getPrimaryDisplay();
  console.log(screen);
  if (!screen) return null;

  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: false,
      video: {
        mandatory: {
          chromeMediaSource: 'desktop',
          chromeMediaSourceId: source.id,
          minWidth: screen.size.width / screen.scaleFactor,
          maxWidth: (screen.size.width / screen.scaleFactor) + 1000,
          minHeight: screen.size.height / screen.scaleFactor,
          maxHeight: (screen.size.height / screen.scaleFactor) + 1000,
          // minWidth: settings.width,
          // maxWidth: settings.width,
          // minHeight: settings.height,
          // maxHeight: settings.height
          maxFrameRate: 60,
          minFrameRate: 30
        }
      } as any
    });
    globalStream = stream;
    return { stream, screen, windowId: source.id };
  } catch (e) {
    console.error(e);
  }

  return null;
  // });
};

export default {
  captureScreen
};
