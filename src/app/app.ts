import {Component, ElementRef, signal, ViewChild} from '@angular/core';
import {NavigationEnd, Router, RouterOutlet} from '@angular/router';
import {SidebarNav} from './components/sidebar-nav/sidebar-nav';
import {Title} from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    SidebarNav
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('devtasker');
  @ViewChild('pageTitle', { static: true }) pageTitle!: ElementRef<HTMLElement>;

  constructor(private router: Router, private titleService: Title) {}

  ngOnInit(): void {
    this.router.events.subscribe({
      next: (event) => {
        if (event instanceof NavigationEnd) {
          setTimeout(() => {
            this.pageTitle.nativeElement.innerHTML = this.titleService.getTitle();
          }, 50);
        }
      },
    });
  }
}
