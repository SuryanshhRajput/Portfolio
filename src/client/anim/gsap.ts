import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollSmoother } from 'gsap/ScrollSmoother';
import { SplitText } from 'gsap/SplitText';

gsap.registerPlugin(ScrollTrigger, ScrollSmoother, SplitText);
gsap.defaults({ ease: 'power3.out', duration: 0.9 });
// Mobile browsers resize the viewport as the address bar hides; ignore that to avoid jumps.
ScrollTrigger.config({ ignoreMobileResize: true });

export { gsap, ScrollTrigger, ScrollSmoother, SplitText };

/** Wide screens with a mouse get the pinned, scrubbed scenes; phones get native scrolling strips. */
export const WIDE = '(min-width: 960px) and (min-height: 560px)';
