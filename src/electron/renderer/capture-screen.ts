import { desktopCapturer, Display, remote, globalShortcut } from 'electron';
import settings from '../../settings';

const getSourcesAttempts = 15;

let globalStream : MediaStream | null;

const findFittingSource = async function(windowName: string, windowIdsToAvoid: string[]): Promise<Electron.DesktopCapturerSource | null> {
  for (let i = 0; i <= getSourcesAttempts; i++) {
    const sources = await desktopCapturer.getSources({ types: ['window'] });
    const source = sources.find(s => s.name.includes(windowName) && windowIdsToAvoid.find(w => s.id === w) == null);
    if (source) return source;
  }

  return null;
};

export default {
  async captureScreen(windowName: string, windowIdsToAvoid: string[] = []) : Promise<{screen : Display, stream : MediaStream, windowId : string} | null> {
    if (globalStream) {
      globalStream.getTracks().forEach(track => {
        track.stop();
      });
    }
    const source = await findFittingSource(windowName, windowIdsToAvoid);
    if (!source) return null;

    const screen = remote.screen.getPrimaryDisplay();
    if (!screen) return null;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: {
          mandatory: {
            chromeMediaSource: 'desktop',
            chromeMediaSourceId: source.id,
            minWidth: screen.workArea.width,
            maxWidth: screen.workArea.width,
            minHeight: screen.workArea.height,
            maxHeight: screen.workArea.height,
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
  }
  // async swapWindow(windowName: string): Promise<{screen : Display, stream : MediaStream, windowId : string} | null> {

  // }
};
