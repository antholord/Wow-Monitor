export interface ISettings {
  widthScaleRatio: number;
  heightScaleRatio: number;
  windowName: string;
  toggleFrameHotkey: string;
  hideWindowHotkey: string;
  altTabHotkey: string;
  antiAFK: string;
}

export const settings: ISettings = {
  widthScaleRatio: 0.5,
  heightScaleRatio: 0.5,
  windowName: 'World of Warcraft',
  toggleFrameHotkey: 'CommandOrControl+F2',
  hideWindowHotkey: 'CommandOrControl+F3',
  altTabHotkey: 'CommandOrControl+F1',
  antiAFK: 'CommandOrControl+F4'
};
