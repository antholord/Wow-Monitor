
import { BrowserWindow } from 'electron';
import { WindowContainer } from '../definitions/definitions';
import ElectronUtils from '../utils';

const windowName = 'settings';
// const utils = ElectronUtils;

export default {
  createWindow(winContainer: WindowContainer): BrowserWindow {
    if (winContainer[windowName] === undefined) {
      winContainer[windowName] = null;
    }
    // Create the browser window.
    if (winContainer[windowName] == null) {
      winContainer[windowName] = new BrowserWindow({
        width: 800,
        height: 1000,
        frame: false,
        resizable: false,
        opacity: 1,
        webPreferences: {
          nodeIntegration: true,
          webSecurity: false
        }
      });

      ElectronUtils.loadUrl(winContainer[windowName]!, 'settings', 'settings');
    } else {
      if (winContainer[windowName]?.isVisible()) {
        winContainer[windowName]!.close();
        winContainer[windowName] = null;
      } else {
        winContainer[windowName]!.show();
      }
    }

    winContainer[windowName]!.once('closed', () => {
      winContainer[windowName] = null;
    });

    return winContainer[windowName]!;
  }
};
