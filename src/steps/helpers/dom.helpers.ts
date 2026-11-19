import {Page} from "playwright";

/** innerHTML of the first element matching the CSS selector (document.querySelector semantics). */
export const getInnerHTML = (page: Page, selector: string): Promise<string> =>
    page.evaluate((aselector) => document.querySelector(aselector).innerHTML, selector);

/** value of the first input matching the CSS selector (document.querySelector semantics). */
export const getInputValue = (page: Page, selector: string): Promise<string> =>
    page.evaluate((aselector) => (document.querySelector(aselector) as HTMLInputElement).value, selector);

export const includesIgnoreCase = (content: string, expected: string): boolean =>
    content.trim().toLowerCase().includes(expected.trim().toLowerCase());
