BEGIN; 

INSERT INTO crisis (crisis_name, password) VALUES ('test', 'password');

INSERT INTO faction (crisis, faction_name, password) VALUES (1, 'test1', 'password'); 
INSERT INTO faction (crisis, faction_name, password) VALUES (1, 'test2', 'password');

INSERT INTO unit_type (crisis, unit_name, unit_speed) VALUES(1, 'test1', 15);
INSERT INTO unit_type (crisis, unit_name, unit_speed) VALUES(1, 'test2', 20);

INSERT INTO division (faction, division_name, coord_x, coord_y)
               VALUES(1, 'testd11', '{"(10, 11)"}'::coords[]);
INSERT INTO division (faction, division_name, coord_x, coord_y)
               VALUES(1, 'testd12', '{"(22, 11)"}'::coords[]);
INSERT INTO division (faction, division_name, coord_x, coord_y)
               VALUES(2, 'testd21', '{"(5, 5)"}'::coords[]);
INSERT INTO division (faction, division_name, coord_x, coord_y)
               VALUES(2, 'testd22', '{"(7, 20)"}'::coords[]);
INSERT INTO division (faction, division_name, coord_x, coord_y)
               VALUES(2, 'testd23', '{"(15, 2)"}'::coords[]);

INSERT INTO unit VALUES (1, 1, 30);
INSERT INTO unit VALUES (1, 2, 15);
INSERT INTO unit VALUES (2, 2, 30);
INSERT INTO unit VALUES (3, 1, 10);
INSERT INTO unit VALUES (4, 2, 15);
INSERT INTO unit VALUES (4, 1, 75);

INSERT INTO division_view VALUES (1, 1, TRUE);
INSERT INTO division_view VALUES (1, 2, FALSE);
INSERT INTO division_view VALUES (2, 1, TRUE);
INSERT INTO division_view VALUES (2, 2, TRUE);
INSERT INTO division_view VALUES (3, 1, FALSE);
INSERT INTO division_view VALUES (3, 2, TRUE);
INSERT INTO division_view VALUES (4, 1, TRUE);
INSERT INTO division_view VALUES (4, 2, TRUE);
INSERT INTO division_view VALUES (5, 1, FALSE);
INSERT INTO division_view VALUES (5, 2, TRUE);

COMMIT;
