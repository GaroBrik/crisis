BEGIN;

CREATE SEQUENCE crisis_id_seq;
CREATE TABLE crisis (
       id integer PRIMARY KEY DEFAULT nextval('crisis_id_seq'),
       crisis_name varchar(40) NOT NULL,
       password varchar(40) NOT NULL
);
ALTER SEQUENCE crisis_id_seq OWNED BY crisis.id;

CREATE SEQUENCE faction_id_seq;
CREATE TABLE faction (
       id integer PRIMARY KEY DEFAULT nextval('faction_id_seq'),
       crisis integer REFERENCES crisis (id),
       faction_name varchar(40) NOT NULL,
       password varchar(40) NOT NULL,
       UNIQUE (crisis, faction_name)
);
ALTER SEQUENCE faction_id_seq OWNED BY faction.id;

CREATE SEQUENCE division_id_seq;
CREATE TABLE division (
       id integer PRIMARY KEY DEFAULT nextval('division_id_seq'),
       faction integer REFERENCES faction (id),
       division_name varchar(40) NOT NULL,
       coord_x integer NOT NULL,
       coord_y INTEGER NOT NULL,
       UNIQUE (faction, division_name)
);
ALTER SEQUENCE division_id_seq OWNED BY division.id;

CREATE SEQUENCE unit_type_id_seq;
CREATE TABLE unit_type (
       id integer PRIMARY KEY DEFAULT nextval('unit_type_id_seq'),
       crisis integer REFERENCES crisis (id),
       unit_name varchar(40) NOT NULL,
       unit_speed integer NOT NULL
);
ALTER SEQUENCE unit_type_id_seq OWNED BY unit_type.id;

CREATE TABLE unit (
       division integer REFERENCES division (id),
       unit_type integer REFERENCES unit_type (id),
       amount integer NOT NULL,
       PRIMARY KEY (division, unit_type)
);

CREATE TABLE division_view (
       division_id integer REFERENCES division(id),
       faction_id integer REFERENCES faction(id),
       view_units boolean,
       PRIMARY KEY (unit_id, faction_id)
);

COMMIT;
