import "@material/mwc-button";
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
import { HomeAssistant } from "../../../../../types";
import { haStyle } from "../../../../../resources/styles";
import "../../../../../components/ha-settings-row";
import "../../../../../components/ha-paper-dropdown-menu";
import "../../../../../components/ha-icon-button";
import "../../../../../components/ha-card";
import {
  showDynaliteAddDialog,
  showDynaliteDeleteConfirmationDialog,
  allTemplates,
} from "./common";
import "./dynalite-single-row";
import "./dynalite-presets-table";
import "./dynalite-channels-table";
import "./dynalite-templates";

@customElement("dynalite-area-cards")
class HaDynaliteAreaCards extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;

  @property({ type: Boolean }) public narrow!: boolean;

  @property() public areas: any;

  protected render(): TemplateResult {
    if (!this.areas) return html``;
    const templateOptions = [["", this._localStr("area_template_none")]];
    allTemplates.forEach((template) => {
      templateOptions.push([
        template,
        this._localStr(`area_template_${template}`),
      ]);
    });
    return html`
      ${Object.keys(this.areas).map(
        (area) => html`
          <ha-card .header="${this._localStr("area")} ${area}">
            <div class="card-content">
              <dynalite-single-row
                id="${this.id}-${area}-name"
                inputType="string"
                shortDesc=${this._localStr("area_name")}
                longDesc=${this._localStr("area_name_long")}
                .value=${this.areas[area].name || ""}
                .changeCallback="${this._handleChange.bind(this)}"
                .narrow=${this.narrow}
              ></dynalite-single-row>
              <dynalite-single-row
                id="${this.id}-${area}-template"
                inputType="list"
                shortDesc=${this._localStr("area_template")}
                longDesc=${this._localStr("area_template_long")}
                .options=${templateOptions}
                .value=${this.areas[area].template || ""}
                .changeCallback="${this._handleChange.bind(this)}"
                .narrow=${this.narrow}
              ></dynalite-single-row>
              <dynalite-single-row
                id="${this.id}-${area}-fade"
                inputType="number"
                shortDesc=${this._localStr("area_fade")}
                longDesc=${this._localStr("area_fade_long")}
                .value=${this.areas[area].fade || ""}
                .changeCallback="${this._handleChange.bind(this)}"
                .narrow=${this.narrow}
              ></dynalite-single-row>
              <dynalite-single-row
                id="${this.id}-${area}-nodefault"
                inputType="boolean"
                shortDesc=${this._localStr("area_no_default")}
                longDesc=${this._localStr("area_no_default_long")}
                .value=${this.areas[area].nodefault || ""}
                .changeCallback="${this._handleChange.bind(this)}"
                .narrow=${this.narrow}
              ></dynalite-single-row>
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
              ${this.areas[area].template
                ? html`
                    <dynalite-templates
                      .hass=${this.hass}
                      id="${this.id}-${area}-templates"
                      .templates=${this.areas[area]}
                      template=${this.areas[area].template}
                      .narrow=${this.narrow}
                    ></dynalite-templates>
                  `
                : ""}
            </div>
            <div class="card-actions">
              <mwc-button
                @click=${this._handleDeleteButton}
                id="${this.id}-button-delete-${area}"
              >
                ${this._localStr("delete_area_title")}
              </mwc-button>
            </div>
          </ha-card>
        `
      )}
      <mwc-button @click="${this._handleAddButton}">
        <ha-icon class="add-icon" icon="hass:plus-circle"></ha-icon>
        ${this._localStr("add_area_title")}
      </mwc-button>
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
    if (targetKey === "template") this.requestUpdate();
  }

  private async _handleAddButton(_ev: CustomEvent) {
    showDynaliteAddDialog(
      this.hass,
      this,
      "area",
      this.areas,
      this._localStr("area")
    );
  }

  private _handleDeleteButton(ev: CustomEvent) {
    const buttonBase = this.id + "-button-delete-";
    const area = (ev.currentTarget as any).id.substr(buttonBase.length);
    showDynaliteDeleteConfirmationDialog(
      this.hass,
      this,
      "area",
      this.areas,
      area
    );
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
        .add-icon {
          padding: 10px;
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
