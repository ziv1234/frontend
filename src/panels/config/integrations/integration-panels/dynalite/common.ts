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
  namePrefix: any
) {
  const newElement = await showPromptDialog(orig, {
    title: _localStr(hass, `add_${tableName}_title`),
    inputLabel: _localStr(hass, `add_${tableName}_label`),
    inputType: "number",
  });
  if (!newElement) {
    return;
  }
  if (newElement in table) {
    showAlertDialog(orig, {
      title: _localStr(hass, `add_${tableName}_error`),
      text: _localStr(hass, `add_${tableName}_exists`),
      confirmText: _localStr(hass, "dismiss"),
    });
  } else {
    table[newElement] = { name: namePrefix + " " + newElement };
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
    title: _localStr(hass, `delete_${tableName}_title`),
    text: _localStr(hass, `delete_${tableName}_text`),
    confirmText: _localStr(hass, "confirm"),
    dismissText: _localStr(hass, "cancel"),
    confirm: () => {
      delete table[elementToDelete];
      orig.requestUpdate();
    },
  });
}

function _localStr(hass: HomeAssistant, item: string) {
  return hass.localize("ui.panel.config.dynalite." + item);
}
