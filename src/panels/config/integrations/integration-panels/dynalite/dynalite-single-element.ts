import "@polymer/paper-listbox/paper-listbox";
import "@polymer/paper-item/paper-item";
import type { PaperInputElement } from "@polymer/paper-input/paper-input";
import {
  css,
  customElement,
  html,
  LitElement,
  property,
  TemplateResult,
  CSSResultArray,
} from "lit-element";
import { haStyle } from "../../../../../resources/styles";
import type { PolymerChangedEvent } from "../../../../../polymer-types";
import "../../../../../components/ha-settings-row";
import "../../../../../components/ha-paper-dropdown-menu";
import "../../../../../components/ha-switch";

@customElement("dynalite-single-element")
class HaDynaliteSingleElement extends LitElement {
  @property() public inputType = "";

  @property() public shortDesc = "";

  @property() public value = "";

  @property() public percent = "";

  @property({ type: Array }) public options: Array<Array<string>> = [];

  @property({ attribute: false }) public changeCallback = function (
    _id: string,
    _value: any
  ) {};

  protected render(): TemplateResult {
    if (["string", "number"].includes(this.inputType)) {
      return html`
        <paper-input
          class=${`flex${this.percent ? "flex percent" : ""}`}
          .label=${this.shortDesc}
          type=${this.inputType}
          value=${this.percent ? this._toPercent(this.value) : this.value}
          always-float-label
          placeholder="Default"
          @value-changed=${this._handleInputChange}
          >${this.percent
            ? html`<div slot="suffix"><b>%</b></div></paper-input>`
            : ""}
        </paper-input>
      `;
    }
    if (this.inputType === "list") {
      return html`
        <ha-paper-dropdown-menu label=${this.shortDesc} dynamic-align>
          <paper-listbox
            slot="dropdown-content"
            selected=${this.value}
            attr-for-selected="selector"
            @iron-select=${this._handleSelectionChange}
          >
            ${this.options.map(
              (option) =>
                html`<paper-item .selector=${option[0]}
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
    const newValue = target.value as string;
    this.value = this.percent ? this._fromPercent(newValue) : newValue;
    if (this.changeCallback) this.changeCallback(this.id, this.value);
  }

  private _handleSelectionChange(ev: CustomEvent) {
    this.value = ev.detail.item.selector;
    if (this.changeCallback) this.changeCallback(this.id, this.value);
  }

  private _handleSwitchChange(ev: CustomEvent) {
    this.value = (ev.currentTarget as any).checked;
    if (this.changeCallback) this.changeCallback(this.id, this.value);
  }

  private _toPercent(value: string) {
    if (!value) return "";
    const result = Math.round(parseFloat(value) * 100).toString();
    return result;
  }

  private _fromPercent(value: string) {
    if (!value) return "";
    const result = (parseFloat(value) / 100).toString();
    return result;
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
        .percent {
          text-align: right;
        }
      `,
    ];
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "dynalite-single-element": HaDynaliteSingleElement;
  }
}
