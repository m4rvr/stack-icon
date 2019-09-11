import '../css/style.css';
import StackIcon from './StackIcon';

const allStacks: NodeListOf<HTMLElement> = document.querySelectorAll(
  '[data-stack]',
);

allStacks.forEach((element: HTMLElement) => {
  const stackIcon = new StackIcon(element);
  stackIcon.initialize();
});
