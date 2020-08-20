import "@polymer/paper-listbox/paper-listbox";
import "@polymer/paper-item/paper-item";
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
import "../../../../../components/ha-switch";
import { HomeAssistant } from "../../../../../types";

@customElement("dynalite-single-element")
class HaDynaliteSingleElement extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;

  @property() public narrow!: boolean;

  @property() public inputType = "";

  @property() public shortDesc = "";

  @property() public longDesc = "";

  @property() public value = "";

  @property() public options: Array<Array<string>> = [[]];

  @property({ attribute: false }) public handleThisChange = function (
    _id: string,
    _value: any
  ) {};

  protected render(): TemplateResult {
    let innerElement;
    if (this.inputType === "string") {
      innerElement = html`
        <paper-input
          class="flex"
          .label=${this.shortDesc}
          type="string"
          .value=${this.value}
          @value-changed=${this._handleInputChange}
        ></paper-input>
      `;
    } else if (this.inputType === "number") {
      innerElement = html`
        <paper-input
          class="flex"
          .label=${this.shortDesc}
          type="number"
          .value=${this.value}
          @value-changed=${this._handleInputChange}
        ></paper-input>
      `;
    } else if (this.inputType === "list") {
      const listIndex = this.options.findIndex(
        (element) => element[0] === this.value
      );
      innerElement = html`
        <ha-paper-dropdown-menu label=${this.shortDesc} dynamic-align>
          <paper-listbox
            slot="dropdown-content"
            .selected=${listIndex}
            @iron-select=${this._handleSelectionChange}
          >
            ${this.options.map(
              (option) =>
                html`<paper-item .active_config=${option[0]}
                  >${option[1]}</paper-item
                >`
            )}
          </paper-listbox>
        </ha-paper-dropdown-menu>
      `;
    } else if (this.inputType === "boolean") {
      innerElement = html`
        <ha-switch
          .checked=${this.value}
          @change=${this._handleSwitchChange}
        ></ha-switch>
      `;
    } else {
      return html``;
    }
    return html`
      <ha-settings-row .narrow=${this.narrow}>
        <span slot="heading">${this.shortDesc}</span>
        <span slot="description">${this.longDesc}</span>
        ${innerElement}
      </ha-settings-row>
    `;
  }

  private _handleInputChange(ev: PolymerChangedEvent<string>) {
    const target = ev.currentTarget as PaperInputElement;
    this.value = target.value as string;
    if (this.handleThisChange) this.handleThisChange(this.id, this.value);
  }

  private _handleSelectionChange(ev: CustomEvent) {
    this.value = ev.detail.item.active_config;
    if (this.handleThisChange) this.handleThisChange(this.id, this.value);
  }

  private _handleSwitchChange(ev: CustomEvent) {
    this.value = (ev.currentTarget as any).checked;
    if (this.handleThisChange) this.handleThisChange(this.id, this.value);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "dynalite-single-element": HaDynaliteSingleElement;
  }
}
