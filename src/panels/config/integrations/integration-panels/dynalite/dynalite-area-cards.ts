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
  dynStr,
} from "./common";
import "./dynalite-single-row";
import "./dynalite-presets-table";
import "./dynalite-channels-table";
import "./dynalite-templates";

@customElement("dynalite-area-cards")
class HaDynaliteAreaCards extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;

  @property({ type: Boolean }) public narrow!: boolean;

  @property() public areas!: any;

  private _expanded = {};

  private _inputRows?: Array<any>;

  protected render(): TemplateResult {
    if (!this.areas) return html``;
    if (!this._inputRows) {
      const templateOptions = allTemplates.map((template) => {
        return [template, dynStr(this.hass, `area_template_${template}`)];
      });
      templateOptions.unshift(["", dynStr(this.hass, "area_template_none")]);
      this._inputRows = [
        { name: "name", type: "string" },
        { name: "template", type: "list", options: templateOptions },
        { name: "fade", type: "number" },
        { name: "nodefault", type: "boolean" },
      ];
    }
    return html`
      ${Object.keys(this.areas).map(
        (area) => html`
          <ha-card
            .header="${dynStr(this.hass, "area")} '${this.areas[area]
              .name}' (${area})"
          >
            <div class="shrink-button">
              <mwc-button
                @click="${this._handleExpandToggle}"
                id="${this.id}-button-expand-${area}"
              >
                <ha-icon
                  icon=${this._expanded[area]
                    ? "hass:minus-circle"
                    : "hass:plus-circle"}
                ></ha-icon>
              </mwc-button>
            </div>
            ${this._expanded[area]
              ? html` <div class="card-content">
                    ${this._inputRows!.map(
                      (row) => html`
                        <dynalite-single-row
                          id="${this.id}-${area}-${row.name}"
                          inputType=${row.type}
                          shortDesc=${dynStr(this.hass, `area_${row.name}`)}
                          longDesc=${dynStr(this.hass, `area_${row.name}_long`)}
                          .value=${this.areas[area][row.name] || ""}
                          .options=${row.options ? row.options : []}
                          @dyn-update="${this._handleChange.bind(this)}"
                          .narrow=${this.narrow}
                        ></dynalite-single-row>
                      `
                    )}
                    <h4>${dynStr(this.hass, "area_presets")}</h4>
                    <dynalite-presets-table
                      .hass=${this.hass}
                      id="${this.id}-${area}-preset"
                      .presets=${this.areas[area].preset || {}}
                    ></dynalite-presets-table>
                    <h4>${dynStr(this.hass, "area_channels")}</h4>
                    <dynalite-channels-table
                      .hass=${this.hass}
                      id="${this.id}-${area}-channel"
                      .channels=${this.areas[area].channel || {}}
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
                      ${dynStr(this.hass, "delete_area_title")}
                    </mwc-button>
                  </div>`
              : ""}
          </ha-card>
        `
      )}
      <mwc-button class="add-area-global" @click="${this._handleAddButton}">
        <ha-icon class="add-icon" icon="hass:plus-circle"></ha-icon>
        ${dynStr(this.hass, "add_area_title")}
      </mwc-button>
    `;
  }

  private _handleChange(ev: CustomEvent) {
    const myRegEx = new RegExp(`${this.id}-(.*)-(.*)`);
    const extracted = myRegEx.exec(ev.detail.id);
    const targetArea = extracted![1];
    const targetKey = extracted![2];
    if (ev.detail.value) this.areas[targetArea][targetKey] = ev.detail.value;
    else delete this.areas[targetArea][targetKey];
    if (targetKey === "template") this.requestUpdate();
  }

  private async _handleAddButton(_ev: CustomEvent) {
    showDynaliteAddDialog(this.hass, this, "area", this.areas, (area) => {
      return {
        name: `${dynStr(this.hass, "area")} ${area}`,
        channel: {},
        preset: {},
      };
    });
  }

  private _handleDeleteButton(ev: CustomEvent) {
    const buttonBase = `${this.id}-button-delete-`;
    const area = (ev.currentTarget as any).id.substr(buttonBase.length);
    showDynaliteDeleteConfirmationDialog(
      this.hass,
      this,
      "area",
      this.areas,
      area
    );
  }

  private _handleExpandToggle(ev: CustomEvent) {
    const buttonBase = `${this.id}-button-expand-`;
    const area = (ev.currentTarget as any).id.substr(buttonBase.length);
    this._expanded[area] = !this._expanded[area];
    this.requestUpdate();
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
        .shrink-button {
          position: absolute;
          top: 16px;
          right: 16px;
        }
        .add-area-global {
          padding-bottom: 2em;
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
