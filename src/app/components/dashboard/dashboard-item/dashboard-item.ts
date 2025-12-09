import {Component, HostBinding, Input, Type} from '@angular/core';

@Component({
  selector: 'app-dashboard-item',
  imports: [],
  templateUrl: './dashboard-item.html',
  styleUrl: './dashboard-item.css',
})
export class DashboardItem {
  @Input() colSpan = 1;
  @Input() rowSpan = 1;
  @Input() component!: Type<unknown>;

  @HostBinding('class')
  readonly baseClasses = 'details-panel';

  @HostBinding('style.gridColumn')
  get gridColumn() {
    return `span ${this.colSpan} / span ${this.colSpan}`;
  }

  @HostBinding('style.gridRow')
  get gridRow() {
    return `span ${this.rowSpan} / span ${this.rowSpan}`;
  }
}
