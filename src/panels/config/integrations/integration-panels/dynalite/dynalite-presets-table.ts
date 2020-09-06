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

@customElement("dynalite-presets-table")
class HaDynalitePresetsTable extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;

  @property() public presets!: any;

  private _presetTableConfig?: Array<any>;

  protected render(): TemplateResult {
    if (!this._presetTableConfig)
      this._presetTableConfig = [
        { header: dynStr(this.hass, "preset_number") },
        {
          header: dynStr(this.hass, "preset_name"),
          key: "name",
          type: "string",
        },
        {
          header: dynStr(this.hass, "preset_level"),
          key: "level",
          type: "number",
          percent: "true",
        },
      ];
    return html`
      <div>
        <dynalite-table
          .hass=${this.hass}
          id="${this.id}-table"
          .tableData=${this.presets}
          .tableConfig=${this._presetTableConfig}
          tableName="preset"
        >
        </dynalite-table>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "dynalite-presets-table": HaDynalitePresetsTable;
  }
}
