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
import "../../../../../components/ha-card";
import { HomeAssistant } from "../../../../../types";
import { haStyle } from "../../../../../resources/styles";
import "./dynalite-single-element";
import "./dynalite-presets-table";

@customElement("dynalite-area-cards")
class HaDynaliteAreaCards extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;

  @property({ type: Boolean }) public narrow!: boolean;

  @property() public areas: any;

  @property({ attribute: false }) public changeCallback = function (
    _id: string,
    _value: any
  ) {};

  protected render(): TemplateResult {
    console.log("xxx render areas =%s", JSON.stringify(this.areas));
    if (!this.areas) return html``;
    const templateOptions = [
      ["", "XXX None"],
      ["room", "XXX Room"],
      ["time_cover", "XXX Cover"],
    ];
    return html`
      ${Object.keys(this.areas).map(
        (area) => html`
          <ha-card .header=${`XXX Area ${area}`}>
            <div class="card-content">
              <dynalite-single-element
                id="${`${this.id}-${area}-name`}"
                inputType="string"
                shortDesc="XXX area name"
                longDesc="XXX area name long"
                .value=${this.areas[area].name || ""}
                .changeCallback="${this._handleChange.bind(this)}"
              ></dynalite-single-element>
              <dynalite-single-element
                id="${`${this.id}-${area}-template`}"
                inputType="list"
                shortDesc="XXX area template"
                longDesc="XXX area template long"
                .options=${templateOptions}
                .value=${this.areas[area].template || ""}
                .changeCallback="${this._handleChange.bind(this)}"
              ></dynalite-single-element>
              <dynalite-single-element
                id="${`${this.id}-${area}-fade`}"
                inputType="number"
                shortDesc="XXX fade name"
                longDesc="XXX fade name long"
                .value=${this.areas[area].fade || ""}
                .changeCallback="${this._handleChange.bind(this)}"
              ></dynalite-single-element>
              <dynalite-single-element
                id="${`${this.id}-${area}-nodefault`}"
                inputType="boolean"
                shortDesc="XXX area nodefault"
                longDesc="XXX area nodefault long"
                .value=${this.areas[area].nodefault || ""}
                .changeCallback="${this._handleChange.bind(this)}"
              ></dynalite-single-element>
              <h4>XXX Area Specific Presets</h4>
              <dynalite-presets-table
                .hass=${this.hass}
                id="${`${this.id}-${area}-preset`}"
                .presets=${this.areas[area].preset || {}}
                .changeCallback="${this._handleChange.bind(this)}"
              ></dynalite-presets-table>
            </div>
          </ha-card>
        `
      )}
    `;
  }

  private _localStr(item: string) {
    return this.hass.localize("ui.panel.config.dynalite." + item);
  }

  private _handleChange(id: string, value: any) {
    const myRegEx = new RegExp(`${this.id}-(.*)-(.*)`);
    const extracted = myRegEx.exec(id);
    const targetArea = extracted![1];
    const targetKey = extracted![2];
    console.log(
      "handleChange target=%s key=%s value=%s",
      targetArea,
      targetKey,
      value
    );
    if (value) this.areas[targetArea][targetKey] = value;
    else delete this.areas[targetArea][targetKey];
    if (this.changeCallback) this.changeCallback(this.id, this.areas);
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
        ha-card {
          margin-bottom: 16px;
        }
      `,
    ];
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "dynalite-area-cards": HaDynaliteAreaCards;
  }
}
