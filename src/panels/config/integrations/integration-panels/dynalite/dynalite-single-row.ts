import {
  customElement,
  html,
  LitElement,
  property,
  TemplateResult,
} from "lit-element";
import "../../../../../components/ha-settings-row";
import "./dynalite-single-element";
import { dynUpdateEvent } from "./common";

@customElement("dynalite-single-row")
class HaDynaliteSingleRow extends LitElement {
  @property({ type: Boolean }) public narrow!: boolean;

  @property() public inputType = "";

  @property() public shortDesc = "";

  @property() public longDesc = "";

  @property() public value = "";

  @property({ type: Array }) public options: Array<Array<string>> = [];

  protected render(): TemplateResult {
    return html`
      <ha-settings-row .narrow=${this.narrow}>
        <span slot="heading">${this.shortDesc}</span>
        <span slot="description">${this.longDesc}</span>
        <dynalite-single-element
          id="${this.id}-inner"
          inputType=${this.inputType}
          shortDesc=${this.shortDesc}
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
