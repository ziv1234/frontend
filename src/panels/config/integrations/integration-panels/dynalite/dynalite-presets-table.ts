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
  TemplateResult,
} from "lit-element";
import "../../../../../components/ha-settings-row";
import "../../../../../components/ha-paper-dropdown-menu";
import "../../../../../components/ha-icon-button";
import { HomeAssistant } from "../../../../../types";
import { showAddPresetDialog } from "./dynalite-show-dialog-add-preset";

@customElement("dynalite-presets-table")
class HaDynalitePresetsTable extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;

  @property() public narrow!: boolean;

  @property() public tableData = [];

  @property() public presets = {};

  @property({ attribute: false }) public handleThisChange = function (
    _id: string,
    _value: any
  ) {};

  protected render(): TemplateResult {
    console.log("xxx preset=%s", JSON.stringify(this.presets));
    const firstPreset = Object.keys(this.presets)[0];
    return html`
      <div>
        <table>
          <tr>
            <th>Preset</th>
            <th>Name</th>
            <th>Level</th>
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
                    label="Name"
                    id="${`${this.id}-name-${preset}`}"
                    type="string"
                    value=${this.presets[preset].name}
                    @value-changed="${this._handleInputChange}"
                  ></paper-input>
                </td>
                <td>
                  <paper-input
                    class="flex"
                    label="Level"
                    id="${`${this.id}-level-${preset}`}"
                    type="number"
                    value=${this.presets[preset].level}
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
                    </td>
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

  private _handleInputChange(ev: PolymerChangedEvent<string>) {
    console.log("xxx starting");
    const target = ev.currentTarget as PaperInputElement;
    const newValue = target.value as string;
    const targetId = (ev.currentTarget as any).id;
    const myRegEx = new RegExp(`${this.id}-(.*)-(.*)`);
    const extracted = myRegEx.exec(targetId);
    const targetKey = extracted![1];
    const targetPreset = extracted![2];
    console.log(
      "xxx input id=%s value=%s, extracted=%s",
      targetId,
      newValue,
      targetPreset
    );
    this.presets[targetPreset][targetKey] = newValue;
    if (this.handleThisChange) this.handleThisChange(this.id, this.presets);
  }

  private _handleDeleteButton(ev: CustomEvent) {
    console.log("xxx button");
    const buttonBase = this.id + "-button-preset-";
    const targetPreset = (ev.currentTarget as any).id.substr(buttonBase.length);
    console.log("xxx button id=%s", targetPreset);
    delete this.presets[targetPreset];
    this.requestUpdate();
    if (this.handleThisChange) this.handleThisChange(this.id, this.presets);
  }

  private _handleAddButton(_ev: CustomEvent) {
    console.log("xxx button");
    showAddPresetDialog(this, {
      presets: ["1", "4", "7"],
      addPreset: async (presetNumber, presetName, presetLevel) => {
        const result = {};
        result.name = presetName;
        result.level = presetLevel;
        this.presets[presetNumber] = result;
        this.requestUpdate();
      },
    });
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "dynalite-presets-table": HaDynalitePresetsTable;
  }
}
