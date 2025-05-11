import { CommonModule } from '@angular/common';
import { Component, ElementRef, HostListener, OnInit, QueryList, Renderer2, ViewChild, ViewChildren } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import {A11yModule, LiveAnnouncer } from '@angular/cdk/a11y';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {

  @ViewChildren('counterRow') counterRows: QueryList<ElementRef>;
  @ViewChild('filtroElem') filtroElem: ElementRef;

  readonly counterList : Counter[] = [
    new Counter("Semáforo Verde", 15),
    new Counter("Semáforo Vermelho", 5),
    new Counter("25 Milhas", 10),
    new Counter("50 Milhas", 12),
    new Counter("75 Milhas", 10),
    new Counter("100 Milhas", 12),
    new Counter("200 Milhas", 4),
    new Counter("Limite de Velocidade", 4),
    new Counter("Fim do Limite de Velocidade", 6),
    new Counter("Acidente", 3),
    new Counter("Reparação", 6),
    new Counter("Contramão", 4),
    new Counter("Fim da Contramão", 6),
    new Counter("Furar Pneu", 3),
    new Counter("Remendo de Pneu", 6),
    new Counter("Sem Combustível", 3),
    new Counter("Combustível", 6),
    new Counter("Saltar o Próximo Jogador", 2)
  ];

  filter : string = '';

  constructor(private announcer: LiveAnnouncer) {
  }

  @HostListener('document:keydown', ['$event'])
  doCommand(evt : KeyboardEvent){
    if(evt.ctrlKey) {

    } else {
      switch(evt.key) {

        case 'ArrowDown':
          evt.preventDefault();
          evt.stopPropagation();
          if(this.selectedCounter > -1) {
            let selectedCounter = (this.selectedCounter + 1) % this.filteredCounterList.length;
            this.counterRows.toArray()[selectedCounter]?.nativeElement.focus();
          } else {
            this.counterRows.first.nativeElement.focus();
          }
          break;
        case 'ArrowUp':
          evt.preventDefault();
          evt.stopPropagation();
          if(this.selectedCounter > -1) {
            let selectedCounter = (this.selectedCounter - 1 + this.filteredCounterList.length) % this.filteredCounterList.length;
            this.counterRows.toArray()[selectedCounter]?.nativeElement.focus();
          } else {
            this.counterRows.last.nativeElement.focus();
          }
          break;
        case 'ArrowLeft':
          evt.preventDefault();
          evt.stopPropagation();
          this.filteredCounterList[this.selectedCounter].count = Math.max(0, this.selectedCounterCount - 1);
          break;
        case 'ArrowRight':
          evt.preventDefault();
          evt.stopPropagation();
          this.filteredCounterList[this.selectedCounter].count = Math.min(this.filteredCounterList[this.selectedCounter].max, this.selectedCounterCount + 1);
          break;
        case 'Escape':
          evt.preventDefault();
          evt.stopPropagation();
          if(this.filter === '') {
            if(this.selectedCounter > -1){
              (document.activeElement as HTMLElement).blur();
            } else {
              this.counterList.forEach( value => value.count = 0 );
            }

          } else {
            this.filter = '';
          }
          break;
        case 'f':
          evt.preventDefault();
          evt.stopPropagation();
          if(this.filtroElem.nativeElement !== document.activeElement) {
            this.filtroElem.nativeElement.focus();
          }
          break;
        default:

          break;
      }
    }

  }

  get selectedCounter(): number {
    return !this.counterRows ? -1 : this.counterRows.toArray().indexOf(this.counterRows.find(item => item.nativeElement === document.activeElement) );
  }

  get selectedCounterCount(): number {
    return this.filteredCounterList[this.selectedCounter]?.count ?? 0;
  }

  rowToText(row : HTMLTableRowElement): string {
    if (row) {
      const cells = Array.from(row.getElementsByTagName('td'));
      return cells.map(cell => cell.textContent).join(' ');
    }
    return '';
  }


  get selectedRow(): HTMLTableRowElement | null {
    if (this.counterRows) {
      return this.counterRows.toArray()[this.selectedCounter]?.nativeElement;
    }
    return null;
  }


  get filteredCounterList() {
    return this.counterList.filter(value => this.normalizeStr(value.label).includes(this.normalizeStr(this.filter)))
  }

  normalizeStr(str: string): string {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  }

  broadcastMsg(msg:string) {

    this.announcer.announce(msg, 'assertive');
    //setTimeout(() => {
    //  this.announcer.clear();
    //}, 1000);
  }

}


class Counter {
  constructor(
    public label : string,
    public max : number,
    public count: number = 0
  ){}
}
