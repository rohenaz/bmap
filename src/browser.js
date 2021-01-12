import BMAP, { bmap } from './bmap';

module.exports = {
  BMAP,
  bmap,
};

if (typeof window !== 'undefined') {
  window.BMAP = BMAP;
  window.bmap = bmap;
}
