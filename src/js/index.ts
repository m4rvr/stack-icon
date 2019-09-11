import '../css/style.css'
import StackIcon from './StackIcon'

document.querySelectorAll('[data-stack]').forEach(element => {
  const stackIcon = new StackIcon(element)
  stackIcon.initialize()
})
