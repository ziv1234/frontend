import "@material/mwc-button";
import "@polymer/app-layout/app-header/app-header";
import "@polymer/app-layout/app-toolbar/app-toolbar";
import {
  css,
  CSSResultArray,
  customElement,
  html,
  LitElement,
  property,
  internalProperty,
  TemplateResult,
} from "lit-element";
import { haStyle } from "../../../../../resources/styles";
import { HomeAssistant } from "../../../../../types";
import { showConfirmationDialog } from "../../../../../dialogs/generic/show-dialog-box";
import "../../../../../components/ha-card";
import "../../../../../components/ha-menu-button";
import "../../../../../layouts/ha-app-layout";
import "./dynalite-single-row";
import "./dynalite-presets-table";
import "./dynalite-templates";
import "./dynalite-area-cards";
import { allTemplates, allTemplateParams } from "./common";

@customElement("dynalite-config-panel")
class HaPanelConfigDynalite extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;

  @property({ type: Boolean }) public narrow!: boolean;

  @internalProperty() private _name = "";

  @internalProperty() private _host = "";

  @internalProperty() private _port = "";

  @internalProperty() private _fade = "";

  @internalProperty() private _active = "";

  @internalProperty() private _autodiscover = "";

  @internalProperty() private _polltimer = "";

  @internalProperty() private _override_presets = "";

  @internalProperty() private _override_templates = "";

  private _entryData: any;

  private _activeOptions: Array<Array<string>> = [];

  private _configured = false;

  private _inputRows = [
    { name: "name", type: "string" },
    { name: "host", type: "string" },
    { name: "port", type: "number" },
    { name: "fade", type: "number" },
    { name: "active", type: "list", options: this._activeOptions },
    { name: "autodiscover", type: "boolean" },
    { name: "polltimer", type: "number" },
  ];

  protected render(): TemplateResult {
    if (!this._configured) return html``;
    return html`
      <ha-app-layout>
        <app-header slot="header" fixed>
          <app-toolbar>
            <ha-menu-button
              .hass=${this.hass}
              .narrow=${this.narrow}
            ></ha-menu-button>
            <div main-title>${this._localStr("description_settings")}</div>
          </app-toolbar>
        </app-header>

        <div class="content">
          <ha-card .header=${this._localStr("description_system")}>
            <div class="card-content">
              ${this._inputRows.map((row) => this._singleRow(row))}
            </div>
            <div class="card-actions">
              <mwc-button @click=${this._publish}>
                ${this._localStr("publish")}
              </mwc-button>
            </div>
          </ha-card>
          <ha-card .header=${this._localStr("description_presets")}>
            <div class="card-content">
              ${this._singleRow({ name: "override_presets", type: "boolean" })}
              ${this._override_presets
                ? html`
                    <dynalite-presets-table
                      .hass=${this.hass}
                      id="dyn-globalPresets"
                      .presets=${this._entryData.preset}
                      .changeCallback="${this._handleChange.bind(this)}"
                    ></dynalite-presets-table>
                  `
                : ""}
            </div>
          </ha-card>
          <ha-card .header=${this._localStr("temp_overrides")}>
            <div class="card-content">
              ${this._singleRow({
                name: "override_templates",
                type: "boolean",
              })}
              ${this._override_templates
                ? allTemplates.map(
                    (template) => html`
                      <h4>${this._localStr(`temp_${template}`)}</h4>
                      <dynalite-templates
                        .hass=${this.hass}
                        id="dyn-templates-${template}"
                        .templates=${this._entryData.template[template]}
                        template=${template}
                        .narrow=${this.narrow}
                      ></dynalite-templates>
                    `
                  )
                : ""}
            </div>
          </ha-card>
          <dynalite-area-cards
            .hass=${this.hass}
            id="dyn-areas"
            .areas=${this._entryData.area}
            .changeCallback="${this._handleChange.bind(this)}"
            .narrow=${this.narrow}
          ></dynalite-area-cards>
        </div>
      </ha-app-layout>
    `;
  }

  protected async firstUpdated() {
    const configEntryId = this._getConfigEntry();
    if (!configEntryId) return;
    const response = await this.hass.callWS({
      type: "dynalite/get_entry",
      entry_id: configEntryId,
    });
    this._entryData = (response as any).data;
    this._name = this._entryData.name;
    this._host = this._entryData.host;
    this._port = this._entryData.port;
    if (!this._entryData.default) this._entryData.default = {};
    const defaults = this._entryData.default;
    this._fade = "fade" in defaults ? defaults.fade : "";
    const activeMap = {
      on: "on",
      true: "on",
      init: "init",
      false: "off",
      off: "off",
    };
    this._active = activeMap[this._entryData.active];
    this._activeOptions = [
      ["on", this._localStr("active_on")],
      ["init", this._localStr("active_init")],
      ["off", this._localStr("active_off")],
    ];
    this._autodiscover = this._entryData.autodiscover;
    this._polltimer = this._entryData.polltimer;
    if ("preset" in this._entryData) {
      this._override_presets = "true";
    } else {
      this._entryData.preset = {
        "1": { name: "On", level: 1.0 },
        "4": { name: "Off", level: 0.0 },
      };
      this._override_presets = "";
    }
    if ("template" in this._entryData) {
      this._override_templates = "true";
    } else {
      this._entryData.template = {};
      this._override_templates = "";
    }
    allTemplates.forEach((template) => {
      if (!(template in this._entryData.template))
        this._entryData.template[template] = {};
    });
    if ("area" in this._entryData) {
      Object.keys(this._entryData.area).forEach((area) => {
        const curArea = this._entryData.area[area];
        if (!("channel" in curArea)) curArea.channel = {};
        if (!("preset" in curArea)) curArea.preset = {};
      });
    } else this._entryData.area = {};
    this._configured = true;
  }

  private _localStr(item: string) {
    return this.hass.localize("ui.panel.config.dynalite." + item);
  }

  private _singleRow(row: any): TemplateResult {
    return html`
      <dynalite-single-row
        id=${`dyn-${row.name}`}
        inputType=${row.type}
        shortDesc=${this._localStr(row.name)}
        longDesc=${this._localStr(row.name + "_long")}
        .value=${this["_" + row.name]}
        .options=${row.options ? row.options : []}
        .changeCallback="${this._handleChange.bind(this)}"
        .narrow=${this.narrow}
      ></dynalite-single-row>
    `;
  }

  private _getConfigEntry() {
    const searchParams = new URLSearchParams(window.location.search);
    if (!searchParams.has("config_entry")) {
      return false;
    }
    return searchParams.get("config_entry") as string;
  }

  private _handleChange(id: string, value: any) {
    this["_" + id.substr(4)] = value;
  }

  private async _publish(): Promise<void> {
    if (!this.hass) {
      return;
    }
    showConfirmationDialog(this, {
      title: this._localStr("save_settings_title"),
      text: this._localStr("save_settings_text"),
      confirmText: this._localStr("confirm"),
      dismissText: this._localStr("cancel"),
      confirm: async () => {
        ["name", "host", "port", "active", "autodiscover", "polltimer"].forEach(
          (key) => {
            if (this["_" + key]) this._entryData[key] = this["_" + key];
            else delete this._entryData[key];
          }
        );
        if (this._port) this._entryData.port = parseInt(this._port);
        if (this._fade !== "") this._entryData.default.fade = this._fade;
        else delete this._entryData.default.fade;
        let savePreset: any;
        let saveTemplates: any;
        if (!this._override_presets) {
          savePreset = this._entryData.preset;
          delete this._entryData.preset;
        }
        if (!this._override_templates) {
          saveTemplates = this._entryData.template;
          delete this._entryData.template;
        }
        Object.keys(this._entryData.area).forEach((area) => {
          allTemplates.forEach((curTemplate) => {
            if (curTemplate !== this._entryData.area[area].template)
              allTemplateParams[curTemplate].forEach((param) => {
                delete this._entryData.area[area][param];
              });
          });
        });
        const configEntryId = this._getConfigEntry();
        if (!configEntryId) return;
        console.log("xxx entry=%s", JSON.stringify(this._entryData));
        await this.hass.callWS({
          type: "dynalite/update_entry",
          entry_id: configEntryId,
          entry_data: JSON.stringify(this._entryData),
        });
        if (!this._override_presets) this._entryData.preset = savePreset;
        if (!this._override_templates) this._entryData.template = saveTemplates;
      },
    });
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
        .content {
          display: block;
          max-width: 600px;
          margin: 0 auto;
          padding-bottom: env(safe-area-inset-bottom);
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
    "dynalite-config-panel": HaPanelConfigDynalite;
  }
}
