export interface ISettings {
  widthScaleRatio: number;
  heightScaleRatio: number;
  windowName: string;
  swapGameWindowHotkey: string;
  toggleFrameHotkey: string;
  hideWindowHotkey: string;
  altTabHotkey: string;
}

export const settings: ISettings = {
  widthScaleRatio: 0.5,
  heightScaleRatio: 0.5,
  windowName: 'World of Warcraft',
  swapGameWindowHotkey: 'CommandOrControl+F2',
  toggleFrameHotkey: 'CommandOrControl+F3',
  hideWindowHotkey: 'CommandOrControl+F4',
  altTabHotkey: 'CommandOrControl+F1'
};
