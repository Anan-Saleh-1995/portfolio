import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const MOBILE_MENU_EVENT = "portfolio:mobile-menu-toggle";

interface MobileMenuToggleDetail {
  open: boolean;
}

export const useSmoothScroll = () => {
  useEffect(() => {
    const lenis = new Lenis({
      anchors: true,
      lerp: 0.1,
      smoothWheel: true,
    });

    lenis.on("scroll", () => ScrollTrigger.update());

    const tickerCallback = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(tickerCallback);
    gsap.ticker.lagSmoothing(0);

    const handleMenuToggle = (event: Event) => {
      const { detail } = event as CustomEvent<MobileMenuToggleDetail>;

      if (detail?.open) {
        lenis.stop();
        document.documentElement.style.overflow = "hidden";
        document.body.style.overflow = "hidden";
        return;
      }

      lenis.start();
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
      ScrollTrigger.refresh();
    };

    window.addEventListener(MOBILE_MENU_EVENT, handleMenuToggle);

    return () => {
      window.removeEventListener(MOBILE_MENU_EVENT, handleMenuToggle);
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
      lenis.destroy();
      gsap.ticker.remove(tickerCallback);
    };
  }, []);
};
