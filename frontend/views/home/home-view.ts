import {
  customElement,
  html,
  css,
  LitElement, state, query, property
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

import '../../components/Fab';

import Note from "Frontend/generated/com/example/application/data/entity/Note";
import { NoteEndpoint } from "Frontend/generated/NoteEndpoint";
import { guard } from "lit-html/directives/guard";
import { render } from 'lit-html';
import { Router } from "@vaadin/router";

@customElement('home-view')
export class HomeView extends LitElement {
  @state()
  private notes: Note[] | null = null;
  @state()
  private dialogOpened = false;
  @state()
  private newNoteTitle: string = '';
  @state()
  private newNoteCategory: string = '';
  @query('#add-task')
  private addTaskInput!: HTMLInputElement

  static styles = css`
   :host {
     display: block;
     padding: var(--lumo-space-m) var(--lumo-space-l);
   }
 `;

  render() {
    return html`
      <div>
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
          : this.notes.map(note => html`
              <note-card .note="${note}" @click="${() => Router.go('/note/' + note.id)}"></note-card>
            `)
        }
      </div>
      <fab-comp .icon="${'lumo:plus'}" .onMouseClick="${() => (this.dialogOpened = true)}"></fab-comp>
      <vaadin-dialog
        aria-label="Create note"
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
                    @change="${(e: Event) => this.newNoteCategory = (e.target as HTMLSelectElement).value}"
                    .renderer="${guard(
                      [],
                      () => (root: HTMLElement) =>
                        render(html`
                          <vaadin-list-box>
                            <vaadin-item value="Épicerie">Épicerie</vaadin-item>
                            <vaadin-item value="Work">Work</vaadin-item>
                            <vaadin-item value="Personnel">Personnel</vaadin-item>
                            <vaadin-item value="Épicerie">Épicerie</vaadin-item>
                            <vaadin-item value="Santé">Santé</vaadin-item>
                            <vaadin-item value="Sorties">Sorties</vaadin-item>
                            <vaadin-item value="Autres">Autres</vaadin-item>
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
  }

  async createNote() {
    const note = {
      title: this.newNoteTitle,
      category: this.newNoteCategory,
      color: this.getRandomColor(),
      todos: [],
      created: '', // date of creation is handle by server
    } as Note;
    // const createNote = await this.binder.submitTo(NoteEndpoint.save);
    const createdNote = await NoteEndpoint.save(note);
    if (createdNote) {
      this.newNoteTitle = '';
      this.newNoteCategory = '';
      if (this.notes !== null)
        this.notes = [createdNote, ...this.notes,];
      else
        this.notes = [createdNote];
      // this.binder.clear();
    }
  }

  getRandomColor(): string {
    const colors = [
      "crimson",
      "lime",
      "blue",
      "aquamarine",
      "deepskyblue",
      "blueviolet",
      "brown",
      "darkcyan",
      "darkgoldenrod",
    ];
    const random = Math.floor(Math.random() * colors.length);
    return colors[random];
  }
}

@customElement('note-card')
export class NoteCard extends LitElement {
  @property()
  note: Note | null = null;

  static styles = css`
    .note-card {
      display: flex;
      flex-flow: column nowrap;
      /* height: 150px; */
      padding: var(--lumo-space-s) var(--lumo-space-l);
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
    }
    .progress-bar div {
      height: 100%;
      border-radius: 20px;
    }
    .menu-button {
      
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
      return html`
          <div class="note-card" style="border-left-color: ${note.color}">
              <!--        <vaadin-button class="menu-button" theme="icon" aria-label="Close">-->
              <!--          <vaadin-icon icon="vaadin:chevron-down-small"></vaadin-icon>-->
              <!--        </vaadin-button>-->
              <div class="category" style="color: ${note.color};">${note.category}</div>
              <div class="title">${note.title}</div>
              <div class="details">
                  <div>${nbItems} élément${nbItems > 1 ? 's' : ''}</div>
                  <div>${nbItemsRemaining} restant${nbItemsRemaining > 1 ? 's' : ''}</div>
              </div>
              <div class="progress-bar">
                  <div style="width: ${progressPct}%; background-color: ${note.color};"></div>
              </div>
          </div>
          </div>
      `;
    }
    else
      return html`<span>NULL</span>`
  }
}
