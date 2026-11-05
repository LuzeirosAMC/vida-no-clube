"use client";

import { useEffect } from "react";

const revealSelector = [
  ".section-intro",
  ".section-heading-row",
  ".story-grid",
  ".facts-grid",
  ".activity-card",
  ".memory-card",
  ".participate-copy",
  ".participate-panel",
  ".safe-community > div",
].join(",");

export function ScrollEffects() {
  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const revealItems = Array.from(document.querySelectorAll<HTMLElement>(revealSelector));

    revealItems.forEach((item, index) => {
      item.classList.add("scroll-reveal");
      item.style.setProperty("--reveal-delay", `${(index % 4) * 70}ms`);
    });

    document.body.classList.add("reveal-ready");

    const observer = reduceMotion
      ? null
      : new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (!entry.isIntersecting) return;
              entry.target.classList.add("is-revealed");
              observer?.unobserve(entry.target);
            });
          },
          { rootMargin: "0px 0px -9%", threshold: 0.08 },
        );

    revealItems.forEach((item) => {
      if (reduceMotion) item.classList.add("is-revealed");
      else observer?.observe(item);
    });

    const handleAnchorClick = (event: MouseEvent) => {
      const link = (event.target as Element).closest<HTMLAnchorElement>('a[href^="#"]');
      if (!link) return;

      const id = link.getAttribute("href");
      if (!id || id === "#") return;

      const destination = document.querySelector<HTMLElement>(id);
      if (!destination) return;

      event.preventDefault();
      destination.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
      window.history.replaceState(null, "", id);
      link.closest("details")?.removeAttribute("open");
    };

    document.addEventListener("click", handleAnchorClick);

    return () => {
      observer?.disconnect();
      document.removeEventListener("click", handleAnchorClick);
      document.body.classList.remove("reveal-ready");
      revealItems.forEach((item) => {
        item.classList.remove("scroll-reveal", "is-revealed");
        item.style.removeProperty("--reveal-delay");
      });
    };
  }, []);

  return null;
}
