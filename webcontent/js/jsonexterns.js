/** @externs */

var crisisJson = {};

/**
 * @typedef {{
 *   MapBounds: crisisJson.Bounds,
 *   MapCosts: Array<Array<number>>,
 *   Divisions: Array<crisisJson.Division>,
 *   Factions: Array<crisisJson.Faction>,
 *   UnitTypes: Array<crisisJson.UnitType>,
 *   Speed: number
 * }}
 */
crisisJson.Crisis;

/**
 * @typedef {{
 *   Speed: number
 * }}
 */
crisisJson.UpdateCrisisSpeed;

/**
 * @typedef {{
 *   Id: number,
 *   Name: string,
 *   Color: string
 * }}
 */
crisisJson.Faction;

/**
 * @typedef {{
 *   Id: number
 * }}
 */
crisisJson.DeleteFaction;

/**
 * @typedef {{
 *   Name: string,
 *   Color: string
 * }}
 */
crisisJson.CreateFaction;

/**
 * @typedef {{
 *   Id: number,
 *   Name: string,
 *   Speed: number
 * }}
 */
crisisJson.UnitType;

/**
 * @typedef {{
 *   Id: number
 * }}
 */
crisisJson.DeleteUnitType;

/**
 * @typedef {{
 *   Name: string,
 *   Speed: number
 * }}
 */
crisisJson.CreateUnitType;

/**
 * @typedef {{
 *   Id: number,
 *   Name: string,
 *   Coords: crisisJson.Coords,
 *   FactionId: number,
 *   VisibleTo: Array<number>,
 *   Units: Array<crisisJson.Unit>
 * }}
 */
crisisJson.Division;

/**
 * @typedef {{
 *   Id: number,
 *   Units: Array<crisisJson.Unit>,
 *   Name: string?,
 *   FactionId: number?
 * }}
 */
crisisJson.DivisionUpdate;

/**
 * @typedef {{
 *   DivisionId: number,
 *   VisibleTo: Array<number>
 * }}
 */
crisisJson.DivisionVisibilityUpdate;

/**
 * @typedef {{
 *   Units: Array<crisisJson.Unit>,
 *   Coords: crisisJson.Coords,
 *   Name: string,
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

/**
 * @typedef {{
 *   Success: number,
 *   Message: string
 * }}
 */
crisisJson.SuccessResponse;
