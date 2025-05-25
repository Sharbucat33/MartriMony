import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';

declare const bootstrap: any;

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss'],
})
export class GalleryComponent implements AfterViewInit {
  @ViewChild('carouselElement', { static: true }) carouselElement!: ElementRef;
  carousel: any;
  images = [
    '../../assets/Images/download (1).jpeg',
    '../../assets/Images/1 (2).jpeg',
    '../../assets/Images/1 (3).jpeg',
    '../../assets/Images/1 (4).jpeg',
  ];
  currentIndex = 0;

  /**
   * @method AfterViewInit()
   * @description to set the carousel touch swiping in mobile view
   */
  ngAfterViewInit(): void {
    const el = this.carouselElement.nativeElement;

    this.carousel = new bootstrap.Carousel(el, {
      interval: false,
      ride: false,
      touch: true,
      wrap: true,
    });

    let startX = 0;

    const handleTouchStart = (e: TouchEvent) => {
      startX = e.touches[0].clientX;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      const endX = e.changedTouches[0].clientX;
      const diff = endX - startX;

      if (diff > 40) {
        this.carousel.prev();
      } else if (diff < -40) {
        this.carousel.next();
      }
    };

    el.addEventListener('slid.bs.carousel', (event: any) => {
      this.currentIndex = event.to;
    });
    el.addEventListener('touchstart', handleTouchStart, { passive: true });
    el.addEventListener('touchend', handleTouchEnd, { passive: true });
  }

  /**
   * @method goToSlide()
   * @description to get the index when clicking the carousel dot button
   * @param index index value
   */
  goToSlide(index: number) {
    this.currentIndex = index;
    this.carousel.to(index);
  }
}
