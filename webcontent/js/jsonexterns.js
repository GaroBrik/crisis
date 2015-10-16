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
 *   DivisionName: string,
 *   Coords: crisisJson.Coords,
 *   FactionId: number,
 *   Units: Array<crisisJson.Unit>
 * }}
 */
crisisJson.Division;

/**
 * @typedef {{
 *   Id: number,
 *   Units: Array<crisisJson.Unit>,
 *   DivisionName: string?,
 *   FactionId: number?
 * }}
 */
crisisJson.DivisionUpdate;

/**
 * @typedef {{
 *   Units: Array<crisisJson.Unit>,
 *   Coords: crisisJson.Coords,
 *   DivisionName: string,
 *   FactionId: number
 * }}
 */
crisisJson.DivisionCreate;

/**
 * @typedef {{
 *   DivisionId: number
 * }}
 */
crisisJson.DivisionDelete;

/**
 * @typedef {{
 *   DivisionId: number,
 *   Route: Array<crisisJson.Coords>
 * }}
 */
crisisJson.DivisionRoute;

/**
 * @typedef {{
 *   Type: number,
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
