import { desktopCapturer, Display, remote } from 'electron';
import settings from '../../settings';
export default {
  async captureScreen(windowName: string, windowIdsToAvoid: string[] = []) : Promise<{screen : Display, stream : MediaStream, windowId : string} | null> {
    const sources = await desktopCapturer.getSources({ types: ['window'] });
    console.log(sources);
    const source = sources.find(s => s.name.includes(windowName) && windowIdsToAvoid.find(w => s.id === w) == null);
    console.log(source);
    if (!source) return null;

    const screen = remote.screen.getAllDisplays()[0];
    if (!screen) return null;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: {
          mandatory: {
            chromeMediaSource: 'desktop',
            chromeMediaSourceId: source.id,
            minWidth: settings.width,
            maxWidth: settings.width,
            minHeight: settings.height,
            maxHeight: settings.height
            // frameRate: { max: settings.flaskUI.fps }
          }
        } as any
      });
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
