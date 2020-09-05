import {
  customElement,
  html,
  LitElement,
  property,
  TemplateResult,
} from "lit-element";
import { HomeAssistant } from "../../../../../types";
import "./dynalite-table";
import { dynStr } from "./common";

@customElement("dynalite-channels-table")
class HaDynaliteChannelsTable extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;

  @property() public channels = {};

  protected render(): TemplateResult {
    const typeOptions = [
      ["light", dynStr(this.hass, "channel_type_light")],
      ["switch", dynStr(this.hass, "channel_type_switch")],
    ];
    const channelsTableConfig = [
      { header: dynStr(this.hass, "channel_number") },
      {
        header: dynStr(this.hass, "channel_name"),
        key: "name",
        type: "string",
      },
      {
        header: dynStr(this.hass, "channel_type"),
        key: "type",
        type: "list",
        options: typeOptions,
      },
    ];
    const initParams = { type: "light" };
    return html`
      <div>
        <dynalite-table
          .hass=${this.hass}
          id="${this.id}-table"
          .tableData=${this.channels}
          .tableConfig=${channelsTableConfig}
          tableName="channel"
          .initParams=${initParams}
        >
        </dynalite-table>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "dynalite-channels-table": HaDynaliteChannelsTable;
  }
}
