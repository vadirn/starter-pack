import { rectify } from 'math-helpers/rect';
import { nil } from 'nil';

/**
 * @typedef {'top'|'top-start'|'top-end'|'right'|'right-start'|'right-end'|'bottom'|'bottom-start'|'bottom-end'|'left'|'left-start'|'left-end'} Placement
 */

/**
 * Calculates a rect for given placement and anchor
 * @param anchorRect {{}}
 * @param popoverRect {{}}
 * @param placement {Placement}
 * @return {{}}
 */
export function computePopoverRect(anchorRect, popoverRect, placement) {
  return rectify(
    {
      'top-start': () => ({
        ...popoverRect,
        x: anchorRect.x,
        y: anchorRect.y - popoverRect.height,
      }),
      'bottom-start': () => ({
        ...popoverRect,
        x: anchorRect.x,
        y: anchorRect.bottom,
      }),
      'top-end': () => ({
        ...popoverRect,
        x: anchorRect.right - popoverRect.width,
        y: anchorRect.y - popoverRect.height,
      }),
      'bottom-end': () => ({
        ...popoverRect,
        x: anchorRect.right - popoverRect.width,
        y: anchorRect.bottom,
      }),
      top: () => ({
        ...popoverRect,
        x: anchorRect.x + anchorRect.width / 2 - popoverRect.width / 2,
        y: anchorRect.y - popoverRect.height,
      }),
      bottom: () => ({
        ...popoverRect,
        x: anchorRect.x + anchorRect.width / 2 - popoverRect.width / 2,
        y: anchorRect.bottom,
      }),
      'right-start': () => ({
        ...popoverRect,
        x: anchorRect.right,
        y: anchorRect.y,
      }),
      'left-start': () => ({
        ...popoverRect,
        x: anchorRect.x - popoverRect.width,
        y: anchorRect.y,
      }),
      'right-end': () => ({
        ...popoverRect,
        x: anchorRect.right,
        y: anchorRect.bottom - popoverRect.height,
      }),
      'left-end': () => ({
        ...popoverRect,
        x: anchorRect.x - popoverRect.width,
        y: anchorRect.bottom - popoverRect.height,
      }),
      right: () => ({
        ...popoverRect,
        x: anchorRect.right,
        y: anchorRect.y + anchorRect.height / 2 - popoverRect.height / 2,
      }),
      left: () => ({
        ...popoverRect,
        x: anchorRect.x - popoverRect.width,
        y: anchorRect.y + anchorRect.height / 2 - popoverRect.height / 2,
      }),
    }[placement]()
  );
}

/**
 * Return distances between sides of rect and bounds
 * @param rect {{}}
 * @param bounds {{ x: number, y: number, width: number, height: number }}
 * @return {{top: number, left: number, bottom: number, right: number}}
 */
export function getOverflowOffsets(rect, bounds) {
  // origin is bounds.x, bounds.y:
  const transformedRect = {
    x: rect.x - bounds.x,
    y: rect.y - bounds.y,
    width: rect.width,
    height: rect.height,
  };
  return {
    top: transformedRect.y, // <- if < 0, overflows on top
    left: transformedRect.x, // <- if < 0, overflow on left,
    bottom: bounds.height - transformedRect.y - transformedRect.height,
    right: bounds.width - transformedRect.x - transformedRect.width,
  };
}

/**
 * Returns opposite placement side
 * @param placement {Placement}
 * @return {Placement}
 */
export function getOppositeSide(placement) {
  return placement.replace(
    /left|right|bottom|top/g,
    side =>
      ({
        top: 'bottom',
        bottom: 'top',
        left: 'right',
        right: 'left',
      }[side])
  );
}

/**
 * Returns opposite placement variation
 * @param placement {Placement}
 * @return {Placement}
 */
export function getOppositeVariation(placement) {
  return placement.replace(
    /start|end/g,
    variation => ({ start: 'end', end: 'start' }[variation])
  );
}

/**
 * Calculate eventual placement of popover card. Returns placement rect and eventual placement string.
 * @param placement {string}
 * @param anchorRect {{}}
 * @param popoverRect {{}}
 * @param offset {number=}
 * @return {{}|{rect: {}, eventualPlacement: string}}
 */
export function getEventualPlacementProps(
  placement,
  anchorRect,
  popoverRect,
  offset = 0
) {
  if ([placement, anchorRect, popoverRect].some(nil)) return {};
  const screenRect = {
    x: 0,
    y: 0,
    width: window.innerWidth,
    height: window.innerHeight,
  };
  let p = placement;
  const offsetAnchorRect = rectify({
    x: anchorRect.x - offset,
    y: anchorRect.y - offset,
    width: anchorRect.width + 2 * offset,
    height: anchorRect.height + 2 * offset,
  });
  const rect1 = computePopoverRect(offsetAnchorRect, popoverRect, p);
  const offsets1 = getOverflowOffsets(rect1, screenRect);
  if (offsets1.top < 0 || offsets1.bottom < 0) {
    if (p.startsWith('top') || p.startsWith('bottom')) {
      p = getOppositeSide(p);
    } else {
      p = getOppositeVariation(p);
    }
  }
  const rect2 = computePopoverRect(offsetAnchorRect, popoverRect, p);
  const offsets2 = getOverflowOffsets(rect2, screenRect);
  if (offsets2.left < 0 || offsets2.right < 0) {
    if (p.startsWith('left') || p.startsWith('right')) {
      p = getOppositeSide(p);
    } else {
      p = getOppositeVariation(p);
    }
  }
  return {
    eventualPlacement: p,
    rect: computePopoverRect(offsetAnchorRect, popoverRect, p),
  };
}

/**
 * @param popoverRect {{}}
 * @param anchorRect {{}}
 * @return {{}|{top: number, left: number}}
 */
export function computeArrowRect(popoverRect, anchorRect) {
  if ([popoverRect, anchorRect].some(nil)) return {};
  const left = anchorRect.left - popoverRect.left + anchorRect.width / 2;
  const top = anchorRect.top - popoverRect.top + anchorRect.height / 2;
  return {
    left,
    top,
  };
}
