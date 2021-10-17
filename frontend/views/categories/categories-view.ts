import {css, customElement, html, LitElement, property, state} from "lit-element";

import { guard } from "lit-html/directives/guard";
import { render } from 'lit-html';

import '@vaadin/vaadin-dialog/vaadin-dialog';
import '@vaadin/vaadin-button/vaadin-button';
import '@vaadin/vaadin-text-field/vaadin-text-field';
import '@vaadin/vaadin-radio-button/vaadin-radio-group';
import '@vaadin/vaadin-radio-button/vaadin-radio-button';
import '@vaadin/vaadin-ordered-layout/vaadin-horizontal-layout';
import '@vaadin/vaadin-ordered-layout/vaadin-vertical-layout';

import Category from "Frontend/generated/com/example/application/data/entity/Category";
import {CategoryEndpoint} from "Frontend/generated/CategoryEndpoint";

import '../../components/Fab';

@customElement('categories-view')
export class CategoriesView extends LitElement {
  @state()
  categories: Category[] = [];
  @state()
  private dialogOpened = false;
  @state()
  private newCategoryName: string = '';
  @state()
  private newCategoryColor: string = 'crimson';

  static colors = [
    { code: 'crimson', name: 'Cramoisie'},
    { code: 'lime', name: 'Chaux'},
    { code: 'aquamarine', name: 'Bleu vert'},
    { code: 'deepskyblue', name: 'Bleu ciel profond'},
    { code: 'blueviolet', name: 'Bleu violet'},
    { code: 'brown', name: 'Marron'},
    { code: 'darkcyan', name: 'Cyan foncé'},
    { code: 'darkgoldenrod', name: 'Rouge doré foncé'},
  ]

  static styles = css`
    :host {
      display: block;
      padding: var(--lumo-space-m) var(--lumo-space-l);
    }
  `;

  protected render() {
    return html`
      <h1>Catégories</h1>
      <vaadin-horizontal-layout style="flex-flow: row wrap;">
        ${this.categories.map(category => html`
          <category-card .category="${category}"></category-card>
        `)}
      </vaadin-horizontal-layout>
      <fab-comp .icon="${'lumo:plus'}" .onMouseClick="${() => (this.dialogOpened = true)}"></fab-comp>
      <vaadin-dialog
        aria-label="Créer une catégorie"
        .opened="${this.dialogOpened}"
        @opened-changed="${(e: CustomEvent) => (this.dialogOpened = e.detail.value)}"
        .renderer="${guard([], () => (root: HTMLElement) => {
          render(
            html`
              <vaadin-vertical-layout
                      theme="spacing"
                      style="width: 300px; max-width: 100%; align-items: stretch;"
              >
                <h2 style="margin: var(${'--lumo-space-m'}) 0 0 0; font-size: 1.5em; font-weight: bold;">
                    Créer une catégorie
                </h2>
                <vaadin-vertical-layout style="align-items: stretch;">
                  <vaadin-text-field
                    label="Nom"
                    .value="${this.newCategoryName}"
                    @change="${(e: Event) => this.newCategoryName = (e.target as HTMLInputElement).value}"
                  ></vaadin-text-field>
                  <vaadin-radio-group
                    label="Couleur"
                    theme="horizontal"
                    .value="${this.newCategoryColor}"
                    @change="${(e: Event) => {
                      this.newCategoryColor = (e.target as any).value
                    }}"
                  >
                    ${ CategoriesView.colors.map(color => html`
                      <vaadin-radio-button value="${color.code}" checked>
                        <div style="width: 20px; height: 20px; background-color: ${color.code}"></div>
                      </vaadin-radio-button>
                    `)}
                  </vaadin-radio-group>
                </vaadin-vertical-layout>
                <vaadin-horizontal-layout theme="spacing" style="justify-content: flex-end">
                  <vaadin-button @click="${() => (this.dialogOpened = false)}">Annuler</vaadin-button>
                  <vaadin-button
                    theme="primary"
                    @click="${() => {
                      this.createCategory();
                      this.dialogOpened = false
                    }}"
                  >
                    Créer
                  </vaadin-button>
                </vaadin-horizontal-layout>
              </vaadin-vertical-layout>
            `,
            root
          );})}"
      ></vaadin-dialog>
    `;
  }

  async connectedCallback() {
    super.connectedCallback();
    this.categories = await CategoryEndpoint.findAll();
  }

  async createCategory() {
    const category = {
      name: this.newCategoryName,
      color: this.newCategoryColor,
      notes: []
    } as Category;
    const createdCategory = await CategoryEndpoint.save(category);
    if (createdCategory) {
      this.categories = await CategoryEndpoint.findAll();
    }
  }
}

@customElement('category-card')
export class CategoryCard extends LitElement {
  @property()
  category: Category | null = null;

  static styles = css`
    :host {
      display: flex;
      width: 100%;
      margin-bottom: 20px;
    }
    a {
      color: unset;
      text-decoration: unset;
      width: 100%;
    }
    .root {
      align-items: center;
      width: 100%;
      padding: 10px 0;
      background: rgb(255,255,255);
      border-radius: 5px;
      box-shadow: 0 0 20px #ccc;
    }
    .root:hover {
      cursor: pointer;
    }
  `;

  protected render() {
    if (this.category)
      return html`
        <a href="${"/notes/categories=" + this.category.name}">
          <vaadin-vertical-layout
            class="root"
            style="background: linear-gradient(120deg, ${this.category.color} 0%, #ffffff 50%, ${this.category.color} 100%);"
          >
            <h2>${this.category.name}</h2>
          </vaadin-vertical-layout>
        </a>
      `;
    else
      return html`<span>NULL</span>`
  }
}