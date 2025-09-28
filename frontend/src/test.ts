import 'zone.js/testing';
import { getTestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting
} from '@angular/platform-browser-dynamic/testing';

globalThis.isNode = false;

globalThis.HTMLElement = globalThis.HTMLElement ?? class {};

globalThis.matchMedia = globalThis.matchMedia ?? (() => ({ matches: false, addListener() {}, removeListener() {} } as MediaQueryList));

globalThis.ResizeObserver = globalThis.ResizeObserver ?? class {
  observe(): void {}
  unobserve(): void {}
  disconnect(): void {}
};

getTestBed().initTestEnvironment(BrowserDynamicTestingModule, platformBrowserDynamicTesting(), {
  teardown: { destroyAfterEach: true }
});
