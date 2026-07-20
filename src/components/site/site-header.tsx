"use client";

import {
  Bars3Icon,
  ChevronDownIcon,
  HomeIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { navigation } from "@/data/navigation";

import styles from "./site-header.module.css";

const ministries = navigation.primary.find(
  (item) => item.label === "Ministries",
);

const DRAWER_TRANSITION_MS = 280;

export function SiteHeader() {
  const pathname = usePathname();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerMounted, setDrawerMounted] = useState(false);
  const [drawerClosing, setDrawerClosing] = useState(false);
  const [mobileMinistriesOpen, setMobileMinistriesOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const dropdownButtonRef = useRef<HTMLButtonElement>(null);
  const dropdownMenuRef = useRef<HTMLDivElement>(null);
  const dropdownPinnedRef = useRef(false);
  const drawerOpenFrameRef = useRef<number | null>(null);

  const isCurrent = (href?: string) => Boolean(href && pathname === href);
  const ministryIsCurrent = Boolean(
    ministries?.children?.some((item) => isCurrent(item.href)),
  );

  const focusDropdownItem = (position: "first" | "last") => {
    requestAnimationFrame(() => {
      const links = dropdownMenuRef.current?.querySelectorAll<HTMLAnchorElement>(
        "a[href]",
      );
      if (!links?.length) return;
      links[position === "first" ? 0 : links.length - 1]?.focus();
    });
  };

  useEffect(() => {
    if (!drawerOpen) return;

    const previousOverflow = document.body.style.overflow;
    const backgroundElements = Array.from(
      document.querySelectorAll<HTMLElement>(".skip-link, main, footer"),
    );
    const previousBackgroundState = backgroundElements.map((element) => ({
      element,
      inert: element.inert,
      ariaHidden: element.getAttribute("aria-hidden"),
    }));
    document.body.style.overflow = "hidden";
    backgroundElements.forEach((element) => {
      element.inert = true;
      element.setAttribute("aria-hidden", "true");
    });
    const firstLink = headerRef.current?.querySelector<HTMLElement>(
      "[data-drawer-link]",
    );
    firstLink?.focus({ preventScroll: true });

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setDrawerClosing(true);
        setDrawerOpen(false);
        setMobileMinistriesOpen(false);
        menuButtonRef.current?.focus();
        return;
      }

      if (event.key !== "Tab" || !headerRef.current) return;
      const focusable = Array.from(
        headerRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled])',
        ),
      ).filter((element) => element.offsetParent !== null);
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      previousBackgroundState.forEach(({ element, inert, ariaHidden }) => {
        element.inert = inert;
        if (ariaHidden == null) element.removeAttribute("aria-hidden");
        else element.setAttribute("aria-hidden", ariaHidden);
      });
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [drawerOpen]);

  useEffect(() => {
    const closeOnDesktop = (event: MediaQueryListEvent) => {
      if (!event.matches) return;
      if (drawerOpenFrameRef.current !== null) {
        cancelAnimationFrame(drawerOpenFrameRef.current);
        drawerOpenFrameRef.current = null;
      }
      setDrawerOpen(false);
      setDrawerMounted(false);
      setDrawerClosing(false);
      setMobileMinistriesOpen(false);
    };
    const query = window.matchMedia("(min-width: 62rem)");
    query.addEventListener("change", closeOnDesktop);
    return () => query.removeEventListener("change", closeOnDesktop);
  }, []);

  useEffect(() => {
    if (!drawerMounted || !drawerClosing) return;

    const delay = window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ? 0
      : DRAWER_TRANSITION_MS;
    const timeout = window.setTimeout(() => {
      setDrawerMounted(false);
      setDrawerClosing(false);
    }, delay);
    return () => window.clearTimeout(timeout);
  }, [drawerMounted, drawerClosing]);

  useEffect(
    () => () => {
      if (drawerOpenFrameRef.current !== null) {
        cancelAnimationFrame(drawerOpenFrameRef.current);
      }
    },
    [],
  );

  useEffect(() => {
    if (!dropdownOpen) return;

    const closeOnOutsidePointer = (event: PointerEvent) => {
      if (
        event.target instanceof Node &&
        dropdownRef.current?.contains(event.target)
      ) {
        return;
      }
      dropdownPinnedRef.current = false;
      setDropdownOpen(false);
    };

    document.addEventListener("pointerdown", closeOnOutsidePointer);
    return () =>
      document.removeEventListener("pointerdown", closeOnOutsidePointer);
  }, [dropdownOpen]);

  const openDrawer = () => {
    setDrawerClosing(false);
    setDrawerMounted(true);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setDrawerOpen(true);
      return;
    }
    if (drawerOpenFrameRef.current !== null) {
      cancelAnimationFrame(drawerOpenFrameRef.current);
    }
    drawerOpenFrameRef.current = requestAnimationFrame(() => {
      drawerOpenFrameRef.current = requestAnimationFrame(() => {
        setDrawerOpen(true);
        drawerOpenFrameRef.current = null;
      });
    });
  };

  const closeDrawer = () => {
    if (drawerOpenFrameRef.current !== null) {
      cancelAnimationFrame(drawerOpenFrameRef.current);
      drawerOpenFrameRef.current = null;
    }
    if (drawerMounted) setDrawerClosing(true);
    setDrawerOpen(false);
    setMobileMinistriesOpen(false);
  };

  return (
    <header className={styles.header} ref={headerRef}>
      <div className={styles.announcement}>
        <HomeIcon aria-hidden="true" />
        <span>A ministry of Grace Church</span>
        <a
          href="https://gracewoodlands.com/"
          rel="noopener noreferrer"
          target="_blank"
        >
          Learn More
        </a>
      </div>
      <div aria-hidden="true" className={styles.announcementAccent} />

      <div className={styles.navigationBar}>
        <div className={styles.navigationInner}>
          <Link
            aria-label="Cathedral Life Centre home"
            className={styles.logoLink}
            href="/"
            onClick={closeDrawer}
          >
            <Image
              alt="Cathedral Life Centre"
              className={styles.logo}
              height={249}
              priority
              src="/assets/global/cathedral-life-centre-logo.png"
              width={1088}
            />
          </Link>

          <nav aria-label="Primary navigation" className={styles.desktopNav}>
            <Link aria-current={isCurrent("/") ? "page" : undefined} href="/">
              Home
            </Link>
            <div
              className={styles.dropdown}
              onBlur={(event) => {
                if (!event.currentTarget.contains(event.relatedTarget)) {
                  dropdownPinnedRef.current = false;
                  setDropdownOpen(false);
                }
              }}
              onMouseEnter={() => {
                if (!dropdownPinnedRef.current) setDropdownOpen(true);
              }}
              onMouseLeave={() => {
                if (!dropdownPinnedRef.current) setDropdownOpen(false);
              }}
              ref={dropdownRef}
            >
              <button
                aria-controls="desktop-ministries-menu"
                aria-current={ministryIsCurrent ? "page" : undefined}
                aria-expanded={dropdownOpen}
                className={styles.dropdownTrigger}
                id="ministries-trigger"
                onClick={() => {
                  if (dropdownPinnedRef.current) {
                    dropdownPinnedRef.current = false;
                    setDropdownOpen(false);
                  } else {
                    dropdownPinnedRef.current = true;
                    setDropdownOpen(true);
                  }
                }}
                onKeyDown={(event) => {
                  if (event.key === "Escape") {
                    dropdownPinnedRef.current = false;
                    setDropdownOpen(false);
                    dropdownButtonRef.current?.focus();
                  } else if (event.key === "ArrowDown") {
                    event.preventDefault();
                    dropdownPinnedRef.current = true;
                    setDropdownOpen(true);
                    focusDropdownItem("first");
                  } else if (event.key === "ArrowUp") {
                    event.preventDefault();
                    dropdownPinnedRef.current = true;
                    setDropdownOpen(true);
                    focusDropdownItem("last");
                  }
                }}
                ref={dropdownButtonRef}
                type="button"
              >
                Ministries
                <ChevronDownIcon aria-hidden="true" />
              </button>
              <div
                aria-hidden={!dropdownOpen}
                className={styles.dropdownMenu}
                data-state={dropdownOpen ? "open" : "closed"}
                id="desktop-ministries-menu"
                inert={dropdownOpen ? undefined : true}
                onKeyDown={(event) => {
                  const links = Array.from(
                    dropdownMenuRef.current?.querySelectorAll<HTMLAnchorElement>(
                      "a[href]",
                    ) ?? [],
                  );
                  const index = links.indexOf(
                    document.activeElement as HTMLAnchorElement,
                  );
                  if (event.key === "Escape") {
                    event.preventDefault();
                    dropdownPinnedRef.current = false;
                    setDropdownOpen(false);
                    dropdownButtonRef.current?.focus();
                  } else if (event.key === "Home") {
                    event.preventDefault();
                    links[0]?.focus();
                  } else if (event.key === "End") {
                    event.preventDefault();
                    links.at(-1)?.focus();
                  } else if (event.key === "ArrowDown") {
                    event.preventDefault();
                    links[(index + 1 + links.length) % links.length]?.focus();
                  } else if (event.key === "ArrowUp") {
                    event.preventDefault();
                    links[(index - 1 + links.length) % links.length]?.focus();
                  }
                }}
                ref={dropdownMenuRef}
              >
                {ministries?.children?.map((item) => (
                  <Link
                    aria-current={isCurrent(item.href) ? "page" : undefined}
                    href={item.href ?? "/"}
                    key={item.label}
                    onClick={() => {
                      dropdownPinnedRef.current = false;
                      setDropdownOpen(false);
                    }}
                    prefetch={false}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
            <Link
              aria-current={isCurrent("/contact") ? "page" : undefined}
              href="/contact"
              prefetch={false}
            >
              Contact
            </Link>
            <span aria-hidden="true" className={styles.desktopDivider} />
            <Link
              aria-current={isCurrent("/donate") ? "page" : undefined}
              className={styles.donateButton}
              href="/donate"
              prefetch={false}
            >
              Donate
            </Link>
          </nav>

          <div className={styles.mobileActions}>
            <Link
              aria-current={isCurrent("/donate") ? "page" : undefined}
              className={styles.tabletDonate}
              href="/donate"
              prefetch={false}
            >
              Donate
            </Link>
            <button
              aria-controls="mobile-navigation-drawer"
              aria-expanded={drawerOpen}
              aria-label={drawerOpen ? "Close navigation menu" : "Open navigation menu"}
              className={styles.menuButton}
              id="navigation-toggle"
              onClick={() => {
                if (drawerOpen || drawerMounted) closeDrawer();
                else openDrawer();
              }}
              ref={menuButtonRef}
              type="button"
            >
              {drawerOpen ? (
                <XMarkIcon aria-hidden="true" />
              ) : (
                <Bars3Icon aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {drawerMounted ? (
        <nav
          aria-hidden={!drawerOpen}
          aria-label="Mobile navigation"
          className={styles.drawer}
          data-state={drawerOpen ? "open" : "closed"}
          id="mobile-navigation-drawer"
          inert={drawerOpen ? undefined : true}
          onTransitionEnd={(event) => {
            if (
              event.currentTarget === event.target &&
              event.propertyName === "transform" &&
              drawerClosing &&
              !drawerOpen
            ) {
              setDrawerMounted(false);
              setDrawerClosing(false);
            }
          }}
        >
          <Link
            aria-current={isCurrent("/") ? "page" : undefined}
            data-drawer-link
            href="/"
            onClick={closeDrawer}
          >
            Home
          </Link>
          <div className={styles.mobileMinistries}>
            <button
              aria-controls="mobile-ministries-menu"
              aria-current={ministryIsCurrent ? "page" : undefined}
              aria-expanded={mobileMinistriesOpen}
              id="mobile-ministries-trigger"
              onClick={() => setMobileMinistriesOpen((open) => !open)}
              type="button"
            >
              Ministries
              <ChevronDownIcon aria-hidden="true" />
            </button>
            <div
              aria-hidden={!mobileMinistriesOpen}
              className={styles.mobileMinistriesMenu}
              data-state={mobileMinistriesOpen ? "open" : "closed"}
              id="mobile-ministries-menu"
              inert={mobileMinistriesOpen ? undefined : true}
            >
              {ministries?.children?.map((item) => (
                <Link
                  aria-current={isCurrent(item.href) ? "page" : undefined}
                  href={item.href ?? "/"}
                  key={item.label}
                  onClick={closeDrawer}
                  prefetch={false}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
          <Link
            aria-current={isCurrent("/donate") ? "page" : undefined}
            className={styles.mobilePartner}
            href="/donate"
            onClick={closeDrawer}
            prefetch={false}
          >
            Partner With Us
          </Link>
          <Link
            aria-current={isCurrent("/contact") ? "page" : undefined}
            href="/contact"
            onClick={closeDrawer}
            prefetch={false}
          >
            Contact
          </Link>
        </nav>
      ) : null}
    </header>
  );
}
