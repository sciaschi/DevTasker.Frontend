import {Component, ElementRef, QueryList, ViewChild, ViewChildren} from '@angular/core';
import {RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import { gsap } from "gsap";
import {faFolderClosed, faHome} from '@fortawesome/free-solid-svg-icons';


@Component({
  selector: 'app-sidebar-nav',
  imports: [
    RouterLink,
    RouterLinkActive,
    FontAwesomeModule
  ],
  templateUrl: './sidebar-nav.html',
  styleUrl: './sidebar-nav.css',
})
export class SidebarNav {
  @ViewChild('sidebarnav', { static: true }) sidebar!: ElementRef<HTMLElement>;
  @ViewChild('companyTitle', { static: true }) companyTitle!: ElementRef<HTMLElement>;
  @ViewChildren('navLabel') navLabels!: QueryList<ElementRef<HTMLElement>>;
  @ViewChildren('navButton') navButtons!: QueryList<ElementRef<HTMLElement>>;

  private hoverTl!: gsap.core.Timeline;

  constructor() { }

  ngAfterViewInit() {
    this.hoverTl = gsap.timeline({
      paused: true,
      defaults: { duration: 0.3, ease: 'power4.out' },
    });

    this.hoverTl
      .to(this.sidebar.nativeElement, { width: 300 }, 0)
      .to(
        this.navLabels.map((l: ElementRef<HTMLElement>) => l.nativeElement),
        { opacity: 1 },
        0
      )
      .to(this.companyTitle.nativeElement, { opacity: 1 }, 0);
  }

  onMouseEnter() {
    this.hoverTl.play();
  }
  onMouseLeave() {
    this.hoverTl.reverse();
  }

  protected readonly faFolderClosed = faFolderClosed;
  protected readonly faHome = faHome;
}
