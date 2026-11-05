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
    // A classe só é adicionada depois da hidratação. Assim, sem JavaScript o
    // conteúdo continua visível em vez de ficar preso em opacity: 0.
    const revealItems = Array.from(document.querySelectorAll<HTMLElement>(revealSelector));

    revealItems.forEach((item, index) => {
      item.classList.add("scroll-reveal");
      item.style.setProperty("--reveal-delay", `${(index % 4) * 70}ms`);
    });

    document.body.classList.add("reveal-ready");

    let animationFrame = 0;

    const revealVisibleItems = () => {
      // Medição direta foi escolhida em vez de IntersectionObserver porque
      // alguns navegadores com movimento reduzido liberavam tudo no carregamento.
      animationFrame = 0;
      const revealLine = window.innerHeight * 0.88;

      revealItems.forEach((item) => {
        if (item.classList.contains("is-revealed")) return;
        const bounds = item.getBoundingClientRect();
        if (bounds.top <= revealLine && bounds.bottom >= 0) {
          item.classList.add("is-revealed");
        }
      });
    };

    const handleScroll = () => {
      if (animationFrame) return;
      animationFrame = window.requestAnimationFrame(revealVisibleItems);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);
    window.requestAnimationFrame(revealVisibleItems);

    const handleAnchorClick = (event: MouseEvent) => {
      // Centraliza a navegação suave de todos os links internos e fecha o menu
      // <details> no celular depois da escolha.
      const link = (event.target as Element).closest<HTMLAnchorElement>('a[href^="#"]');
      if (!link) return;

      const id = link.getAttribute("href");
      if (!id || id === "#") return;

      const destination = document.querySelector<HTMLElement>(id);
      if (!destination) return;

      event.preventDefault();
      destination.scrollIntoView({ behavior: "smooth", block: "start" });
      window.history.replaceState(null, "", id);
      link.closest("details")?.removeAttribute("open");
    };

    document.addEventListener("click", handleAnchorClick);

    return () => {
      if (animationFrame) window.cancelAnimationFrame(animationFrame);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
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
