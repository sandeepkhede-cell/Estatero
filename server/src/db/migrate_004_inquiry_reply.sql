-- ============================================================
-- Migration 004 — Inquiry reply columns
-- Run once: psql $DATABASE_URL -f src/db/migrate_004_inquiry_reply.sql
-- Safe to re-run: uses IF NOT EXISTS.
-- ============================================================

ALTER TABLE inquiries
  ADD COLUMN IF NOT EXISTS reply_message TEXT,
  ADD COLUMN IF NOT EXISTS replied_at    TIMESTAMPTZ;
