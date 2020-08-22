import "@polymer/paper-listbox/paper-listbox";
import "@polymer/paper-item/paper-item";
import "@polymer/paper-input/paper-input";
import type { PaperInputElement } from "@polymer/paper-input/paper-input";
import type { PolymerChangedEvent } from "../../../../../polymer-types";
import {
  customElement,
  html,
  LitElement,
  property,
  CSSResultArray,
  TemplateResult,
  css,
} from "lit-element";
import "../../../../../components/ha-settings-row";
import "../../../../../components/ha-paper-dropdown-menu";
import "../../../../../components/ha-icon-button";
import { HomeAssistant } from "../../../../../types";
import { haStyle } from "../../../../../resources/styles";

@customElement("dynalite-templates")
class HaDynaliteTemplates extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;

  @property() public narrow!: boolean;

  @property() public templates = {};

  @property({ attribute: false }) public changeCallback = function (
    _id: string,
    _value: any
  ) {};

  protected render(): TemplateResult {
    return html``;
  }

  private _localStr(item: string) {
    return this.hass.localize("ui.panel.config.dynalite." + item);
  }

  private _handleInputChange(ev: PolymerChangedEvent<string>) {
    const target = ev.currentTarget as PaperInputElement;
    const newValue = target.value as string;
    const targetId = (ev.currentTarget as any).id;
    const myRegEx = new RegExp(`${this.id}-(.*)-(.*)`);
    const extracted = myRegEx.exec(targetId);
    const targetKey = extracted![1];
    const targetPreset = extracted![2];
    if (newValue) this.presets[targetPreset][targetKey] = newValue;
    else delete this.presets[targetPreset][targetKey];
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
