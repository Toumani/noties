import {
  customElement,
  html,
  css,
  LitElement, state, property, internalProperty
} from 'lit-element';

import '@vaadin/vaadin-text-field';
import '@vaadin/vaadin-button';
import '@vaadin/vaadin-checkbox';
import '@vaadin/vaadin-icons/vaadin-icons';
import '@vaadin/vaadin-lumo-styles/icons';
import '@vaadin/vaadin-dialog/vaadin-dialog';
import '@vaadin/vaadin-button/vaadin-button';
import '@vaadin/vaadin-text-field/vaadin-text-field';
import '@vaadin/vaadin-ordered-layout/vaadin-horizontal-layout';
import '@vaadin/vaadin-ordered-layout/vaadin-vertical-layout';
import '@vaadin/vaadin-select/vaadin-select';
import '@vaadin/vaadin-list-box/vaadin-list-box';
import '@vaadin/vaadin-item/vaadin-item';
import '@vaadin/vaadin-context-menu/vaadin-context-menu';
import '@vaadin/vaadin-notification/vaadin-notification';
import { ContextMenuItem } from '@vaadin/vaadin-context-menu/vaadin-context-menu';

import '../../components/Fab';
import '../../components/Chips';

import Note from "Frontend/generated/com/kststudios/noties/data/entity/Note";
import { NoteEndpoint } from "Frontend/generated/NoteEndpoint";
import { guard } from "lit-html/directives/guard";
import { render } from 'lit-html';
import { Router } from "@vaadin/router";
import { router } from "Frontend/index";
import { ContextMenuOpenedChanged } from '@vaadin/vaadin-context-menu/vaadin-context-menu';
import Category from "Frontend/generated/com/kststudios/noties/data/entity/Category";
import {CategoryEndpoint} from "Frontend/generated/CategoryEndpoint";
import {CategoriesView} from "Frontend/views/categories/categories-view";

@customElement('home-view')
export class HomeView extends LitElement {
  @state()
  private notes: Note[] | null = null;
  @state()
  private categories: Category[] = [];
  @state()
  private dialogOpened = false;
  @state()
  private newNoteTitle: string = '';
  @state()
  private newNoteCategory: Category | null = null;

  static styles = css`
   :host {
     display: block;
     padding: var(--lumo-space-m) var(--lumo-space-l);
   }
   #categories-area {
     margin-bottom: var(--lumo-space-m);
   }
   #categories-area > chips-comp {
     margin-right: var(--lumo-space-m);
   }
 `;

