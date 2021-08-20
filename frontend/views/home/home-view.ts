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
// import '@vaadin/vaadin-icons/vaadin-iconset';

import * as TodoEndpoint from 'Frontend/generated/TodoEndpoint';
import Note from "Frontend/generated/com/example/application/data/entity/Note";
import TodoModel from 'Frontend/generated/com/example/application/data/entity/TodoModel';
import { Binder, field } from '@vaadin/form';
import NoteModel from "Frontend/generated/com/example/application/data/entity/NoteModel";
import {NoteEndpoint} from "Frontend/generated/NoteEndpoint";
import Todo from "Frontend/generated/com/example/application/data/entity/Todo";

@customElement('home-view')
export class HomeView extends LitElement {
  @state()
  private viewingNote: Note | null = null;
  @state()
  private notes: Note[] = [];
  @query('#add-task')
  private addTaskInput!: HTMLInputElement

  private binder = new Binder(this, NoteModel);
  private taskBinder = new Binder(this, TodoModel);

  static styles = css`
   :host {
     display: block;
     padding: var(--lumo-space-m) var(--lumo-space-l);
   }
   .line-through {
     text-decoration: line-through;
   }
 `;

  render() {
    if (this.viewingNote)
        return html`
          <vaadin-button @click="${this.displayAllNotes}">Back to list</vaadin-button>
          <h1>${this.viewingNote.title}</h1>  
              <ul>
                  ${this.viewingNote.todos.map((todo) => html`<li>${todo.task}</li>`)}
              </ul>
              <div class="form">
                  <vaadin-text-field id="add-task" ...="${field(this.taskBinder.model.task)}"></vaadin-text-field>
                  <vaadin-button
                    theme="primary"
                    @click="${this.addTask}"
                    ?disabled="${this.taskBinder.invalid}"
                  >Add task</vaadin-button>
              </div>
        `;
    else
        return html`
            <div class="form">
                <vaadin-text-field ...="${field(this.binder.model.title)}"></vaadin-text-field>
                <vaadin-button
                        theme="primary"
                        @click="${this.createNote}"
                        ?disabled="${this.binder.invalid}">Add</vaadin-button>
            </div>
            <div>
                ${this.notes.map(note => html`
                <note-card .note="${note}" @click="${() => this.displayOneNote(note.id as number)}"></note-card>
              `)}
            </div>
            <div><a href="/logout" class="ms-auto">Log out</a></div>
        `;
  }

  async connectedCallback() {
    super.connectedCallback();
    this.notes = await NoteEndpoint.findAll();
  }

  async displayOneNote(noteId: number) {
    const note = await NoteEndpoint.findById(noteId)
    if (note as Note)
      this.viewingNote = note as Note
    // TODO else display en error
  }

  displayAllNotes() {
    this.viewingNote = null
  }

  async createNote() {
    const createNote = await this.binder.submitTo(NoteEndpoint.save);
    if (createNote) {
      this.notes = [...this.notes, createNote];
      this.binder.clear();
    }
  }

  async addTask() {
    if (this.viewingNote) {
      const todo = {task: this.addTaskInput.value, done: false, note: this.viewingNote} as Todo;
      const savedTodo = await TodoEndpoint.save(todo);
      if (savedTodo) {
        this.viewingNote = (await NoteEndpoint.findById(this.viewingNote.id as number)) as Note
        this.taskBinder.clear()
        this.requestUpdate()
      }
    }
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
      padding: var(--lumo-space-s) 0;
    }
    .details {
      font-size: var(--lumo-font-size-s);
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
      console.log('Note: ', note)
      // if (!note.todos)
      //   note.todos = []
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
