import "@material/mwc-button";
import "@polymer/app-layout/app-header/app-header";
import "@polymer/app-layout/app-toolbar/app-toolbar";
import "@polymer/paper-input/paper-input";
import "@polymer/paper-listbox/paper-listbox";
import "@polymer/paper-item/paper-item";
import type { PaperInputElement } from "@polymer/paper-input/paper-input";
import type { PolymerChangedEvent } from "../../../../../polymer-types";
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
import "../../../../../components/ha-settings-row";
import "../../../../../components/ha-paper-dropdown-menu";
import "../../../../../components/ha-switch";
import { haStyle } from "../../../../../resources/styles";
import { HomeAssistant } from "../../../../../types";
import {
  getEntry,
  GetEntryData,
  updateEntry,
} from "../../../../../data/dynalite";

const _activeOptions = ["on", "init", "off"];

@customElement("dynalite-config-panel")
class HaPanelConfigDynalite extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;

  @property() public narrow!: boolean;

  @internalProperty() private _name?: string;

  @internalProperty() private _host?: string;

  @internalProperty() private _port?: string;

  @internalProperty() private _fade?: string;

  @internalProperty() private _active?: string;

  @internalProperty() private _autoDiscover?: string;

  @internalProperty() private _pollTimer?: string;

  private _entryData?: any;

  private _configEntry?: string;

  protected render(): TemplateResult {
    return html`
      <ha-app-layout>
        <app-header slot="header" fixed>
          <app-toolbar>
            <ha-menu-button
              .hass=${this.hass}
              .narrow=${this.narrow}
            ></ha-menu-button>
            <div main-title>${this.localStr("description_settings")}</div>
          </app-toolbar>
        </app-header>

        <div class="content">
          <ha-card .header=${this.localStr("description_system")}>
            <div class="card-content">
              <ha-settings-row .narrow=${this.narrow}>
                <span slot="heading">${this.localStr("name")}</span>
                <span slot="description">${this.localStr("name_long")}</span>
                <paper-input
                  class="flex"
                  .label=${this.localStr("name")}
                  name="name"
                  type="string"
                  .value=${this._name}
                  @value-changed=${this._handleChange}
                ></paper-input>
              </ha-settings-row>
            </div>
            <div class="card-content">
              <ha-settings-row .narrow=${this.narrow}>
                <span slot="heading">${this.localStr("host")}</span>
                <span slot="description">${this.localStr("host_long")}</span>
                <paper-input
                  class="flex"
                  .label=${this.localStr("host")}
                  name="host"
                  type="string"
                  .value=${this._host}
                  @value-changed=${this._handleChange}
                ></paper-input>
              </ha-settings-row>
            </div>
            <div class="card-content">
              <ha-settings-row .narrow=${this.narrow}>
                <span slot="heading">${this.localStr("port")}</span>
                <span slot="description">${this.localStr("port_long")}</span>
                <paper-input
                  class="flex"
                  .label=${this.localStr("port")}
                  name="port"
                  type="number"
                  .value=${this._port}
                  @value-changed=${this._handleChange}
                ></paper-input>
              </ha-settings-row>
            </div>
            <div class="card-content">
              <ha-settings-row .narrow=${this.narrow}>
                <span slot="heading">${this.localStr("fade")}</span>
                <span slot="description">${this.localStr("fade_long")}</span>
                <paper-input
                  class="flex"
                  .label=${this.localStr("fade")}
                  name="fade"
                  type="number"
                  .value=${this._fade}
                  @value-changed=${this._handleChange}
                ></paper-input>
              </ha-settings-row>
            </div>
            <div class="card-content">
              <ha-settings-row .narrow=${this.narrow}>
                <span slot="heading">${this.localStr("active")}</span>
                <span slot="description">${this.localStr("active_long")}</span>
                <ha-paper-dropdown-menu
                  label=${this.localStr("active")}
                  dynamic-align
                >
                  <paper-listbox
                    slot="dropdown-content"
                    attr-for-selected="activeConfig"
                    selected=${this._active || "off"}
                    @iron-select=${this._handleActiveSelection}
                  >
                    ${_activeOptions.map(
                      (option) =>
                        html`<paper-item .activeConfig=${option}
                          >${this.localStr(`active_${option}`)}</paper-item
                        >`
                    )}
                  </paper-listbox>
                </ha-paper-dropdown-menu>
              </ha-settings-row>
            </div>
            <div class="card-content">
              <ha-settings-row .narrow=${this.narrow}>
                <span slot="heading">${this.localStr("auto_discover")}</span>
                <span slot="description"
                  >${this.localStr("auto_discover_long")}</span
                >
                <ha-switch
                  .checked=${this._autoDiscover}
                  @change=${this._handleAutoDiscoverChange}
                ></ha-switch>
              </ha-settings-row>
            </div>
            <div class="card-content">
              <ha-settings-row .narrow=${this.narrow}>
                <span slot="heading">${this.localStr("poll_timer")}</span>
                <span slot="description"
                  >${this.localStr("poll_timer_long")}</span
                >
                <paper-input
                  class="flex"
                  .label=${this.localStr("poll_timer")}
                  name="pollTimer"
                  type="number"
                  .value=${this._pollTimer}
                  @value-changed=${this._handleChange}
                ></paper-input>
              </ha-settings-row>
            </div>
            <div class="card-actions">
              <mwc-button @click=${this._publish}>
                ${this.localStr("publish")}
              </mwc-button>
            </div>
          </ha-card>
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
    this._name = this._entryData.name;
    this._host = this._entryData.host;
    this._port = this._entryData.port;
    if (this._entryData.default) {
      this._fade = this._entryData.default.fade;
    }
    const currentActive = this._entryData.active;
    if (currentActive === true) this._active = "on";
    else if (currentActive === false) this._active = "off";
    else this._active = currentActive;
    this._autoDiscover = this._entryData.autodiscover;
    this._pollTimer = this._entryData.polltimer;
  }

  private localStr(item) {
    return this.hass.localize(`ui.panel.config.dynalite.${item}`);
  }

  private _getConfigEntry() {
    if (!this._configEntry) {
      const searchParams = new URLSearchParams(window.location.search);
      const configEntry = searchParams.get("config_entry");
      if (configEntry) this._configEntry = configEntry;
    }
    return this._configEntry;
  }

  private _handleChange(ev: PolymerChangedEvent<string>) {
    const target = ev.currentTarget as PaperInputElement;
    this[`_${target.name}`] = target.value;
  }

  private _handleActiveSelection(ev: CustomEvent) {
    this._active = ev.detail.item.activeConfig;
  }

  private _handleAutoDiscoverChange(ev: CustomEvent) {
    this._autoDiscover = (ev.currentTarget as any).checked;
  }

  private async _publish(): Promise<void> {
    if (!this.hass) {
      return;
    }
    this._entryData.name = this._name;
    this._entryData.host = this._host;
    this._entryData.port = this._port;
    if (!("default" in this._entryData)) this._entryData.default = {};
    this._entryData.default.fade = this._fade || 0;
    this._entryData.active = this._active;
    this._entryData.autodiscover = this._autoDiscover;
    this._entryData.polltimer = this._pollTimer;
    const configEntryId = this._getConfigEntry();
    if (!configEntryId) {
      return;
    }
    await updateEntry(this.hass, configEntryId, this._entryData);
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

        .content > * {
          display: block;
          margin: 24px 0;
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
