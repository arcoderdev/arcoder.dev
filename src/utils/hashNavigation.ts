import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const PENDING_HASH_KEY = "arcoder:pending-hash-navigation";
const MAX_NAVIGATION_ATTEMPTS = 400;
let isSetup = false;

function areHomeScrollTriggersReady(): boolean {
  if (window.location.pathname !== "/") return true;

  const pinnedSections = [
    document.querySelector<HTMLElement>("#disenamos-section"),
    document.querySelector<HTMLElement>("#desarrollamos-section"),
  ].filter((section): section is HTMLElement => section !== null);

  return (
    pinnedSections.length === 2 &&
    pinnedSections.every((section) =>
      ScrollTrigger.getAll().some((trigger) => trigger.trigger === section),
    )
  );
}

function getTimelineLabelProgress(
  trigger: ScrollTrigger,
  label: string,
): number | null {
  const animation = trigger.animation as gsap.core.Timeline | undefined;
  const labelTime = animation?.labels[label];
  if (typeof labelTime !== "number" || !animation?.duration()) return null;
  return gsap.utils.clamp(0, 1, labelTime / animation.duration());
}

function getDesignCardProgress(
  target: HTMLElement,
  trigger: ScrollTrigger,
): number | null {
  const track = document.querySelector<HTMLElement>("#disenamos-slider-track");
  const slide = target.closest<HTMLElement>(".disenamos-slide");
  if (!track || !slide) return null;

  const slides = Array.from(
    track.querySelectorAll<HTMLElement>(".disenamos-slide"),
  );
  const slideIndex = slides.indexOf(slide);
  if (slideIndex < 0) return null;

  if (
    window.matchMedia("(max-width: 639px) and (orientation: portrait)").matches
  ) {
    return getTimelineLabelProgress(trigger, `service-${slideIndex}`);
  }

  const currentX = Number(gsap.getProperty(track, "x")) || 0;
  const trackRect = track.getBoundingClientRect();
  const slideRect = slide.getBoundingClientRect();
  const trackStart = trackRect.left - currentX;
  const slideOffset = slideRect.left - trackRect.left;
  const desiredX =
    window.innerWidth / 2 -
    (trackStart + slideOffset + slideRect.width / 2);
  const isShortLandscape =
    window.innerHeight <= 600 && window.innerWidth > window.innerHeight;
  const extraMargin = isShortLandscape
    ? 30
    : window.innerWidth < 768
      ? 40
      : 120;
  const endX = -(track.scrollWidth - window.innerWidth + extraMargin);

  if (endX >= 0) return 0;
  return gsap.utils.clamp(0, 1, desiredX / endX);
}

function navigateToHash(attempt = 0) {
  if (!window.location.hash) return;
  const scrollBehavior = window.matchMedia("(prefers-reduced-motion: reduce)")
    .matches
    ? "auto"
    : "smooth";

  let targetId: string;
  try {
    targetId = decodeURIComponent(window.location.hash.slice(1));
  } catch {
    return;
  }

  const target = document.getElementById(targetId);
  if (!target) return;

  // Home has two pinned GSAP sections. Their spacers affect the offsets of
  // every later section, so wait for both triggers before measuring any hash.
  if (!areHomeScrollTriggersReady()) {
    if (attempt < MAX_NAVIGATION_ATTEMPTS) {
      window.setTimeout(() => navigateToHash(attempt + 1), 25);
    }
    return;
  }

  const designSection = target.closest<HTMLElement>("#disenamos-section");
  const developCard = target.closest<HTMLElement>(".desarrollamos-card");
  const gsapSection =
    designSection ||
    developCard?.closest<HTMLElement>("#desarrollamos-section");

  if (!gsapSection) {
    ScrollTrigger.refresh();
    requestAnimationFrame(() =>
      target.scrollIntoView({ behavior: scrollBehavior, block: "start" }),
    );
    return;
  }

  const trigger = ScrollTrigger.getAll().find(
    (item) => item.trigger === gsapSection,
  );

  if (!trigger) {
    if (attempt < MAX_NAVIGATION_ATTEMPTS) {
      window.setTimeout(() => navigateToHash(attempt + 1), 25);
    }
    return;
  }

  // Recalcula la geometría antes de resolver el punto de scroll. En una
  // navegación entre páginas, las medidas previas pueden pertenecer a la ruta
  // anterior o haberse tomado antes de que GSAP terminara de inicializar.
  ScrollTrigger.refresh();

  let progress: number | null = null;
  if (designSection) {
    progress = getDesignCardProgress(target, trigger);
  } else if (developCard) {
    const cardIndex = developCard.dataset.index;
    if (cardIndex !== undefined) {
      progress = getTimelineLabelProgress(trigger, `card-${cardIndex}`);
    }
  }

  if (progress === null) {
    target.scrollIntoView({ behavior: scrollBehavior, block: "start" });
    return;
  }

  requestAnimationFrame(() => {
    const destination =
      trigger.start + (trigger.end - trigger.start) * progress!;
    window.scrollTo({ top: destination, behavior: scrollBehavior });
  });
}

function scheduleHashNavigation() {
  // Espera a que carguen las fuentes y se estabilice el layout antes de medir
  // las posiciones de los ScrollTriggers.
  void document.fonts.ready.then(() => {
    requestAnimationFrame(() => requestAnimationFrame(() => navigateToHash()));
  });
}

function handleHashLinkClick(event: MouseEvent) {
  if (
    event.defaultPrevented ||
    event.button !== 0 ||
    event.metaKey ||
    event.ctrlKey ||
    event.shiftKey ||
    event.altKey
  ) {
    return;
  }

  const link = (event.target as Element | null)?.closest<HTMLAnchorElement>(
    "a[href]",
  );
  if (!link || link.target || link.hasAttribute("download")) return;

  const url = new URL(link.href, window.location.href);
  if (url.origin !== window.location.origin) return;

  const isSameDocument =
    url.pathname === window.location.pathname &&
    url.search === window.location.search;

  if (isSameDocument) {
    event.preventDefault();

    if (!url.hash) {
      if (window.location.hash) {
        history.replaceState(history.state, "", `${url.pathname}${url.search}`);
      }

      const behavior = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches
        ? "auto"
        : "smooth";
      window.scrollTo({ top: 0, behavior });
      return;
    }

    if (url.hash !== window.location.hash) {
      history.pushState(
        history.state,
        "",
        `${url.pathname}${url.search}${url.hash}`,
      );
    }
    scheduleHashNavigation();
    return;
  }

  if (!url.hash) return;

  // Evita el salto instantáneo del navegador al hash durante una navegación
  // completa. La ruta de destino restaurará el hash y hará el scroll suave.
  event.preventDefault();
  sessionStorage.setItem(PENDING_HASH_KEY, url.hash);
  window.location.assign(`${url.pathname}${url.search}`);
}

export function setupHashNavigation() {
  if (isSetup) return;
  isSetup = true;

  const pendingHash = sessionStorage.getItem(PENDING_HASH_KEY);
  if (pendingHash) {
    sessionStorage.removeItem(PENDING_HASH_KEY);
    history.replaceState(
      history.state,
      "",
      `${window.location.pathname}${window.location.search}${pendingHash}`,
    );
  }

  document.addEventListener("click", handleHashLinkClick);

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", scheduleHashNavigation, {
      once: true,
    });
  } else {
    scheduleHashNavigation();
  }

  window.addEventListener("load", scheduleHashNavigation, { once: true });

  window.addEventListener("hashchange", scheduleHashNavigation);
  document.addEventListener("astro:page-load", scheduleHashNavigation);
}
