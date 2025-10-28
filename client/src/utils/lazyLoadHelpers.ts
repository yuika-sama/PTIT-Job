import React, { ComponentType, useEffect } from 'react';

/**
 * Preload lazy-loaded components
 * Usage: preloadComponent(lazy(() => import('./Component')))
 */
export const preloadComponent = (
  component: ComponentType<any> & { preload?: () => Promise<any> }
): void => {
  if (component.preload) {
    component.preload();
  }
};

/**
 * Hook to preload components on mount
 * Usage: usePreload([Component1, Component2])
 */
export const usePreload = (
  components: Array<ComponentType<any> & { preload?: () => Promise<any> }>
): void => {
  useEffect(() => {
    components.forEach((component) => {
      if (component.preload) {
        component.preload();
      }
    });
  }, [components]);
};

/**
 * Preload component on link hover
 * Usage: onMouseEnter={() => preloadOnHover(Component)}
 */
export const preloadOnHover = (
  component: ComponentType<any> & { preload?: () => Promise<any> }
): void => {
  preloadComponent(component);
};

/**
 * Higher-order function to create preloadable lazy components
 * This adds a preload method to lazy components
 */
export const lazyWithPreload = <T extends ComponentType<any>>(
  factory: () => Promise<{ default: T }>
): T & { preload: () => Promise<{ default: T }> } => {
  const Component = React.lazy(factory) as any;
  Component.preload = factory;
  return Component;
};

const lazyLoadHelpers = {
  preloadComponent,
  usePreload,
  preloadOnHover,
  lazyWithPreload
};

export default lazyLoadHelpers;
