import "@polymer/paper-listbox/paper-listbox";
import "@polymer/paper-item/paper-item";
import "@polymer/paper-input/paper-input";
import type { PaperInputElement } from "@polymer/paper-input/paper-input";
import type { PolymerChangedEvent } from "../../../../../polymer-types";
import {
  customElement,
  html,
  LitElement,
  property,
  CSSResultArray,
  TemplateResult,
  css,
} from "lit-element";
import "../../../../../components/ha-settings-row";
import "../../../../../components/ha-paper-dropdown-menu";
import "../../../../../components/ha-icon-button";
import { HomeAssistant } from "../../../../../types";
import { haStyle } from "../../../../../resources/styles";
import {
  showConfirmationDialog,
  showPromptDialog,
  showAlertDialog,
} from "../../../../../dialogs/generic/show-dialog-box";

@customElement("dynalite-presets-table")
class HaDynalitePresetsTable extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;

  @property() public narrow!: boolean;

  @property() public tableData = [];

  @property() public presets = {};

  @property({ attribute: false }) public changeCallback = function (
    _id: string,
    _value: any
  ) {};

  protected render(): TemplateResult {
    const firstPreset = Object.keys(this.presets)[0];
    return html`
      <div>
        <table>
          <tr>
            <th>${this._localStr("preset_number")}</th>
            <th>${this._localStr("preset_name")}</th>
            <th>${this._localStr("preset_level")}</th>
            <th></th>
            <th></th>
          </tr>
          ${Object.keys(this.presets).map(
            (preset) => html`
              <tr>
                <td>${preset}</td>
                <td>
                  <paper-input
                    class="flex"
                    label=${this._localStr("preset_name")}
                    id="${`${this.id}-name-${preset}`}"
                    type="string"
                    value=${this.presets[preset].name || ""}
                    @value-changed="${this._handleInputChange}"
                  ></paper-input>
                </td>
                <td>
                  <paper-input
                    class="flex"
                    label=${this._localStr("preset_level")}
                    id="${`${this.id}-level-${preset}`}"
                    type="number"
                    value=${this.presets[preset].level || ""}
                    @value-changed="${this._handleInputChange}"
                  ></paper-input>
                </td>
                <td>
                  <ha-icon-button
                    id=${`${this.id}-button-preset-${preset}`}
                    icon="hass:delete"
                    @click="${this._handleDeleteButton}"
                  ></ha-icon-button>
                </td>
                  ${
                    preset === firstPreset
                      ? html` <td rowspan="3">
                          <ha-icon-button
                            id=${`${this.id}-button-add-preset`}
                            icon="hass:plus-circle"
                            @click="${this._handleAddButton}"
                          ></ha-icon-button>
                        </td>`
                      : ""
                  }
                </td>
              </tr>
            `
          )}
        </table>
      </div>
    `;
  }

  private _localStr(item: string) {
    return this.hass.localize("ui.panel.config.dynalite." + item);
  }

  private _handleInputChange(ev: PolymerChangedEvent<string>) {
    const target = ev.currentTarget as PaperInputElement;
    const newValue = target.value as string;
    const targetId = (ev.currentTarget as any).id;
    const myRegEx = new RegExp(`${this.id}-(.*)-(.*)`);
    const extracted = myRegEx.exec(targetId);
    const targetKey = extracted![1];
    const targetPreset = extracted![2];
    if (newValue) this.presets[targetPreset][targetKey] = newValue;
    else delete this.presets[targetPreset][targetKey];
    if (this.changeCallback) this.changeCallback(this.id, this.presets);
  }

  private _handleDeleteButton(ev: CustomEvent) {
    const buttonBase = this.id + "-button-preset-";
    const targetPreset = (ev.currentTarget as any).id.substr(buttonBase.length);
    showConfirmationDialog(this, {
      title: this._localStr("delete_preset_title"),
      text: this._localStr("delete_preset_text"),
      confirmText: this._localStr("confirm"),
      dismissText: this._localStr("cancel"),
      confirm: () => {
        delete this.presets[targetPreset];
        this.requestUpdate();
        if (this.changeCallback) this.changeCallback(this.id, this.presets);
      },
    });
  }

  private async _handleAddButton(_ev: CustomEvent) {
    const newPreset = await showPromptDialog(this, {
      title: this._localStr("add_preset_title"),
      inputLabel: this._localStr("add_preset_label"),
      inputType: "number",
    });
    if (!newPreset) {
      return;
    }
    if (newPreset in this.presets) {
      showAlertDialog(this, {
        title: this._localStr("add_preset_error"),
        text: this._localStr("add_preset_exists"),
        confirmText: this._localStr("dismiss"),
      });
    } else {
      this.presets[newPreset] = { name: `Preset ${newPreset}` };
      this.requestUpdate();
    }
  }

  static get styles(): CSSResultArray {
    return [
      haStyle,
      css`
        :host {
          -ms-user-select: initial;
          -webkit-user-select: initial;
          -moz-user-select: initial;
        }

        th {
          font-size: 120%;
          text-align: left;
        }

        tr:nth-child(odd) {
          background-color: var(--table-row-background-color, #fff);
        }

        tr:nth-child(even) {
          background-color: var(--table-row-alternative-background-color, #eee);
        }

        td {
          padding: 4px;
        }

        td:nth-child(1) {
          font-size: 200%;
          text-align: center;
        }
      `,
    ];
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "dynalite-presets-table": HaDynalitePresetsTable;
  }
}
