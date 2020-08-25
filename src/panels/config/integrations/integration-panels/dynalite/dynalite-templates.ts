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
import "./dynalite-single-row";

@customElement("dynalite-templates")
class HaDynaliteTemplates extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;

  @property({ type: Boolean }) public narrow!: boolean;

  @property() public templates: any;

  @property({ attribute: false }) public changeCallback = function (
    _id: string,
    _value: any
  ) {};

  protected render(): TemplateResult {
    if (!this.templates) return html``;
    return html`
      <h4>${this._localStr("temp_room")}</h4>
      <dynalite-single-row
        id="${this.id}-room-room_off"
        inputType="number"
        shortDesc=${this._localStr("temp_room_off")}
        longDesc=${this._localStr("temp_room_off_long")}
        .value=${this.templates.room.room_off || ""}
        .changeCallback="${this._handleChange.bind(this)}"
        .narrow=${this.narrow}
      ></dynalite-single-row>
      <dynalite-single-row
        id="${this.id}-room-room_on"
        inputType="number"
        shortDesc=${this._localStr("temp_room_on")}
        longDesc=${this._localStr("temp_room_on_long")}
        .value=${this.templates.room.room_on || ""}
        .changeCallback="${this._handleChange.bind(this)}"
        .narrow=${this.narrow}
      ></dynalite-single-row>
      <h4>${this._localStr("temp_cover")}</h4>
      <dynalite-single-row
        id="${this.id}-time_cover-open"
        inputType="number"
        shortDesc=${this._localStr("temp_cover_open")}
        longDesc=${this._localStr("temp_cover_open_long")}
        .value=${this.templates.time_cover.open || ""}
        .changeCallback="${this._handleChange.bind(this)}"
        .narrow=${this.narrow}
      ></dynalite-single-row>
      <dynalite-single-row
        id="${this.id}-time_cover-close"
        inputType="number"
        shortDesc=${this._localStr("temp_cover_close")}
        longDesc=${this._localStr("temp_cover_close_long")}
        .value=${this.templates.time_cover.close || ""}
        .changeCallback="${this._handleChange.bind(this)}"
        .narrow=${this.narrow}
      ></dynalite-single-row>
      <dynalite-single-row
        id="${this.id}-time_cover-stop"
        inputType="number"
        shortDesc=${this._localStr("temp_cover_stop")}
        longDesc=${this._localStr("temp_cover_stop_long")}
        .value=${this.templates.time_cover.stop || ""}
        .changeCallback="${this._handleChange.bind(this)}"
        .narrow=${this.narrow}
      ></dynalite-single-row>
      <dynalite-single-row
        id="${this.id}-time_cover-channel_cover"
        inputType="number"
        shortDesc=${this._localStr("temp_cover_channel")}
        longDesc=${this._localStr("temp_cover_channel_long")}
        .value=${this.templates.time_cover.channel_cover || ""}
        .changeCallback="${this._handleChange.bind(this)}"
        .narrow=${this.narrow}
      ></dynalite-single-row>
      <dynalite-single-row
        id="${this.id}-time_cover-duration"
        inputType="number"
        shortDesc=${this._localStr("temp_cover_duration")}
        longDesc=${this._localStr("temp_cover_duration_long")}
        .value=${this.templates.time_cover.duration || ""}
        .changeCallback="${this._handleChange.bind(this)}"
        .narrow=${this.narrow}
      ></dynalite-single-row>
      <dynalite-single-row
        id="${this.id}-time_cover-tilt"
        inputType="number"
        shortDesc=${this._localStr("temp_cover_tilt")}
        longDesc=${this._localStr("temp_cover_tilt_long")}
        .value=${this.templates.time_cover.tilt || ""}
        .changeCallback="${this._handleChange.bind(this)}"
        .narrow=${this.narrow}
      ></dynalite-single-row>
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
