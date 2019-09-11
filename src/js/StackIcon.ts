import { TimelineLite, TweenLite, Elastic } from 'gsap/all';

enum ElementPosition {
  Top,
  Center,
  Bottom,
}

class StackIcon {
  protected element: HTMLElement;
  protected readonly elementSpacing: number = 5;
  protected topElement: SVGPolygonElement | null;
  protected stackItems: NodeListOf<SVGPolylineElement> | null;
  protected stackItemsIndicator: HTMLElement | null;
  protected decrementButton: HTMLElement | null;
  protected incrementButton: HTMLElement | null;
  protected numberOfItems = 1;

  constructor(element: HTMLElement) {
    this.element = element;
    this.topElement = element.querySelector('polygon');
    this.stackItems = element.querySelectorAll('polyline');
    this.stackItemsIndicator = element.querySelector('[data-stack-items]');
    this.decrementButton = element.querySelector('[data-decrement]');
    this.incrementButton = element.querySelector('[data-increment]');
  }

  public initialize(): void {
    this.setTopElementPosition(ElementPosition.Bottom);
    this.bindEventListener();
    this.updateStackItemsNumber();
    this.show();
  }

  public decrement(): void {
    if (this.numberOfItems - 1 > 0) {
      this.numberOfItems = this.numberOfItems - 1;
      this.updateStackItemsNumber();

      if (this.numberOfItems < 3) {
        this.handleStackAnimation();
      }
    }
  }

  public increment(): void {
    this.numberOfItems = this.numberOfItems + 1;
    this.handleStackAnimation();
    this.updateStackItemsNumber();
  }

  protected setTopElementPosition(position: ElementPosition): void {
    TweenLite.set(this.topElement, {
      y: position * this.elementSpacing,
    });
  }

  protected show(): void {
    TweenLite.to(this.element, 0.3, {
      autoAlpha: 1,
    });
  }

  protected bindEventListener(): void {
    if (this.decrementButton) {
      this.decrementButton.addEventListener('click', () => {
        this.decrement();
      });
    }

    if (this.incrementButton) {
      this.incrementButton.addEventListener('click', () => {
        this.increment();
      });
    }
  }

  protected updateStackItemsNumber(): void {
    if (this.stackItemsIndicator) {
      this.stackItemsIndicator.innerHTML = String(this.numberOfItems);
      this.popStackItemsBubble();
    }
  }

  protected popStackItemsBubble(): void {
    if (this.stackItemsIndicator) {
      const timeline = new TimelineLite({
        ease: Elastic.easeInOut,
      });

      timeline.to(this.stackItemsIndicator, 0.15, {
        y: -3,
      });

      timeline.to(this.stackItemsIndicator, 0.15, {
        y: 2,
      });

      timeline.to(this.stackItemsIndicator, 0.15, {
        y: 0,
      });
    }
  }

  protected handleStackAnimation(): void {
    switch (this.numberOfItems) {
      case 1:
        console.log('show 1!');
        break;

      case 2:
        console.log('show 2!');
        break;

      case 3:
        console.log('show 3!');
        break;
    }
  }
}

export default StackIcon;
