declare enum ElementPosition {
    Top = 0,
    Center = 1,
    Bottom = 2
}
declare enum Direction {
    Up = 0,
    Down = 1,
    Equal = 2
}
interface Options {
    start: number;
    min: number;
    max: number;
}
declare class StackIcon {
    protected element: HTMLElement;
    protected readonly elementSpacing: number;
    protected svgElement: SVGElement | null;
    protected topElement: SVGPolygonElement | null;
    protected topAnimationElement: SVGPolygonElement | null;
    protected stackItems: NodeListOf<SVGPolylineElement> | null;
    protected stackItemsIndicator: HTMLElement | null;
    protected decrementButton: HTMLElement | null;
    protected incrementButton: HTMLElement | null;
    protected numberOfItems: number;
    protected previousNumberOfItems: number;
    protected defaultOptions: Options;
    protected options: Options;
    constructor(element: HTMLElement);
    initialize(): void;
    decrement(): void;
    increment(): void;
    setNumberOfItems(number: number): void;
    protected setOptions(): void;
    protected initializeStack(): void;
    protected setTopElementPosition(position: ElementPosition): void;
    protected show(): void;
    protected bindEventListener(): void;
    protected updateStackItemsNumber(): void;
    protected popStackItemsBubble(): void;
    protected getDirection(): Direction;
    protected getCurrentLevel(): number;
    protected animateStack(): void;
    protected animateToLevelInDirection(level: number, direction: Direction): void;
}
export default StackIcon;
