/** @externs */

crisisJson.Crisis = {};

/**
 * @typedef{{
 *   MapBounds: crisisJson.Bounds, 
 *   MapCosts: Array<Array<number>>, 
 *   Divisions: Array<crisisJson.Division>
 * }}
 */
crisisJson.Crisis;

/**
 * @typedef{{
 *   AbsCoords: crisisJson.Coords,
 *   Units: Array<crisisJson.Unit>
 * }}
 */
crisisJson.Division;

/**
 * @typedef{{
 *   TypeName: string,
 *   TypeNum: number,
 *   Amount: number
 * }} 
 */
crisisJson.Unit;

/**
 * @typedef{{
 *   X: number,
 *   Y: number
 * }}
 */
crisisJson.Coords;

/**
 * @typedef{{
 *   Height: number,
 *   Width: number
 * }}
 */
crisisJson.Bounds;
