import "@material/mwc-button";
import "@polymer/app-layout/app-header/app-header";
import "@polymer/app-layout/app-toolbar/app-toolbar";
import "@polymer/paper-input/paper-input";
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
import "./dynalite-presets-table";
import "./dynalite-single-element";

@customElement("dynalite-config-panel")
class HaPanelConfigDynalite extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;

  @property() public narrow!: boolean;

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

  private _entryData;

  private _activeOptions: Array<Array<string>> = [];

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
              <dynalite-single-element
                id="dyn-name"
                inputType="string"
                shortDesc=${this._localStr("name")}
                longDesc=${this._localStr("name_long")}
                .value=${this._name}
                .changeCallback="${this._handleChange.bind(this)}"
              ></dynalite-single-element>
            </div>
            <div class="card-content">
              <dynalite-single-element
                id="dyn-host"
                inputType="string"
                shortDesc=${this._localStr("host")}
                longDesc=${this._localStr("host_long")}
                .value=${this._host}
                .changeCallback="${this._handleChange.bind(this)}"
              ></dynalite-single-element>
            </div>
            <div class="card-content">
              <dynalite-single-element
                id="dyn-port"
                inputType="number"
                shortDesc=${this._localStr("port")}
                longDesc=${this._localStr("port_long")}
                .value=${this._port}
                .changeCallback="${this._handleChange.bind(this)}"
              ></dynalite-single-element>
            </div>
            <div class="card-content">
              <dynalite-single-element
                id="dyn-fade"
                inputType="number"
                shortDesc=${this._localStr("fade")}
                longDesc=${this._localStr("fade_long")}
                .value=${this._fade}
                .changeCallback="${this._handleChange.bind(this)}"
              ></dynalite-single-element>
            </div>
            <div class="card-content">
              <dynalite-single-element
                id="dyn-active"
                inputType="list"
                shortDesc=${this._localStr("active")}
                longDesc=${this._localStr("active_long")}
                .options=${this._activeOptions}
                .value=${this._active}
                .changeCallback="${this._handleChange.bind(this)}"
              ></dynalite-single-element>
            </div>
            <div class="card-content">
              <dynalite-single-element
                id="dyn-autodiscover"
                inputType="boolean"
                shortDesc=${this._localStr("auto_discover")}
                longDesc=${this._localStr("auto_discover_long")}
                .value=${this._autodiscover}
                .changeCallback="${this._handleChange.bind(this)}"
              ></dynalite-single-element>
            </div>
            <div class="card-content">
              <dynalite-single-element
                id="dyn-polltimer"
                inputType="number"
                shortDesc=${this._localStr("poll_timer")}
                longDesc=${this._localStr("poll_timer_long")}
                .value=${this._polltimer}
                .changeCallback="${this._handleChange.bind(this)}"
              ></dynalite-single-element>
            </div>
            <div class="card-content">
              <dynalite-single-element
                id="dyn-overrideGlobalPresets"
                inputType="boolean"
                shortDesc=${this._localStr("override_presets")}
                longDesc=${this._localStr("override_presets_long")}
                .value=${this._overrideGlobalPresets}
                .changeCallback="${this._handleChange.bind(this)}"
              ></dynalite-single-element>
            </div>
            <div class="card-content">
              ${this._overrideGlobalPresets
                ? html`<div class="card-content">
                    <dynalite-presets-table
                      .hass=${this.hass}
                      id="dyn-globalPresets"
                      .presets=${this._globalPresets}
                      .changeCallback="${this._handleChange.bind(this)}"
                    ></dynalite-presets-table>
                  </div>`
                : ""}
            </div>
            <div class="card-actions">
              <mwc-button @click=${this._publish}>
                ${this._localStr("publish")}
              </mwc-button>
            </div>
          </ha-card>
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
      this._globalPresets = {};
      this._overrideGlobalPresets = "false";
    }
    if ("template" in this._entryData) {
      this._templates = JSON.parse(JSON.stringify(this._entryData.preset));
      this._overrideGlobalPresets = "true";
    } else {
      this._globalPresets = {};
      this._overrideGlobalPresets = "false";
    }
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
      for (const preset in this._globalPresets) {
        if ({}.hasOwnProperty.call(this._globalPresets, preset)) {
          globalPresets[preset] = {};
          if (this._globalPresets[preset].name)
            globalPresets[preset].name = this._globalPresets[preset].name;
          if (this._globalPresets[preset].level)
            globalPresets[preset].level = this._globalPresets[preset].level;
        }
      }
      this._entryData.preset = globalPresets;
    } else {
      delete this._entryData.preset;
    }
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
      `,
    ];
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "dynalite-config-panel": HaPanelConfigDynalite;
  }
}
