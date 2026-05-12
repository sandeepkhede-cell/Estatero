-- migrate_008_new_roles.sql
-- Add 'owner' and 'builder' as valid user roles

ALTER TABLE users DROP CONSTRAINT IF EXISTS users_role_check;
ALTER TABLE users ADD CONSTRAINT users_role_check
  CHECK (role IN ('buyer', 'seller', 'agent', 'owner', 'builder'));
