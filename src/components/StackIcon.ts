import { TimelineLite, TweenLite, Elastic } from 'gsap/all';

enum ElementPosition {
  Top,
  Center,
  Bottom,
}

enum Direction {
  Up,
  Down,
  Equal,
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
    }
  }

  public setNumberOfItems(number: number): void {
    this.previousNumberOfItems = this.numberOfItems;
    if (number !== this.previousNumberOfItems) {
      this.numberOfItems = number;
      this.updateStackItemsNumber();
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

  protected getDirection(): Direction {
    let direction: Direction = Direction.Equal;

    if (this.numberOfItems > this.previousNumberOfItems) {
      direction = Direction.Up;
    } else if (this.numberOfItems < this.previousNumberOfItems) {
      direction = Direction.Down;
    }

    return direction;
  }

  protected getCurrentLevel(): number {
    return this.previousNumberOfItems > 3 ? 3 : this.previousNumberOfItems;
  }

  protected animateStack(): void {
    const direction: Direction = this.getDirection();

    if (this.numberOfItems === 1) {
      this.animateToLevelInDirection(1, direction);
    } else if (this.numberOfItems === 2) {
      this.animateToLevelInDirection(2, direction);
    } else if (
      direction === Direction.Up &&
      this.numberOfItems >= 3 &&
      this.previousNumberOfItems < 3
    ) {
      this.animateToLevelInDirection(3, direction);
    }
  }

  protected animateToLevelInDirection(
    level: number,
    direction: Direction,
  ): void {
    if (
      this.svgElement &&
      this.topElement &&
      this.topAnimationElement &&
      this.stackItems
    ) {
      const currentLevel: number = this.getCurrentLevel();

      const timeline = new TimelineLite({
        ease: Elastic.easeInOut,
      });

      if (direction === Direction.Up) {
        this.svgElement.prepend(this.topAnimationElement);

        timeline.set(this.topAnimationElement, {
          autoAlpha: 0,
        });

        timeline.to(this.topAnimationElement, 0.3, {
          autoAlpha: 1,
          y: this.elementSpacing * 2 - (currentLevel - 1) * this.elementSpacing,
        });

        timeline.set(this.topAnimationElement, {
          autoAlpha: 0,
          onComplete: () => {
            TweenLite.set(this.topAnimationElement, {
              y: 0,
            });
          },
        });

        const itemsTimeline = new TimelineLite({
          ease: Elastic.easeInOut,
        });

        itemsTimeline.staggerTo(
          this.stackItems,
          0.3,
          {
            autoAlpha: 1,
            delay: level - currentLevel > 1 ? 0 : 0.3,
          },
          0.3,
        );
      } else if (direction === Direction.Down) {
        if (currentLevel - level === 1) {
          TweenLite.to(this.stackItems[level - 1], 0.3, {
            autoAlpha: 0,
            ease: Elastic.easeInOut,
          });
        } else {
          const itemsTimeline = new TimelineLite({
            ease: Elastic.easeInOut,
          });

          itemsTimeline.staggerTo(
            Array.from(this.stackItems).reverse(),
            0.3,
            {
              autoAlpha: 0,
            },
            0.3,
          );
        }
      }

      timeline.to(this.topElement, 0.3, {
        y: this.elementSpacing * 3 - level * this.elementSpacing,
      });
    }
  }
}

export default StackIcon;
