import "@material/mwc-button";
import "@polymer/paper-input/paper-input";
import "@polymer/paper-tooltip/paper-tooltip";
import {
  css,
  CSSResult,
  customElement,
  html,
  LitElement,
  property,
  internalProperty,
  TemplateResult,
} from "lit-element";
import "../../../../../components/ha-switch";
import "../../../../../components/ha-formfield";
import { haStyleDialog } from "../../../../../resources/styles";
import { HomeAssistant } from "../../../../../types";
import "./dynalite-single-element";
import { createCloseHeading } from "../../../../../components/ha-dialog";

@customElement("dialog-dynalite-add-preset")
class DialogDynaliteAddPreset extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;

  @internalProperty() private _presetNumber = "";

  @internalProperty() private _presetName = "";

  @internalProperty() private _presetLevel = "";

  @internalProperty() private _presets?: Array<string> = undefined;

  private _params: AddPresetDialogParams;

  public async showDialog(params: any): Promise<void> {
    this._params = params;
    this._presets = params.presets;
    this._presetNumber = "";
    this._presetName = "";
    this._presetLevel = "";
    await this.updateComplete;
  }

  protected render(): TemplateResult {
    if (!this._presets) {
      return html``;
    }
    let curError = "";
    if (this._presetNumber === "") curError = `Preset number is required`;
    if (this._presets!.includes(this._presetNumber))
      curError = `Preset ${this._presetNumber} is already configured`;

    const hasConflict = this._presets!.includes(this._presetNumber);
    console.log(
      "preset=%s params=%s conflict=%s",
      this._presetNumber,
      JSON.stringify(this._presets),
      hasConflict
    );
    return html`
      <ha-dialog
        open
        @closing=${this._close}
        scrimClickAction
        escapeKeyAction
        .heading=${createCloseHeading(this.hass, "Add New Preset")}
      >
        <div>
          ${curError ? html` <div class="error">${curError}</div> ` : ""}
        </div>
        <div class="card-content">
          <dynalite-single-element
            id="dyn-presetNumber"
            inputType="number"
            shortDesc="Preset Number"
            longDesc="Dynalite preset number"
            .value=${this._presetNumber}
            .handleThisChange="${this._handleChange.bind(this)}"
          ></dynalite-single-element>
        </div>
        <div class="card-content">
          <dynalite-single-element
            id="dyn-presetName"
            inputType="string"
            shortDesc="Preset Name"
            longDesc="Display name for the preset"
            .value=${this._presetName}
            .handleThisChange="${this._handleChange.bind(this)}"
          ></dynalite-single-element>
        </div>
        <div class="card-content">
          <dynalite-single-element
            id="dyn-presetLevel"
            inputType="number"
            shortDesc="Channel Level"
            longDesc="Between 0(off) and 1(on)"
            .value=${this._presetLevel}
            .handleThisChange="${this._handleChange.bind(this)}"
          ></dynalite-single-element>
        </div>
        <div slot="primaryAction">
          <mwc-button @click=${this._addPreset} .disabled=${curError !== ""}>
            Add Preset
          </mwc-button>
          <paper-tooltip position="left">
            ${curError}
          </paper-tooltip>
        </div>
      </ha-dialog>
    `;
  }

  private async _addPreset() {
    this._params.addPreset(
      this._presetNumber,
      this._presetName,
      this._presetLevel
    );
    this._close();
  }

  private _close(): void {
    this._presets = undefined;
  }

  private _handleChange(id: string, value: any) {
    console.log("xxx sss id=%s value=%s", id, JSON.stringify(value));
    this["_" + id.substr(4)] = value;
  }

  static get styles(): CSSResult[] {
    return [
      haStyleDialog,
      css`
        ha-dialog {
          --mdc-dialog-max-width: 500px;
        }
        .form {
          padding-top: 16px;
        }
        .secondary {
          color: var(--secondary-text-color);
        }
        .state {
          background-color: rgba(var(--rgb-primary-text-color), 0.15);
          border-radius: 16px;
          padding: 4px 8px;
          margin-top: 8px;
          display: inline-block;
        }
        .state:not(:first-child) {
          margin-left: 8px;
        }
        ha-switch {
          margin-top: 8px;
        }
      `,
    ];
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "dialog-dynalite-add-preset": DialogDynaliteAddPreset;
  }
}
