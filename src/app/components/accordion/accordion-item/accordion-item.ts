import {
  AfterViewInit, ChangeDetectorRef,
  Component,
  ElementRef,
  input, OnInit,
  signal,
  ViewChild,
} from '@angular/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { gsap } from 'gsap';

@Component({
  selector: 'app-accordion-item',
  standalone: true,
  imports: [FaIconComponent],
  templateUrl: './accordion-item.html',
  styleUrl: './accordion-item.css',
})
export class AccordionItem implements OnInit, AfterViewInit {
  @ViewChild('iconEl', { read: ElementRef }) iconRef!: ElementRef<HTMLElement>;
  @ViewChild('contentEl') contentRef!: ElementRef<HTMLElement>;

  protected readonly faChevronDown = faChevronDown;

  isOpen = signal(false);
  defaultOpen = input(false);

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit() {
  }

  ngAfterViewInit() {
    const icon = this.iconRef.nativeElement;
    const content = this.contentRef.nativeElement;
    this.isOpen.set(this.defaultOpen());

    console.log('[AccordionItem] defaultOpen:', this.defaultOpen());
    console.log('[AccordionItem] isOpen:', this.isOpen());
    console.log('[AccordionItem] icon:', icon);
    console.log('[AccordionItem] content:', content);

    if (this.isOpen()) {
      gsap.set(icon, {
        rotation: 180,
        transformOrigin: '50% 50%',
      });

      gsap.set(content, {
        height: 'auto',
        overflow: 'hidden',
      });

      this.cdr.markForCheck();

    } else {
      gsap.set(icon, {
        rotation: 0,
        transformOrigin: '50% 50%',
      });

      gsap.set(content, {
        height: 0,
        overflow: 'hidden',
      });
    }
  }

  onClickHeader() {
    const icon = this.iconRef.nativeElement;
    const content = this.contentRef.nativeElement;

    const opening = !this.isOpen();
    this.isOpen.set(opening);

    gsap.killTweensOf([icon, content]);

    if (opening) {
      gsap.to(icon, {
        rotation: 180,
        duration: 0.2,
        ease: 'power4.out',
      });

      gsap.fromTo(
        content,
        { height: 0 },
        {
          height: content.scrollHeight,
          duration: 0.2,
          ease: 'power4.out',
          onComplete: () => {
            content.style.height = 'auto';
          },
        }
      );
    } else {
      gsap.to(icon, {
        rotation: 0,
        duration: 0.2,
        ease: 'power4.out',
      });

      gsap.fromTo(
        content,
        { height: content.scrollHeight },
        {
          height: 0,
          duration: 0.2,
          ease: 'power4.out',
        }
      );
    }
  }
}
