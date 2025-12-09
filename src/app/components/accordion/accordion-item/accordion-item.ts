import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
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
export class AccordionItem implements AfterViewInit {
  @ViewChild('iconEl', { static: true, read: ElementRef }) iconRef!: ElementRef<HTMLElement>;
  @ViewChild('contentEl', { static: true }) contentRef!: ElementRef<HTMLElement>;

  protected readonly faChevronDown = faChevronDown;

  isOpen = false;

  ngAfterViewInit() {
    const icon = this.iconRef.nativeElement;
    const content = this.contentRef.nativeElement;

    gsap.set(icon, {
      rotation: 0,
      transformOrigin: '50% 50%',
    });

    gsap.set(content, {
      height: 0
    });
  }

  onClickHeader() {
    const icon = this.iconRef.nativeElement;
    const content = this.contentRef.nativeElement;

    if (this.isOpen) {
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
    } else {
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
    }

    this.isOpen = !this.isOpen;
  }
}
