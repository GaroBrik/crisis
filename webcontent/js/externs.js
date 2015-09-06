/** @externs */

/**
 * @typedef{{
 *   Bounds: crisis.BoundsJson, 
 *   Divisions: Array<crisis.DivisionJson>
 * }}
 */
crisis.MapJson;

/**
 * @typedef{{
 *   AbsCoords: crisis.CoordsJson,
 *   Units: Array<crisis.UnitJson>
 * }}
 */
crisis.DivisionJson;

/**
 * @typedef{{
 *   Utype: string,
 *   Amount: number,
 * }} 
 */
crisis.UnitJson;

/**
 * @typedef{{
 *   X: number,
 *   Y: number
 * }}
 */
crisis.CoordsJson;

/**
 * @typedef{{
 *   Height: number,
 *   Width: number
 * }}
 */
crisis.BoundsJson;
