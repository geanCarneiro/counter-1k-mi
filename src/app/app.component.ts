import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'counter';

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

  tecla : string;

  filter : string = '';

  selectedCounter = -1;

  @HostListener('document:keydown', ['$event'])
  doCommand(evt : KeyboardEvent){
    

    if(evt.ctrlKey) {

    } else {
      this.tecla = evt.key;
      switch(evt.key) {
        
        case 'ArrowDown':
          evt.preventDefault();
          evt.stopPropagation();
          this.selectedCounter = (this.selectedCounter + 1) % this.filteredCounterList.length;
          break;
        case 'ArrowUp':
          evt.preventDefault();
          evt.stopPropagation();
          this.selectedCounter = (this.selectedCounter - 1 + this.filteredCounterList.length) % this.filteredCounterList.length;
          break;
        case 'ArrowLeft':
          evt.preventDefault();
          evt.stopPropagation();
          this.filteredCounterList[this.selectedCounter].count = Math.max(0, this.filteredCounterList[this.selectedCounter].count - 1);
          break;
        case 'ArrowRight':
          evt.preventDefault();
          evt.stopPropagation();
          this.filteredCounterList[this.selectedCounter].count = Math.min(this.filteredCounterList[this.selectedCounter].max, this.filteredCounterList[this.selectedCounter].count + 1);
          break;
        case 'Escape':
          evt.preventDefault();
          evt.stopPropagation();
          if(this.filter === '') {
            if(this.selectedCounter > -1){
              this.selectedCounter = -1;
            } else {
              this.counterList.forEach( value => value.count = 0 );
            }
            
          } else {
            this.filter = '';
          }
          break;
        default:
          if(isNaN(+evt.key)){
            this.selectedCounter = -1;
            if(evt.key.length === 1){
              this.filter += evt.key;
            } else {
              switch(evt.key) {
                case 'Backspace':
                  this.filter = this.filter.slice(0, -1);
                  break;
              }
            }
          }
          break;
      }
    }
    
  }

  get filteredCounterList() {
    return this.counterList.filter(value => this.normalizeStr(value.label).includes(this.normalizeStr(this.filter)))
  }

  normalizeStr(str: string): string {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  }

}


class Counter {
  constructor(
    public label : string,
    public max : number,
    public count: number = 0
  ){}
}