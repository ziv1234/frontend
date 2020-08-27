import "@polymer/paper-listbox/paper-listbox";
import "@polymer/paper-item/paper-item";
import type { PaperInputElement } from "@polymer/paper-input/paper-input";
import {
  customElement,
  html,
  LitElement,
  property,
  TemplateResult,
} from "lit-element";
import type { PolymerChangedEvent } from "../../../../../polymer-types";
import "../../../../../components/ha-settings-row";
import "../../../../../components/ha-paper-dropdown-menu";
import "../../../../../components/ha-switch";

@customElement("dynalite-single-element")
class HaDynaliteSingleElement extends LitElement {
  @property() public inputType = "";

  @property() public shortDesc = "";

  @property() public value = "";

  @property({ type: Array }) public options: Array<Array<string>> = [];

  @property({ attribute: false }) public changeCallback = function (
    _id: string,
    _value: any
  ) {};

  protected render(): TemplateResult {
    if (["string", "number"].includes(this.inputType)) {
      return html`
        <paper-input
          class="flex"
          .label=${this.shortDesc}
          type=${this.inputType}
          .value=${this.value}
          @value-changed=${this._handleInputChange}
        ></paper-input>
      `;
    }
    if (this.inputType === "list") {
      const listIndex = this.options.findIndex(
        (element) => element[0] === this.value
      );
      return html`
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
    }
    if (this.inputType === "boolean") {
      return html`
        <ha-switch
          .checked=${this.value}
          @change=${this._handleSwitchChange}
        ></ha-switch>
      `;
    }
    return html``;
  }

  private _handleInputChange(ev: PolymerChangedEvent<string>) {
    const target = ev.currentTarget as PaperInputElement;
    this.value = target.value as string;
    if (this.changeCallback) this.changeCallback(this.id, this.value);
  }

  private _handleSelectionChange(ev: CustomEvent) {
    this.value = ev.detail.item.active_config;
    if (this.changeCallback) this.changeCallback(this.id, this.value);
  }

  private _handleSwitchChange(ev: CustomEvent) {
    this.value = (ev.currentTarget as any).checked;
    if (this.changeCallback) this.changeCallback(this.id, this.value);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "dynalite-single-element": HaDynaliteSingleElement;
  }
}
