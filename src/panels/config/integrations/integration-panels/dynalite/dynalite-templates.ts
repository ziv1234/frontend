import {
  customElement,
  html,
  LitElement,
  property,
  TemplateResult,
} from "lit-element";
import { HomeAssistant } from "../../../../../types";
import { allTemplateParams } from "./common";
import "./dynalite-single-row";

const _coverClasses = [
  "awning",
  "blind",
  "curtain",
  "damper",
  "door",
  "garage",
  "gate",
  "shade",
  "shutter",
  "window",
];

@customElement("dynalite-templates")
class HaDynaliteTemplates extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;

  @property({ type: Boolean }) public narrow!: boolean;

  @property() public templates!: any;

  @property() public template!: string;

  private _coverClassOptions?: Array<Array<string>>;

  protected render(): TemplateResult {
    if (!this._coverClassOptions) {
      this._coverClassOptions = _coverClasses.map((myClass) => [
        myClass,
        `cover_class_${myClass}`,
      ]);
      this._coverClassOptions.unshift(["", "cover_class_default"]);
    }
    const templateParams = allTemplateParams[this.template];
    return html`
      ${templateParams.map(
        (param) => html`
          <dynalite-single-row
            .hass=${this.hass}
            id="${this.id}-${param}"
            inputType=${param === "class" ? "list" : "number"}
            .options=${param === "class" ? this._coverClassOptions : []}
            desc="temp_${this.template}_${param}"
            .value=${this.templates[param] || ""}
            @dyn-update="${this._handleChange}"
            .narrow=${this.narrow}
          ></dynalite-single-row>
        `
      )}
    `;
  }

  private _handleChange(ev: CustomEvent) {
    const myRegEx = new RegExp(`${this.id}-(.*)`);
    const extracted = myRegEx.exec(ev.detail.id);
    const targetKey = extracted![1];
    if (ev.detail.value) this.templates[targetKey] = ev.detail.value;
    else delete this.templates[targetKey];
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "dynalite-templates": HaDynaliteTemplates;
  }
}
