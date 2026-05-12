-- migrate_010_drop_seller_role.sql
-- Remove unused 'seller' role from the CHECK constraint

ALTER TABLE users DROP CONSTRAINT IF EXISTS users_role_check;
ALTER TABLE users ADD CONSTRAINT users_role_check
  CHECK (role IN ('buyer', 'agent', 'owner', 'builder'));