  render() {
    let categories: string[] | null = null;
    let displayedNotes: Note[] = [];

    if (router.location.params.categories as string) {
      categories = (router.location.params.categories as string).split(',');
      if (this.notes !== null)
          displayedNotes = this.notes.filter(it => (categories as string[]).includes(it.category ? it.category.name : 'Autres'));
      else
        displayedNotes = [];
    }
    else if (this.notes)
      displayedNotes = this.notes;
    return html`
      <div>
        ${categories === null
          ? html``
          : html`
            <vaadin-horizontal-layout id="categories-area">
              ${ categories.map(category => html`<chips-comp .onDelete="${this.removeCategoryFilter}" .label="${category}"></chips-comp>`) }
            </vaadin-horizontal-layout>
          `
        }
        ${ this.notes === null
          ? html`
<!--            <link rel="stylesheet" href="https://unpkg.com/css-skeletons@1.0.3/css/css-skeletons.min.css" />-->
            <div
              class="skeleton skeleton-line"
              style="
                --l-h: 140px;
                --lines: 6;
                --c-w: 100%;
              "
            ></div>`
          : displayedNotes.map(note => html`
              <note-card .note="${note}" .categories="${this.categories}" .onNoteDelete="${() => {
                this.fetchNotes();
                this.requestUpdate();
              }}"></note-card>
            `)
        }
      </div>
      <fab-comp .icon="${'lumo:plus'}" .onMouseClick="${() => (this.dialogOpened = true)}"></fab-comp>
      <vaadin-dialog
        aria-label="Créer une note"
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
                    Créer une note
                </h2>
                <vaadin-vertical-layout style="align-items: stretch;">
                  <vaadin-text-field
                    label="Titre"
                    .value="${this.newNoteTitle}"
                    @change="${(e: Event) => this.newNoteTitle = (e.target as HTMLInputElement).value}"
                  ></vaadin-text-field>
                  <vaadin-select
                    placeholder="Catégorie de la note"
                    label="Catégorie"
                    .value="${this.newNoteCategory}"
                    @change="${(e: Event) => {
                      const newNoteCategory = this.categories.find(it => it.id === parseInt((e.target as HTMLSelectElement).value));
                      if (newNoteCategory)
                        this.newNoteCategory = newNoteCategory;
                      else
                        this.newNoteCategory = null;
                    }}"
                    .renderer="${guard(
                      [],
                      () => (root: HTMLElement) =>
                        render(html`
                          <vaadin-list-box>
                            ${ this.categories.map(
                              category => html`<vaadin-item value="${category.id}">${category.name}</vaadin-item>`
                            )}
                            <hr />
                            <vaadin-item value="-1">Autre</vaadin-item>
                          </vaddin-list-box>
                        `, root
                        )
                    )}"
                ></vaddin-select>
                </vaadin-vertical-layout>
                <vaadin-horizontal-layout theme="spacing" style="justify-content: flex-end">
                    <vaadin-button @click="${() => (this.dialogOpened = false)}">Annuler</vaadin-button>
                    <vaadin-button
                            theme="primary"
                            @click="${() => {
                                this.createNote();
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
    this.notes = await NoteEndpoint.findAll();
    this.categories = await CategoryEndpoint.findAll();
  }

  async createNote() {
    const note = {
      title: this.newNoteTitle,
      category: this.newNoteCategory,
      todos: [],
      created: '', // date of creation is handle by server
    } as Note;
    // const createNote = await this.binder.submitTo(NoteEndpoint.save);
    const createdNote = await NoteEndpoint.save(note);
    if (createdNote) {
      // this.newNoteTitle = '';
      // this.newNoteCategory = null;
      if (this.notes !== null)
        this.notes = [createdNote, ...this.notes,];
      else
        this.notes = [createdNote];
      // this.binder.clear();
    }
  }

  async fetchNotes() {
    this.notes = await NoteEndpoint.findAll();
  }

  removeCategoryFilter(category: string) {
    if (router.location.params.categories as string) {
      let categories = (router.location.params.categories as string).split(',');
      categories = categories.filter(it => it !== category);
      if (categories.length > 0)
        Router.go('/notes/categories=' + categories.join(','));
      else
        Router.go('/notes')
    }
  }
}

@customElement('note-card')
export class NoteCard extends LitElement {
  @property()
  note: Note | null = null;
  @property()
  categories: Category[] = [];
  @state()
  private newNoteTitle: string = '';
  @state()
  private newNoteCategory: Category | null = null;
  @state()
  private editDialogOpened = false;
  @state()
  private deleteDialogOpened = false;
  @state()
  private notificationOpened = false;
  @property()
  onNoteDelete: () => void = () => {};

  @internalProperty()
  private items?: ContextMenuItem[] = [
    {
      component: this.createItem(
      'Modifier',
        'vaadin:edit',
        'var(--lumo-primary-text-color)',
        () => {
          this.editDialogOpened = true;
          if (this.note) {
            this.newNoteTitle = this.note.title;
            this.newNoteCategory = this.note.category ? this.note.category : CategoriesView.defaultCategory;
          }
      })
    },
    { component: this.createItem('Supprimer', 'vaadin:trash', 'var(--lumo-error-text-color)', () => { this.deleteDialogOpened = true; }) },
  ]; //  = [{ text: 'View' }, { text: 'Edit' }, { text: 'Delete' }];

  private contextMenuOpened?: boolean;

  static styles = css`
    .note-card {
      display: flex;
      flex-flow: column nowrap;
      /* height: 150px; */
      padding: var(--lumo-space-s) 0 var(--lumo-space-s) var(--lumo-space-l);
      margin-bottom: var(--lumo-space-l);
      border-top-right-radius: 5px;
      border-bottom-right-radius: 5px;
      border-left: 12px solid;
      box-shadow: 0 0 20px #ccc;
    }
    .category {
      font-family: 'Nunito', sans-serif;
      text-transform: uppercase;
    }
    .title {
      font-size: var(--lumo-font-size-xxl);
      padding: 0;
      line-height: 2rem;
    }
    .details {
      font-size: var(--lumo-font-size-xs);
      font-style: italic;
      margin: 0 0 var(--lumo-space-s) 0;
    }
    .progress-bar {
      height: 10px;
      background-color: var(--lumo-tertiary-text-color);
      border-radius: 10px;
      margin-right: var(--lumo-space-l);
    }
    .progress-bar div {
      height: 100%;
      border-radius: 20px;
    }
    a {
      color: unset;
    }
    .link:hover {
      cursor: pointer;
      text-decoration: underline;
    }
  `
  protected render() {
    if (this.note !== null) {
      const note: Note = this.note as Note;
      const nbItems = note.todos.length;
      const nbItemsDone = note.todos.filter(it => it.done).length;
      const nbItemsRemaining = nbItems - nbItemsDone;
      let progressPct: number;

      if (nbItems != 0)
        progressPct = nbItemsDone / nbItems * 100;
      else
        progressPct = 0;
      const noteCategory = this.note.category ? this.note.category : CategoriesView.defaultCategory;
      return html`
        <div class="note-card" style="border-left-color: ${noteCategory.color}">
          <vaadin-horizontal-layout
            style="justify-content: space-between; align-items: center"
          >
            <div class="category" style="color: ${noteCategory.color};"><a href="${"/notes/categories=" + noteCategory.name}" class="link">${noteCategory.name}</a></div>
            <vaadin-context-menu
              open-on="click"
              .items=${this.items}
              @opened-changed=${(e: ContextMenuOpenedChanged) =>
                (this.contextMenuOpened = e.detail.value)}
            >
              <vaadin-button theme="icon tertiary" @click="${(e: Event) => e.preventDefault()}">
                <iron-icon class="icon" icon="vaadin:ellipsis-dots-v"></iron-icon>
              </vaadin-button>
            </vaadin-context-menu>
          </vaadin-horizontal-layout>
          <div @click="${() => Router.go('/note/' + note.id)}">
            <div class="title">${note.title}</div>
            <div class="details">
              <div>${nbItems} élément${nbItems > 1 ? 's' : ''}</div>
              <div>${nbItemsRemaining} restant${nbItemsRemaining > 1 ? 's' : ''}</div>
            </div>
            <div class="progress-bar">
              <div style="width: ${progressPct}%; background-color: ${noteCategory.color};"></div>
            </div>
          </div>
          <vaadin-dialog
            aria-lable="Supprimer une note"
            .opened="${this.deleteDialogOpened}"
            @opened-changed="${(e: CustomEvent) => (this.deleteDialogOpened = e.detail.value)}"
            .renderer="${guard([], () => (root: HTMLElement) => {
            render(
              html`
                <vaadin-vertical-layout>
                  <h3>Supprimer une note ?</h3>
                  <p style="padding: var(--lumo-space-l) 0;">Supprimer la note ${this.note?.title} ?</p>
                  <vaadin-horizontal-layout
                    style="justify-content: flex-end; width: 100%;"
                  >
                    <vaadin-button theme="tertiary" @click="${() => (this.deleteDialogOpened = false)}">Annuler</vaadin-button>
                    <vaadin-button
                      theme="primary error"
                      style="margin-left: var(--lumo-space-m);"
                      @click="${() => {
                        this.deleteNote();
                        this.deleteDialogOpened = false;
                      }}"
                    >Supprimer</vaadin-button>
                  </vaadin-horizontal-layout>
                </vaadin-vertical-layout>
              `, root
            );
          })}"
          ></vaadin-dialog>
          <vaadin-dialog
            aria-label="Modifier une note"
            .opened="${this.editDialogOpened}"
            @opened-changed="${(e: CustomEvent) => (this.editDialogOpened = e.detail.value)}"
            .renderer="${guard([], () => (root: HTMLElement) => {
              // @ts-ignore
              render(
                html`
                  <vaadin-vertical-layout
                    theme="spacing"
                    style="width: 300px; max-width: 100%; align-items: stretch;"
                  >
                    <h2 style="margin: var(${'--lumo-space-m'}) 0 0 0; font-size: 1.5em; font-weight: bold;">
                      Modifier une note
                    </h2>
                    <vaadin-vertical-layout style="align-items: stretch;">
                      <vaadin-text-field
                        label="Titre"
                        .value="${this.newNoteTitle}"
                        @change="${(e: Event) => this.newNoteTitle = (e.target as HTMLInputElement).value}"
                      ></vaadin-text-field>
                      <vaadin-select
                        placeholder="Catégorie de la note"
                        label="Catégorie"
                        value="${this.note?.category?.id || -1}"
                        @change="${(e: Event) => {
                          const newNoteCategory = this.categories.find(it => it.id === parseInt((e.target as HTMLSelectElement).value));
                          if (newNoteCategory)
                            this.newNoteCategory = newNoteCategory;
                          else
                            this.newNoteCategory = null;
                        } }"
                        .renderer="${guard(
                          [],
                          () => (root: HTMLElement) =>
                            render(html`
                                <vaadin-list-box>
                                  ${ this.categories.map(
                                    category => html`<vaadin-item value="${category.id}">${category.name}</vaadin-item>`
                                  )}
                                  <hr />
                                  <vaadin-item value="-1">Autre</vaadin-item>
                                </vaddin-list-box>
                              `, root
                            )
                        )}"
                      ></vaddin-select>
                    </vaadin-vertical-layout>
                    <vaadin-horizontal-layout theme="spacing" style="justify-content: flex-end">
                      <vaadin-button @click="${() => (this.editDialogOpened = false)}">Annuler</vaadin-button>
                      <vaadin-button
                        theme="primary"
                        @click="${() => {
                          this.updateNote();
                          this.editDialogOpened = false
                        }}"
                      >
                        Enregistrer
                      </vaadin-button>
                    </vaadin-horizontal-layout>
                  </vaadin-vertical-layout>
                `, root
              ); 
            })}"
          ></vaadin-dialog>
          <vaadin-notification
            theme="success"
            position="bottom-center"
            .opened="${this.notificationOpened}"
            @opened-changed="${(e: any) => (this.notificationOpened = e.detail.value)}"
            .renderer="${guard([], () => (root: HTMLElement) => {
              render(
                html`
                  <div>Note supprimée</div>
                  <vaadin-button
                    theme="tertiary-inline"
                    @click="${() => (this.notificationOpened = false)}"
                    aria-label="Close"
                  >
                    <iron-icon icon="lumo:cross"></iron-icon>
                  </vaadin-button>
                `, root
              );
            })}"
          ></vaadin-notification>
        </div>
      `;
    }
    else
      return html`<span>NULL</span>`
  }

  private async updateNote() {
    const note = {
      ...this.note,
      title: this.newNoteTitle,
      category: this.newNoteCategory,
    } as Note;
    const updatedNote = await NoteEndpoint.save(note);
    if (updatedNote) {
      this.note = {...updatedNote};
    }
  }

  private async deleteNote() {
    if (this.note) {
      try {
        await NoteEndpoint.delete(this.note);
        this.notificationOpened = true;
        this.onNoteDelete();
      } catch (e) {
        console.log(e);
      }
    }
  }

  createItem(text: string, iconName: string, color: string, onClick: () => any) {
    const item = window.document.createElement('vaadin-context-menu-item');
    const icon = window.document.createElement('iron-icon');

    icon.style.color = color; // 'var(--lumo-secondary-text-color)';
    icon.style.marginInlineEnd = 'var(--lumo-space-s)';
    icon.style.padding = 'var(--lumo-space-xs)';

    icon.setAttribute('icon', iconName);
    item.appendChild(icon);
    text && item.appendChild(window.document.createTextNode(text));

    item.onclick = onClick;
    return item;
  }
}
