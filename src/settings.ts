export interface ISettings {
  widthScaleRatio: number;
  heightScaleRatio: number;
  windowName: string;
  swapGameWindowHotkey: string;
  toggleFrameHotkey: string;
  hideWindowHotkey: string;
}

export const settings: ISettings = {
  widthScaleRatio: 0.5,
  heightScaleRatio: 0.5,
  windowName: 'World of Warcraft',
  swapGameWindowHotkey: 'CommandOrControl+F1',
  toggleFrameHotkey: 'CommandOrControl+F2',
  hideWindowHotkey: 'CommandOrControl+F3'
};
