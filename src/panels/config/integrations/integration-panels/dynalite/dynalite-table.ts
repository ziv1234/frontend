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
import "../../../../../components/ha-icon-button";
import {
  showDynaliteAddDialog,
  showDynaliteDeleteConfirmationDialog,
} from "./common";
import "./dynalite-single-element";

@customElement("dynalite-table")
class HaDynaliteTable extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;

  @property() public tableData = {};

  @property({ type: Array }) public tableConfig: Array<any> = [];

  @property() public tableName = "";

  @property() public initParams: any = {};

  protected render(): TemplateResult {
    if (Object.keys(this.tableData).length === 0) {
      return html`<div>
        <mwc-button
          id="${this.id}-button-add-element"
          @click="${this._handleAddButton}"
        >
          <ha-icon class="add-icon" icon="hass:plus-circle"></ha-icon>
          ${this._localStr(`add_${this.tableName}_title`)}
        </mwc-button>
      </div>`;
    }
    const firstElement = Object.keys(this.tableData)[0];
    return html`
      <div>
        <table>
          <tr>
            ${this.tableConfig.map((column) => html`<th>${column.header}</th>`)}
            <th></th>
            <th></th>
          </tr>
          ${Object.keys(this.tableData).map(
            (element) => html`
              <tr>
                <td>${element}</td>
                ${this.tableConfig.slice(1).map(
                  (column) => html`<td>
                    <dynalite-single-element
                      id="${this.id}-${column.key}-${element}"
                      inputType=${column.type}
                      shortDesc=${column.header}
                      .options=${column.options}
                      .percent=${column.percent}
                      value=${column.key in this.tableData[element]
                        ? this.tableData[element][column.key]
                        : ""}
                      .changeCallback="${this._handleChange.bind(this)}"
                    ></dynalite-single-element>
                  </td> `
                )}
                <td>
                  <ha-icon-button
                    id="${this.id}-button-delete-${element}"
                    icon="hass:delete"
                    @click="${this._handleDeleteButton}"
                  ></ha-icon-button>
                </td>
                ${element === firstElement
                  ? html` <td rowspan="${Object.keys(this.tableData).length}">
                      <mwc-button @click="${this._handleAddButton}">
                        <ha-icon icon="hass:plus-circle"></ha-icon>
                      </mwc-button>
                    </td>`
                  : ""}
              </tr>
            `
          )}
        </table>
      </div>
    `;
  }

  private _localStr(item: string) {
    return this.hass.localize(`ui.panel.config.dynalite.${item}`);
  }

  private _handleChange(id: string, value: any) {
    const myRegEx = new RegExp(`${this.id}-(.*)-(.*)`);
    const extracted = myRegEx.exec(id);
    const targetKey = extracted![1];
    const tableElement = extracted![2];
    if (value) this.tableData[tableElement][targetKey] = value;
    else delete this.tableData[tableElement][targetKey];
  }

  private async _handleAddButton(_ev: CustomEvent) {
    showDynaliteAddDialog(
      this.hass,
      this,
      this.tableName,
      this.tableData,
      (element) => {
        const result = this.initParams ? this.initParams : {};
        result.name = `${this.tableConfig[0].header} ${element}`;
        return result;
      }
    );
  }

  private _handleDeleteButton(ev: CustomEvent) {
    const buttonBase = `${this.id}-button-delete-`;
    const tableElement = (ev.currentTarget as any).id.substr(buttonBase.length);
    showDynaliteDeleteConfirmationDialog(
      this.hass,
      this,
      this.tableName,
      this.tableData,
      tableElement
    );
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
        th {
          font-size: 120%;
          text-align: left;
        }
        tr:nth-child(odd) {
          background-color: var(--table-row-background-color, #fff);
        }
        tr:nth-child(even) {
          background-color: var(--table-row-alternative-background-color, #eee);
        }
        td {
          padding: 4px;
        }
        td:nth-child(1) {
          font-size: 200%;
          text-align: center;
        }
        .add-icon {
          padding: 10px;
        }
      `,
    ];
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "dynalite-table": HaDynaliteTable;
  }
}
