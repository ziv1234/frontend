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
import "./dynalite-single-row";

@customElement("dynalite-templates")
class HaDynaliteTemplates extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;

  @property({ type: Boolean }) public narrow!: boolean;

  @property() public templates: any;

  @property() public template = "";

  private templateParams = {
    room: {
      room_on: { type: "number" },
      room_off: { type: "number" },
    },
    time_cover: {
      open: { type: "number" },
      close: { type: "number" },
      stop: { type: "number" },
      channel_cover: { type: "number" },
      duration: { type: "number" },
      tilt: { type: "number" },
    },
  };

  @property({ attribute: false }) public changeCallback = function (
    _id: string,
    _value: any
  ) {};

  protected render(): TemplateResult {
    const relevantTemplates = this.template
      ? [this.template]
      : Object.keys(this.templateParams);
    return html` ${relevantTemplates.map(
      (template) => html`
        <h4>${this._localStr(`temp_${template}`)}</h4>
        ${Object.keys(this.templateParams[template]).map(
          (param) => html`
            <dynalite-single-row
              id="${this.id}-${template}-${param}"
              inputType=${this.templateParams[template][param].type}
              shortDesc=${this._localStr(`temp_${template}_${param}`)}
              longDesc=${this._localStr(`temp_${template}_${param}_long`)}
              .value=${this.templates[template][param] || ""}
              .changeCallback="${this._handleChange.bind(this)}"
              .narrow=${this.narrow}
            ></dynalite-single-row>
          `
        )}
      `
    )}`;
  }

  private _localStr(item: string) {
    return this.hass.localize("ui.panel.config.dynalite." + item);
  }

  private _handleChange(id: string, value: any) {
    const myRegEx = new RegExp(`${this.id}-(.*)-(.*)`);
    const extracted = myRegEx.exec(id);
    const targetTemplate = extracted![1];
    const targetKey = extracted![2];
    if (value) this.templates[targetTemplate][targetKey] = value;
    else delete this.templates[targetTemplate][targetKey];
    if (this.changeCallback) this.changeCallback(this.id, this.templates);
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
    "dynalite-templates": HaDynaliteTemplates;
  }
}
