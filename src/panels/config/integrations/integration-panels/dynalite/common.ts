import { LitElement } from "lit-element";
import { HomeAssistant } from "../../../../../types";
import {
  showConfirmationDialog,
  showPromptDialog,
  showAlertDialog,
} from "../../../../../dialogs/generic/show-dialog-box";

export async function showDynaliteAddDialog(
  hass: HomeAssistant,
  orig: LitElement,
  tableName: string,
  table: any,
  newElementFunc: (element: string) => any
) {
  const newElement = await showPromptDialog(orig, {
    title: dynStr(hass, `add_${tableName}_title`),
    inputLabel: dynStr(hass, `add_${tableName}_label`),
    inputType: "number",
  });
  if (!newElement) {
    return;
  }
  if (newElement in table) {
    showAlertDialog(orig, {
      title: dynStr(hass, `add_${tableName}_error`),
      text: dynStr(hass, `add_${tableName}_exists`),
      confirmText: dynStr(hass, "dismiss"),
    });
  } else {
    table[newElement] = newElementFunc(newElement);
    orig.requestUpdate();
  }
}

export async function showDynaliteDeleteConfirmationDialog(
  hass: HomeAssistant,
  orig: LitElement,
  tableName: string,
  table: any,
  elementToDelete: string
) {
  showConfirmationDialog(orig, {
    title: dynStr(hass, `delete_${tableName}_title`),
    text: dynStr(hass, `delete_${tableName}_text`),
    confirmText: dynStr(hass, "confirm"),
    dismissText: dynStr(hass, "cancel"),
    confirm: () => {
      delete table[elementToDelete];
      orig.requestUpdate();
    },
  });
}

export const allTemplateParams = {
  room: ["room_on", "room_off"],
  time_cover: [
    "class",
    "open",
    "close",
    "stop",
    "channel_cover",
    "duration",
    "tilt",
  ],
};

export const allTemplates = Object.keys(allTemplateParams);

export function dynStr(hass: HomeAssistant, item: string) {
  return hass.localize(`ui.panel.config.dynalite.${item}`);
}
