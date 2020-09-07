import {
  customElement,
  html,
  LitElement,
  property,
  TemplateResult,
} from "lit-element";
import "../../../../../components/ha-settings-row";
import { HomeAssistant } from "../../../../../types";
import { dynUpdateEvent, dynStr } from "./common";
import "./dynalite-single-element";

@customElement("dynalite-single-row")
class HaDynaliteSingleRow extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;

  @property({ type: Boolean }) public narrow!: boolean;

  @property() public inputType!: string;

  @property() public desc?: string;

  @property() public value?: string;

  @property({ type: Array }) public options?: Array<Array<string>>;

  protected render(): TemplateResult {
    return html`
      <ha-settings-row .narrow=${this.narrow}>
        <span slot="heading">${dynStr(this.hass, this.desc)}</span>
        <span slot="description"
          >${dynStr(this.hass, `${this.desc}_long`)}</span
        >
        <dynalite-single-element
          .hass=${this.hass}
          id="${this.id}-inner"
          inputType=${this.inputType}
          .desc=${this.desc}
          .options=${this.options}
          .value=${this.value}
          @dyn-update="${this._handleChange}"
        ></dynalite-single-element>
      </ha-settings-row>
    `;
  }

  private _handleChange(ev: CustomEvent) {
    this.value = ev.detail.value;
    this.dispatchEvent(dynUpdateEvent(this.id, this.value));
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "dynalite-single-row": HaDynaliteSingleRow;
  }
}
