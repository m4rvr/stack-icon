import { TimelineLite, TweenLite, Elastic } from 'gsap/all';

enum ElementPosition {
  Top,
  Center,
  Bottom,
}

enum Direction {
  Up,
  Down,
}

interface Options {
  start: number;
  min: number;
  max: number;
}

class StackIcon {
  protected element!: HTMLElement;
  protected readonly elementSpacing: number = 5;
  protected svgElement!: SVGElement | null;
  protected topElement!: SVGPolygonElement | null;
  protected topAnimationElement!: SVGPolygonElement | null;
  protected stackItems!: NodeListOf<SVGPolylineElement> | null;
  protected stackItemsIndicator!: HTMLElement | null;
  protected decrementButton!: HTMLElement | null;
  protected incrementButton!: HTMLElement | null;
  protected numberOfItems = 1;
  protected previousNumberOfItems = this.numberOfItems;
  protected defaultOptions: Options = {
    start: 1,
    min: 1,
    max: 99,
  };

  protected options: Options = {
    ...this.defaultOptions,
  };

  constructor(element: HTMLElement) {
    this.element = element;
    this.svgElement = element.querySelector('svg');
    this.topElement = element.querySelector('polygon');
    if (this.topElement) {
      this.topAnimationElement = this.topElement.cloneNode(
        false,
      ) as SVGPolygonElement;
    }
    this.stackItems = element.querySelectorAll('polyline');
    this.stackItemsIndicator = element.querySelector('[data-stack-items]');
    this.decrementButton = element.querySelector('[data-decrement]');
    this.incrementButton = element.querySelector('[data-increment]');
  }

  public initialize(): void {
    this.setOptions();
    this.initializeStack();
  }

  public decrement(): void {
    if (
      this.numberOfItems - 1 > 0 &&
      this.numberOfItems - 1 >= this.options.min
    ) {
      this.setNumberOfItems(this.numberOfItems - 1);
    }
  }

  public increment(): void {
    if (this.numberOfItems + 1 <= this.options.max || this.options.max === 0) {
      this.setNumberOfItems(this.numberOfItems + 1);
      this.animateStack();
    }
  }

  protected setOptions(): void {
    if (this.element.dataset.stack) {
      this.options.start = Math.max(
        Math.ceil(Number(this.element.dataset.stack)),
        1,
      );
    }

    if (this.element.dataset.min) {
      const min = Math.ceil(Number(this.element.dataset.min));

      if (min >= 1) {
        this.options.min = min;
      } else {
        console.warn(
          `[Stack Icon] data-min is lower than 1, fallback to default ${this.defaultOptions.min}`,
        );
      }
    }

    if (this.element.dataset.max) {
      const max = Math.ceil(Number(this.element.dataset.max));

      if (max >= 0) {
        this.options.max = max;
      } else {
        const defaultMax =
          this.defaultOptions.max === 0
            ? `${this.defaultOptions.max} (infinite)`
            : this.defaultOptions.max;

        console.warn(
          `[Stack Icon] data-max is lower than 0, fallback to default ${defaultMax}`,
        );
      }
    }
  }

  protected initializeStack(): void {
    this.setNumberOfItems(this.options.start);
    this.setTopElementPosition(ElementPosition.Bottom);
    this.bindEventListener();
    this.updateStackItemsNumber();
    this.show();
  }

  protected setNumberOfItems(number: number): void {
    const direction =
      number > this.numberOfItems ? Direction.Up : Direction.Down;
    console.log(direction);
    this.numberOfItems = number;
    this.updateStackItemsNumber();

    if (this.numberOfItems < 3) {
      this.animateStack();
    }
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

  protected animateStack(): void {
    switch (this.numberOfItems) {
      case 1:
        console.log('show 1!');
        break;

      case 2:
        this.testAnimation();
        break;

      case 3:
        console.log('show 3!');
        break;
    }
  }

  protected testAnimation(): void {
    if (
      this.svgElement &&
      this.topElement &&
      this.topAnimationElement &&
      this.stackItems
    ) {
      const timeline = new TimelineLite({
        ease: Elastic.easeInOut,
      });

      this.svgElement.prepend(this.topAnimationElement);

      timeline.set(this.topAnimationElement, {
        autoAlpha: 0,
      });

      timeline.to(this.topAnimationElement, 0.3, {
        autoAlpha: 1,
        y: 10,
      });

      timeline.set(this.topAnimationElement, {
        autoAlpha: 0,
      });

      timeline.to(this.stackItems, 0.3, {
        autoAlpha: 1,
      });

      timeline.to(
        this.topElement,
        0.3,
        {
          y: 0,
        },
        '-=0.3',
      );
    }
  }
}

export default StackIcon;
