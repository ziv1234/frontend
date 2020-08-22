import "@polymer/paper-listbox/paper-listbox";
import "@polymer/paper-item/paper-item";
import "@polymer/paper-input/paper-input";
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
import "./dynalite-single-element";

@customElement("dynalite-templates")
class HaDynaliteTemplates extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;

  @property() public narrow!: boolean;

  @property() public templates: any;

  @property({ attribute: false }) public changeCallback = function (
    _id: string,
    _value: any
  ) {};

  protected render(): TemplateResult {
    if (!this.templates) return html``;
    return html`
      <dynalite-single-element
        id="${`${this.id}-room-room_off`}"
        inputType="number"
        shortDesc=${this._localStr("temp_room_off")}
        longDesc=${this._localStr("temp_room_off_long")}
        .value=${this.templates.room.room_off || ""}
        .changeCallback="${this._handleChange.bind(this)}"
      ></dynalite-single-element>
      <dynalite-single-element
        id="${`${this.id}-room-room_on`}"
        inputType="number"
        shortDesc=${this._localStr("temp_room_on")}
        longDesc=${this._localStr("temp_room_on_long")}
        .value=${this.templates.room.room_on || ""}
        .changeCallback="${this._handleChange.bind(this)}"
      ></dynalite-single-element>
    `;
  }

  private _localStr(item: string) {
    return this.hass.localize("ui.panel.config.dynalite." + item);
  }

  private _handleChange(id: string, value: any) {
    const myRegEx = new RegExp(`${this.id}-(.*)-(.*)`);
    const extracted = myRegEx.exec(id);
    const targetTemplate = extracted![1];
    const targetKey = extracted![2];
    console.log(
      "handleChange target=%s key=%s value=%s",
      targetTemplate,
      targetKey,
      value
    );
    if (value) this.templates[targetTemplate][targetKey] = value;
    else delete this.templates[targetTemplate][targetKey];
    if (this.changeCallback) this.changeCallback(this.id, this.templates);
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
      `,
    ];
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "dynalite-templates": HaDynaliteTemplates;
  }
}
