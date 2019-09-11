import { TweenLite } from 'gsap/all';

enum ElementPosition {
  Top,
  Center,
  Bottom
}

class StackIcon {
  protected element: Element
  protected elementSpacing: number = 5
  protected topElement: SVGPolygonElement | null
  protected decrementButton: Element | null
  protected incrementButton: Element | null
  protected numberOfItems: number = 1
  
  constructor(element: Element) {
    this.element = element
    this.topElement = element.querySelector('polygon')
    this.decrementButton = element.querySelector('[data-decrement]')
    this.incrementButton = element.querySelector('[data-increment]')
  }

  public initialize(): void {
    this.setTopElementPosition(ElementPosition.Bottom)
    this.bindEventListener()

    this.show()
  }

  public decrement(): void {
    console.log('decrement')
  }

  public increment(): void {
    console.log('increment')
  }

  protected setTopElementPosition(position: ElementPosition): void {
    TweenLite.set(this.topElement, {
      y: position * this.elementSpacing
    })
  }

  protected show(): void {
    TweenLite.to(this.element, 0.3, {
      autoAlpha: 1
    })
  }

  protected bindEventListener(): void {
    if (this.decrementButton) {
      this.decrementButton.addEventListener('click', () => {
        this.decrement()
      })
    }

    if (this.incrementButton) {
      this.incrementButton.addEventListener('click', () => {
        this.increment()
      })
    }
  }
}

export default StackIcon;
