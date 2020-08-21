import { fireEvent } from "../../../../../common/dom/fire_event";

export interface AddPresetDialogParams {
  presets: Array<string>;
  addPreset: (num: string, name: string, level: string) => Promise<void>;
}

export const loadAddPresetDialog = () =>
  import(
    /* webpackChunkName: "dialog-dynalite-add-preset" */ "./dynalite-dialog-add-preset"
  );

export const showAddPresetDialog = (
  element: HTMLElement,
  detailParams: AddPresetDialogParams
): void => {
  fireEvent(element, "show-dialog", {
    dialogTag: "dialog-dynalite-add-preset",
    dialogImport: loadAddPresetDialog,
    dialogParams: detailParams,
  });
};
