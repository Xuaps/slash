ALTER TABLE docsets DROP COLUMN state;
ALTER TABLE docsets ADD COLUMN active boolean;
