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
import { allTemplates, allTemplateParams, dynStr } from "./common";
import {
  getEntry,
  GetEntryData,
  updateEntry,
} from "../../../../../data/dynalite";

const _activeOptions = ["on", "init", "off"];

@customElement("dynalite-config-panel")
class HaPanelConfigDynalite extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;

  @property({ type: Boolean }) public narrow!: boolean;

  private _params = {
    name: "",
    host: "",
    port: "",
    fade: "",
    active: "",
    autodiscover: "",
    polltimer: "",
    override_presets: "",
    override_templates: "",
  };

  private _entryData: any;

  private _configEntry?: string;

  private _configured = false;

  private _inputRows?: Array<any>;

  protected render(): TemplateResult {
    if (!this._configured) return html``;
    if (!this._inputRows)
      this._inputRows = [
        { name: "name", type: "string" },
        { name: "host", type: "string" },
        { name: "port", type: "number" },
        { name: "fade", type: "number" },
        {
          name: "active",
          type: "list",
          options: _activeOptions.map((option) => [
            option,
            dynStr(this.hass, `active_${option}`),
          ]),
        },
        { name: "autodiscover", type: "boolean" },
        { name: "polltimer", type: "number" },
      ];

    return html`
      <ha-app-layout>
        <app-header slot="header" fixed>
          <app-toolbar>
            <ha-menu-button
              .hass=${this.hass}
              .narrow=${this.narrow}
            ></ha-menu-button>
            <div main-title>${dynStr(this.hass, "description_settings")}</div>
          </app-toolbar>
        </app-header>

        <div class="content">
          <ha-card .header=${dynStr(this.hass, "description_system")}>
            <div class="card-content">
              ${this._inputRows.map((row) => this._singleRow(row))}
            </div>
            <div class="card-actions">
              <mwc-button @click=${this._publish}>
                ${dynStr(this.hass, "publish")}
              </mwc-button>
            </div>
          </ha-card>
          <ha-card .header=${dynStr(this.hass, "description_presets")}>
            <div class="card-content">
              ${this._singleRow({ name: "override_presets", type: "boolean" })}
              ${this._params.override_presets
                ? html`
                    <dynalite-presets-table
                      .hass=${this.hass}
                      id="dyn-globalPresets"
                      .presets=${this._entryData.preset}
                    ></dynalite-presets-table>
                  `
                : ""}
            </div>
          </ha-card>
          <ha-card .header=${dynStr(this.hass, "temp_overrides")}>
            <div class="card-content">
              ${this._singleRow({
                name: "override_templates",
                type: "boolean",
              })}
              ${this._params.override_templates
                ? allTemplates.map(
                    (template) => html`
                      <h4>${dynStr(this.hass, `temp_${template}`)}</h4>
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
            .narrow=${this.narrow}
          ></dynalite-area-cards>
        </div>
      </ha-app-layout>
    `;
  }

  protected async firstUpdated() {
    const configEntryId = this._getConfigEntry();
    if (!configEntryId) {
      return;
    }
    const response = await getEntry(this.hass, configEntryId);
    this._entryData = (response as GetEntryData).data;
    this._params.name = this._entryData.name;
    this._params.host = this._entryData.host;
    this._params.port = this._entryData.port;
    if (!this._entryData.default) this._entryData.default = {};
    const defaults = this._entryData.default;
    this._params.fade = "fade" in defaults ? defaults.fade : "";
    const currentActive = this._entryData.active;
    if (currentActive === true) this._params.active = "on";
    else if (currentActive === false) this._params.active = "off";
    else this._params.active = currentActive;
    this._params.autodiscover = this._entryData.autodiscover;
    this._params.polltimer = this._entryData.polltimer;
    if ("preset" in this._entryData) {
      this._params.override_presets = "true";
    } else {
      this._entryData.preset = {
        "1": { name: "On", level: 1.0 },
        "4": { name: "Off", level: 0.0 },
      };
      this._params.override_presets = "";
    }
    if ("template" in this._entryData) {
      this._params.override_templates = "true";
    } else {
      this._entryData.template = {};
      this._params.override_templates = "";
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
    this.requestUpdate();
  }

  private _singleRow(row: any): TemplateResult {
    return html`
      <dynalite-single-row
        id=${`dyn-${row.name}`}
        inputType=${row.type}
        shortDesc=${dynStr(this.hass, row.name)}
        longDesc=${dynStr(this.hass, `${row.name}_long`)}
        .value=${this._params[row.name]}
        .options=${row.options ? row.options : []}
        @dyn-update="${this._handleChange}"
        .narrow=${this.narrow}
      ></dynalite-single-row>
    `;
  }

  private _getConfigEntry() {
    if (!this._configEntry) {
      const searchParams = new URLSearchParams(window.location.search);
      const configEntry = searchParams.get("config_entry");
      if (configEntry) this._configEntry = configEntry;
    }
    return this._configEntry;
  }

  private _handleChange(ev: CustomEvent) {
    this._params[ev.detail.id.substr(4)] = ev.detail.value;
    this.requestUpdate();
  }

  private async _publish(): Promise<void> {
    if (!this.hass) {
      return;
    }
    showConfirmationDialog(this, {
      title: dynStr(this.hass, "save_settings_title"),
      text: dynStr(this.hass, "save_settings_text"),
      confirmText: dynStr(this.hass, "confirm"),
      dismissText: dynStr(this.hass, "cancel"),
      confirm: async () => {
        ["name", "host", "port", "active", "autodiscover", "polltimer"].forEach(
          (key) => {
            if (this._params[key]) this._entryData[key] = this._params[key];
            else delete this._entryData[key];
          }
        );
        if (this._params.port)
          this._entryData.port = parseInt(this._params.port);
        if (this._params.fade !== "")
          this._entryData.default.fade = this._params.fade;
        else delete this._entryData.default.fade;
        let savePreset: any;
        let saveTemplates: any;
        if (!this._params.override_presets) {
          savePreset = this._entryData.preset;
          delete this._entryData.preset;
        }
        if (!this._params.override_templates) {
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
        if (!configEntryId) {
          return;
        }
        console.log("xxx entry=%s", JSON.stringify(this._entryData));
        await updateEntry(this.hass, configEntryId, this._entryData);
        if (!this._params.override_presets) this._entryData.preset = savePreset;
        if (!this._params.override_templates)
          this._entryData.template = saveTemplates;
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
