create sequence Did_seq start 1;
CREATE TABLE docsets (
    id INTEGER PRIMARY KEY default nextval('Did_seq'),
    docset TEXT,
    pub_date DATE default CURRENT_DATE,
    update_date DATE,
    state TEXT
);
