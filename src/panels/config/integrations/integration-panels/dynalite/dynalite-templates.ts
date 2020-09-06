import {
  customElement,
  html,
  LitElement,
  property,
  TemplateResult,
} from "lit-element";
import { HomeAssistant } from "../../../../../types";
import { allTemplateParams, dynStr } from "./common";
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

  @property() public templates: any;

  @property() public template = "";

  protected render(): TemplateResult {
    const coverClassOptions = _coverClasses.map((myClass) => [
      myClass,
      dynStr(this.hass, `cover_class_${myClass}`),
    ]);
    coverClassOptions.unshift(["", dynStr(this.hass, "cover_class_default")]);
    const templateParams = allTemplateParams[this.template];
    return html`
      ${templateParams.map(
        (param) => html`
          <dynalite-single-row
            id="${this.id}-${param}"
            inputType=${param === "class" ? "list" : "number"}
            .options=${param === "class" ? coverClassOptions : []}
            shortDesc=${dynStr(this.hass, `temp_${this.template}_${param}`)}
            longDesc=${dynStr(this.hass, `temp_${this.template}_${param}_long`)}
            .value=${this.templates[param] || ""}
            .changeCallback="${this._handleChange.bind(this)}"
            .narrow=${this.narrow}
          ></dynalite-single-row>
        `
      )}
    `;
  }

  private _handleChange(id: string, value: any) {
    const myRegEx = new RegExp(`${this.id}-(.*)`);
    const extracted = myRegEx.exec(id);
    const targetKey = extracted![1];
    if (value) this.templates[targetKey] = value;
    else delete this.templates[targetKey];
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "dynalite-templates": HaDynaliteTemplates;
  }
}
