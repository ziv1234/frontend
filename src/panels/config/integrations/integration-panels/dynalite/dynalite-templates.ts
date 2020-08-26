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

  private _templateParams = {
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

  protected render(): TemplateResult {
    const templateParams = this._templateParams[this.template];
    return html`
      ${Object.keys(templateParams).map(
        (param) => html`
          <dynalite-single-row
            id="${this.id}-${param}"
            inputType=${templateParams[param].type}
            shortDesc=${this._localStr(`temp_${this.template}_${param}`)}
            longDesc=${this._localStr(`temp_${this.template}_${param}_long`)}
            .value=${this.templates[param] || ""}
            .changeCallback="${this._handleChange.bind(this)}"
            .narrow=${this.narrow}
          ></dynalite-single-row>
        `
      )}
    `;
  }

  private _localStr(item: string) {
    return this.hass.localize("ui.panel.config.dynalite." + item);
  }

  private _handleChange(id: string, value: any) {
    const myRegEx = new RegExp(`${this.id}-(.*)`);
    const extracted = myRegEx.exec(id);
    const targetKey = extracted![1];
    if (value) this.templates[targetKey] = value;
    else delete this.templates[targetKey];
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
