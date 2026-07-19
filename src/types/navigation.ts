export type NavigationTarget = "_self" | "_blank";

export type NavigationItem = {
  label: string;
  href?: string;
  target?: NavigationTarget;
  children?: readonly NavigationItem[];
};

export type NavigationModel = {
  announcement: readonly NavigationItem[];
  primary: readonly NavigationItem[];
  actions: readonly NavigationItem[];
  footer: readonly NavigationItem[];
};
