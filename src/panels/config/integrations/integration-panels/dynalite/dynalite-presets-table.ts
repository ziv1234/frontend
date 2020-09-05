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
import { dynStr } from "./common";

@customElement("dynalite-presets-table")
class HaDynalitePresetsTable extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;

  @property() public presets = {};

  protected render(): TemplateResult {
    const presetTableConfig = [
      { header: dynStr(this.hass, "preset_number") },
      { header: dynStr(this.hass, "preset_name"), key: "name", type: "string" },
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
          .tableConfig=${presetTableConfig}
          tableName="preset"
        >
        </dynalite-table>
      </div>
    `;
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
    "dynalite-presets-table": HaDynalitePresetsTable;
  }
}
