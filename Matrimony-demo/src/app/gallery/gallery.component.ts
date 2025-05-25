import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  ViewChild,
} from '@angular/core';

declare const bootstrap: any;

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss'],
})
export class GalleryComponent implements AfterViewInit, OnDestroy {
  @ViewChild('carouselElement', { static: true }) carouselElement!: ElementRef;
  carousel: any;
  images = [
    '../../assets/Images/download (1).jpeg',
    '../../assets/Images/1 (2).jpeg',
    '../../assets/Images/1 (3).jpeg',
    '../../assets/Images/1 (4).jpeg',
  ];
  currentIndex = 0;
  referenceCarouselElement: any;
  handleTouchStart: any;
  handleTouchEnd: any;
  handleSlide: any;

  /**
   * @method AfterViewInit()
   * @description to set the carousel touch swiping in mobile view
   */
  ngAfterViewInit(): void {
    this.referenceCarouselElement = this.carouselElement.nativeElement;

    this.carousel = new bootstrap.Carousel(this.referenceCarouselElement, {
      interval: false,
      ride: false,
      touch: true,
      wrap: true,
    });

    let startX = 0;

    this.handleTouchStart = (e: TouchEvent) => {
      startX = e.touches[0].clientX;
    };

    this.handleTouchEnd = (e: TouchEvent) => {
      const endX = e.changedTouches[0].clientX;
      const diff = endX - startX;

      if (diff > 40) {
        this.carousel.prev();
      } else if (diff < -40) {
        this.carousel.next();
      }
    };

    this.handleSlide = (event: any) => {
      this.currentIndex = event.to;
    };

    this.referenceCarouselElement.addEventListener(
      'slid.bs.carousel',
      this.handleSlide
    );
    this.referenceCarouselElement.addEventListener(
      'touchstart',
      this.handleTouchStart,
      { passive: true }
    );
    this.referenceCarouselElement.addEventListener(
      'touchend',
      this.handleTouchEnd,
      { passive: true }
    );
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

  ngOnDestroy(): void {
    this.referenceCarouselElement.removeEventListener(
      'touchstart',
      this.handleTouchStart
    );
    this.referenceCarouselElement.removeEventListener(
      'touchend',
      this.handleTouchEnd
    );

    this.referenceCarouselElement.removeEventListener(
      'slid.bs.carousel',
      this.handleSlide
    );
  }
}
