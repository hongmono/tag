import renderMathInElement from 'katex/contrib/auto-render';

export const KATEX_DELIMITERS = [
  { left: '$$', right: '$$', display: true },
  { left: '$', right: '$', display: false },
  { left: '\\(', right: '\\)', display: false },
  { left: '\\[', right: '\\]', display: true },
];

export const renderKatex = (element: HTMLElement | null): void => {
  if (!element) return;

  renderMathInElement(element, {
    delimiters: KATEX_DELIMITERS,
    throwOnError: false,
    trust: true,
    ignoredTags: ['script', 'noscript', 'style', 'textarea', 'pre', 'code'],
    ignoredClasses: ['no-katex'],
  });
};
