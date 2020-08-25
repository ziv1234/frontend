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
import "../../../../../components/ha-card";
import "../../../../../components/ha-menu-button";
import "../../../../../layouts/ha-app-layout";
import { haStyle } from "../../../../../resources/styles";
import { HomeAssistant } from "../../../../../types";
import "./dynalite-single-row";
import "./dynalite-presets-table";
import "./dynalite-templates";
import "./dynalite-area-cards";

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

  @internalProperty() private _overrideGlobalPresets = "";

  @internalProperty() private _globalPresets: any = {};

  @internalProperty() private _overrideTemplates = "";

  @internalProperty() private _templates: any = {};

  @internalProperty() private _areas: any = {};

  private _entryData;

  private _activeOptions: Array<Array<string>> = [];

  private _defaultTemplates = {
    room: { room_on: "1", room_off: "4" },
    time_cover: {
      open: "1",
      close: "2",
      stop: "4",
      channel_cover: "2",
      duration: 60.0,
      tilt: 0,
    },
  };

  protected render(): TemplateResult {
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
              <dynalite-single-row
                id="dyn-name"
                inputType="string"
                shortDesc=${this._localStr("name")}
                longDesc=${this._localStr("name_long")}
                .value=${this._name}
                .changeCallback="${this._handleChange.bind(this)}"
                .narrow=${this.narrow}
              ></dynalite-single-row>
              <dynalite-single-row
                id="dyn-host"
                inputType="string"
                shortDesc=${this._localStr("host")}
                longDesc=${this._localStr("host_long")}
                .value=${this._host}
                .changeCallback="${this._handleChange.bind(this)}"
                .narrow=${this.narrow}
              ></dynalite-single-row>
              <dynalite-single-row
                id="dyn-port"
                inputType="number"
                shortDesc=${this._localStr("port")}
                longDesc=${this._localStr("port_long")}
                .value=${this._port}
                .changeCallback="${this._handleChange.bind(this)}"
                .narrow=${this.narrow}
              ></dynalite-single-row>
              <dynalite-single-row
                id="dyn-fade"
                inputType="number"
                shortDesc=${this._localStr("fade")}
                longDesc=${this._localStr("fade_long")}
                .value=${this._fade}
                .changeCallback="${this._handleChange.bind(this)}"
                .narrow=${this.narrow}
              ></dynalite-single-row>
              <dynalite-single-row
                id="dyn-active"
                inputType="list"
                shortDesc=${this._localStr("active")}
                longDesc=${this._localStr("active_long")}
                .options=${this._activeOptions}
                .value=${this._active}
                .changeCallback="${this._handleChange.bind(this)}"
                .narrow=${this.narrow}
              ></dynalite-single-row>
              <dynalite-single-row
                id="dyn-autodiscover"
                inputType="boolean"
                shortDesc=${this._localStr("auto_discover")}
                longDesc=${this._localStr("auto_discover_long")}
                .value=${this._autodiscover}
                .changeCallback="${this._handleChange.bind(this)}"
                .narrow=${this.narrow}
              ></dynalite-single-row>
              <dynalite-single-row
                id="dyn-polltimer"
                inputType="number"
                shortDesc=${this._localStr("poll_timer")}
                longDesc=${this._localStr("poll_timer_long")}
                .value=${this._polltimer}
                .changeCallback="${this._handleChange.bind(this)}"
                .narrow=${this.narrow}
              ></dynalite-single-row>
            </div>
            <div class="card-actions">
              <mwc-button @click=${this._publish}>
                ${this._localStr("publish")}
              </mwc-button>
            </div>
          </ha-card>
          <ha-card .header=${this._localStr("description_presets")}>
            <div class="card-content">
              <dynalite-single-row
                id="dyn-overrideGlobalPresets"
                inputType="boolean"
                shortDesc=${this._localStr("override_presets")}
                longDesc=${this._localStr("override_presets_long")}
                .value=${this._overrideGlobalPresets}
                .changeCallback="${this._handleChange.bind(this)}"
                .narrow=${this.narrow}
              ></dynalite-single-row>
              ${this._overrideGlobalPresets
                ? html`
                    <dynalite-presets-table
                      .hass=${this.hass}
                      id="dyn-globalPresets"
                      .presets=${this._globalPresets}
                      .changeCallback="${this._handleChange.bind(this)}"
                    ></dynalite-presets-table>
                  `
                : ""}
            </div>
          </ha-card>
          <ha-card .header=${this._localStr("temp_overrides")}>
            <div class="card-content">
              <dynalite-single-row
                id="dyn-overrideTemplates"
                inputType="boolean"
                shortDesc=${this._localStr("override_templates")}
                longDesc=${this._localStr("override_templates_long")}
                .value=${this._overrideTemplates}
                .changeCallback="${this._handleChange.bind(this)}"
                .narrow=${this.narrow}
              ></dynalite-single-row>
              ${this._overrideTemplates
                ? html`
                    <dynalite-templates
                      .hass=${this.hass}
                      id="dyn-templates"
                      .templates=${this._templates}
                      .changeCallback="${this._handleChange.bind(this)}"
                      .narrow=${this.narrow}
                    ></dynalite-templates>
                  `
                : ""}
            </div>
          </ha-card>
          <dynalite-area-cards
            .hass=${this.hass}
            id="dyn-areas"
            .areas=${this._areas}
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
      this._globalPresets = JSON.parse(JSON.stringify(this._entryData.preset));
      this._overrideGlobalPresets = "true";
    } else {
      this._globalPresets = {
        "1": { name: "On", level: 1.0 },
        "4": { name: "Off", level: 0.0 },
      };
      this._overrideGlobalPresets = "";
    }
    if ("template" in this._entryData) {
      this._templates = JSON.parse(JSON.stringify(this._entryData.template));
      Object.keys(this._defaultTemplates).forEach((template) => {
        if (!(template in this._templates)) this._templates[template] = {};
      });
      this._overrideTemplates = "true";
    } else {
      this._templates = this._defaultTemplates;
      this._overrideTemplates = "";
    }
    this._areas =
      "area" in this._entryData
        ? JSON.parse(JSON.stringify(this._entryData.area))
        : {};
  }

  private _localStr(item: string) {
    return this.hass.localize("ui.panel.config.dynalite." + item);
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
    this._entryData.name = this._name;
    this._entryData.host = this._host;
    this._entryData.port = this._port;
    if (this._fade !== "") this._entryData.default.fade = this._fade;
    else delete this._entryData.default.fade;
    this._entryData.active = this._active;
    this._entryData.autodiscover = this._autodiscover;
    this._entryData.polltimer = this._polltimer;
    if (this._overrideGlobalPresets) {
      const globalPresets = {};
      Object.keys(this._globalPresets).forEach((preset) => {
        globalPresets[preset] = {};
        if (this._globalPresets[preset].name)
          globalPresets[preset].name = this._globalPresets[preset].name;
        if (this._globalPresets[preset].level)
          globalPresets[preset].level = this._globalPresets[preset].level;
      });
      this._entryData.preset = globalPresets;
    } else {
      delete this._entryData.preset;
    }
    if (this._overrideTemplates) {
      const templates = {};
      Object.keys(this._defaultTemplates).forEach((template) => {
        if (template in this._templates) {
          templates[template] = {};
          Object.keys(this._defaultTemplates[template]).forEach((key) => {
            if (key in this._templates[template]) {
              templates[template][key] = this._templates[template][key];
            }
          });
        }
      });
      this._entryData.template = templates;
    } else {
      delete this._entryData.template;
    }
    this._entryData.area = this._areas;
    const configEntryId = this._getConfigEntry();
    if (!configEntryId) return;
    console.log("xxx entry=%s", JSON.stringify(this._entryData));
    await this.hass.callWS({
      type: "dynalite/update_entry",
      entry_id: configEntryId,
      entry_data: JSON.stringify(this._entryData),
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
