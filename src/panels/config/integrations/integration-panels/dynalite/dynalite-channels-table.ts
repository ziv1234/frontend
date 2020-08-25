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
import "./dynalite-table";

@customElement("dynalite-channels-table")
class HaDynaliteChannelsTable extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;

  @property() public channels = {};

  @property({ attribute: false }) public changeCallback = function (
    _id: string,
    _value: any
  ) {};

  protected render(): TemplateResult {
    const typeOptions = [
      ["light", this._localStr("channel_type_light")],
      ["switch", this._localStr("channel_type_switch")],
    ];
    const channelsTableConfig = [
      { header: this._localStr("channel_number") },
      { header: this._localStr("channel_name"), key: "name", type: "string" },
      {
        header: this._localStr("channel_type"),
        key: "type",
        type: "list",
        options: typeOptions,
      },
    ];
    return html`
      <div>
        <dynalite-table
          .hass=${this.hass}
          id="${this.id}-table"
          .tableData=${this.channels}
          .tableConfig=${channelsTableConfig}
          tableName="channel"
          .changeCallback="${this._handleChange.bind(this)}"
        >
        </dynalite-table>
      </div>
    `;
  }

  private _localStr(item: string) {
    return this.hass.localize("ui.panel.config.dynalite." + item);
  }

  private _handleChange(_id: string) {
    if (this.changeCallback) this.changeCallback(this.id, this.channels);
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
    "dynalite-channels-table": HaDynaliteChannelsTable;
  }
}
