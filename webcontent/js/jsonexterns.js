/** @externs */

var crisisJson = {};

/**
 * @typedef {{
 *   MapBounds: crisisJson.Bounds,
 *   MapCosts: Array<Array<number>>,
 *   Divisions: Array<crisisJson.Division>
 * }}
 */
crisisJson.Crisis;

/**
 * @typedef {{
 *   Id: number,
 *   AbsCoords: crisisJson.Coords,
 *   Units: Array<crisisJson.Unit>
 * }}
 */
crisisJson.Division;

/**
 * @typedef {{
 *   Id: number,
 *   Units: Array<crisisJson.Unit>
 * }}
 */
crisisJson.DivisionResponse;

/**
 * @typedef {{
 *   TypeName: string,
 *   TypeNum: number,
 *   Amount: number
 * }}
 */
crisisJson.Unit;

/**
 * @typedef {{
 *   X: number,
 *   Y: number
 * }}
 */
crisisJson.Coords;

/**
 * @typedef {{
 *   Height: number,
 *   Width: number
 * }}
 */
crisisJson.Bounds;
