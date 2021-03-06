BEGIN;

CREATE SEQUENCE crisis_id_seq;
CREATE TABLE crisis (
       id INTEGER PRIMARY KEY DEFAULT nextval('crisis_id_seq'),
       uuid UUID DEFAULT gen_random_uuid(),
       map_costs INTEGER[][] NOT NULL,
       crisis_name VARCHAR(40) UNIQUE NOT NULL,
       active BOOLEAN NOT NULL DEFAULT TRUE,
       speed DOUBLE PRECISION NOT NULL DEFAULT 0,
       password VARCHAR(40) NOT NULL
);
ALTER SEQUENCE crisis_id_seq OWNED BY crisis.id;

CREATE SEQUENCE faction_id_seq;
CREATE TABLE faction (
       id INTEGER PRIMARY KEY DEFAULT nextval('faction_id_seq'),
       crisis INTEGER REFERENCES crisis (id) ON DELETE CASCADE,
       faction_name VARCHAR(40) NOT NULL,
       color VARCHAR(7) NOT NULL,
       UNIQUE (crisis, faction_name)
);
ALTER SEQUENCE faction_id_seq OWNED BY faction.id;

CREATE TYPE coords AS (
       x INTEGER,
       y INTEGER
);

CREATE SEQUENCE division_id_seq;
CREATE TABLE division (
       id INTEGER PRIMARY KEY DEFAULT nextval('division_id_seq'),
       faction INTEGER REFERENCES faction (id) ON DELETE CASCADE,
       division_name VARCHAR(40) NOT NULL,
       route coords[] NOT NULL,
       time_spent DOUBLE PRECISION DEFAULT 0.0,
       UNIQUE (faction, division_name)
);
ALTER SEQUENCE division_id_seq OWNED BY division.id;

CREATE SEQUENCE unit_type_id_seq;
CREATE TABLE unit_type (
       id INTEGER PRIMARY KEY DEFAULT nextval('unit_type_id_seq'),
       crisis INTEGER REFERENCES crisis (id) ON DELETE CASCADE,
       speed DOUBLE PRECISION NOT NULL DEFAULT 1.0,
       unit_name VARCHAR(40) NOT NULL
);
ALTER SEQUENCE unit_type_id_seq OWNED BY unit_type.id;

CREATE TABLE unit (
       division INTEGER REFERENCES division (id) ON DELETE CASCADE,
       unit_type INTEGER REFERENCES unit_type (id) ON DELETE CASCADE,
       amount INTEGER NOT NULL,
       PRIMARY KEY (division, unit_type)
);

CREATE TABLE division_view (
       division_id INTEGER REFERENCES division(id) ON DELETE CASCADE,
       faction_id INTEGER REFERENCES faction(id) ON DELETE CASCADE,
       PRIMARY KEY (division_id, faction_id)
);

COMMIT;
