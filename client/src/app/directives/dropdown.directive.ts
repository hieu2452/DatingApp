import { Directive, ElementRef, HostBinding, HostListener, Input, ViewChild } from '@angular/core';

@Directive({
  selector: '[appDropdown]',
  exportAs: 'appDropDown'
})
export class DropdownDirective {

  constructor(private elRef: ElementRef) {


  }

  @HostBinding('class.show') isOpen = false;
  @HostListener('document:click', ['$event']) toggleOpen(event: Event) {
    // console.log(this.elRef.nativeElement.contains(event.target))
    this.isOpen = this.elRef.nativeElement.contains(event.target) ? !this.isOpen : false;
  }
}
