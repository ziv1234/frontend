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
import "./dynalite-channels-table";
import {
  showConfirmationDialog,
  showPromptDialog,
  showAlertDialog,
} from "../../../../../dialogs/generic/show-dialog-box";

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
    if (!this.areas) return html``;
    const templateOptions = [
      ["", this._localStr("area_template_none")],
      ["room", this._localStr("area_template_room")],
      ["time_cover", this._localStr("area_template_cover")],
    ];
    return html`
      ${Object.keys(this.areas).map(
        (area) => html`
          <ha-card .header="${this._localStr("area")} ${area}">
            <div class="card-content">
              <dynalite-single-element
                id="${this.id}-${area}-name"
                inputType="string"
                shortDesc=${this._localStr("area_name")}
                longDesc=${this._localStr("area_name_long")}
                .value=${this.areas[area].name || ""}
                .changeCallback="${this._handleChange.bind(this)}"
              ></dynalite-single-element>
              <dynalite-single-element
                id="${this.id}-${area}-template"
                inputType="list"
                shortDesc=${this._localStr("area_template")}
                longDesc=${this._localStr("area_template_long")}
                .options=${templateOptions}
                .value=${this.areas[area].template || ""}
                .changeCallback="${this._handleChange.bind(this)}"
              ></dynalite-single-element>
              <dynalite-single-element
                id="${this.id}-${area}-fade"
                inputType="number"
                shortDesc=${this._localStr("area_fade")}
                longDesc=${this._localStr("area_fade_long")}
                .value=${this.areas[area].fade || ""}
                .changeCallback="${this._handleChange.bind(this)}"
              ></dynalite-single-element>
              <dynalite-single-element
                id="${this.id}-${area}-nodefault"
                inputType="boolean"
                shortDesc=${this._localStr("area_no_default")}
                longDesc=${this._localStr("area_no_default_long")}
                .value=${this.areas[area].nodefault || ""}
                .changeCallback="${this._handleChange.bind(this)}"
              ></dynalite-single-element>
              <h4>${this._localStr("area_presets")}</h4>
              <dynalite-presets-table
                .hass=${this.hass}
                id="${this.id}-${area}-preset"
                .presets=${this.areas[area].preset || {}}
                .changeCallback="${this._handleChange.bind(this)}"
              ></dynalite-presets-table>
              <h4>${this._localStr("area_channels")}</h4>
              <dynalite-channels-table
                .hass=${this.hass}
                id="${this.id}-${area}-channel"
                .channels=${this.areas[area].channel || {}}
                .changeCallback="${this._handleChange.bind(this)}"
              ></dynalite-channels-table>
            </div>
          </ha-card>
        `
      )}
      <ha-icon-button
        id=${`${this.id}-button-add-area`}
        icon="hass:plus-circle"
        @click="${this._handleAddButton}"
      ></ha-icon-button>
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
    if (value) this.areas[targetArea][targetKey] = value;
    else delete this.areas[targetArea][targetKey];
    if (this.changeCallback) this.changeCallback(this.id, this.areas);
  }

  private async _handleAddButton(_ev: CustomEvent) {
    const newElement = await showPromptDialog(this, {
      title: this._localStr(`add_area_title`),
      inputLabel: this._localStr(`add_area_label`),
      inputType: "number",
    });
    if (!newElement) {
      return;
    }
    if (newElement in this.areas) {
      showAlertDialog(this, {
        title: this._localStr(`add_area_error`),
        text: this._localStr(`add_area_exists`),
        confirmText: this._localStr("dismiss"),
      });
    } else {
      this.areas[newElement] = {
        name: `${this._localStr("area")} ${newElement}`,
      };
      this.requestUpdate();
      if (this.changeCallback) this.changeCallback(this.id, this.areas);
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
