-- Exact delta for existing notification tables in the current Neon database.
-- The tables, enums, and columns already exist. This migration only adds the
-- missing uniqueness and foreign-key constraints needed by the notification
-- center implementation.

CREATE UNIQUE INDEX IF NOT EXISTS notification_events_dedupe_idx
  ON public.notification_events USING btree (dedupe_key);

CREATE UNIQUE INDEX IF NOT EXISTS notifications_event_portal_recipient_idx
  ON public.notifications USING btree (event_id, portal, recipient_user_id);

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'notification_events_actor_user_id_users_id_fk'
      AND connamespace = 'public'::regnamespace
  ) THEN
    ALTER TABLE public.notification_events
      ADD CONSTRAINT notification_events_actor_user_id_users_id_fk
      FOREIGN KEY (actor_user_id)
      REFERENCES public.users(id)
      ON DELETE SET NULL;
  END IF;
END
$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'notification_events_client_id_clients_id_fk'
      AND connamespace = 'public'::regnamespace
  ) THEN
    ALTER TABLE public.notification_events
      ADD CONSTRAINT notification_events_client_id_clients_id_fk
      FOREIGN KEY (client_id)
      REFERENCES public.clients(id)
      ON DELETE CASCADE;
  END IF;
END
$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'notification_events_project_id_projects_id_fk'
      AND connamespace = 'public'::regnamespace
  ) THEN
    ALTER TABLE public.notification_events
      ADD CONSTRAINT notification_events_project_id_projects_id_fk
      FOREIGN KEY (project_id)
      REFERENCES public.projects(id)
      ON DELETE CASCADE;
  END IF;
END
$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'notifications_event_id_notification_events_id_fk'
      AND connamespace = 'public'::regnamespace
  ) THEN
    ALTER TABLE public.notifications
      ADD CONSTRAINT notifications_event_id_notification_events_id_fk
      FOREIGN KEY (event_id)
      REFERENCES public.notification_events(id)
      ON DELETE CASCADE;
  END IF;
END
$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'notifications_client_id_clients_id_fk'
      AND connamespace = 'public'::regnamespace
  ) THEN
    ALTER TABLE public.notifications
      ADD CONSTRAINT notifications_client_id_clients_id_fk
      FOREIGN KEY (client_id)
      REFERENCES public.clients(id)
      ON DELETE CASCADE;
  END IF;
END
$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'notifications_project_id_projects_id_fk'
      AND connamespace = 'public'::regnamespace
  ) THEN
    ALTER TABLE public.notifications
      ADD CONSTRAINT notifications_project_id_projects_id_fk
      FOREIGN KEY (project_id)
      REFERENCES public.projects(id)
      ON DELETE CASCADE;
  END IF;
END
$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'notification_deliveries_notification_id_notifications_id_fk'
      AND connamespace = 'public'::regnamespace
  ) THEN
    ALTER TABLE public.notification_deliveries
      ADD CONSTRAINT notification_deliveries_notification_id_notifications_id_fk
      FOREIGN KEY (notification_id)
      REFERENCES public.notifications(id)
      ON DELETE CASCADE;
  END IF;
END
$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'notification_deliveries_email_draft_id_email_drafts_id_fk'
      AND connamespace = 'public'::regnamespace
  ) THEN
    ALTER TABLE public.notification_deliveries
      ADD CONSTRAINT notification_deliveries_email_draft_id_email_drafts_id_fk
      FOREIGN KEY (email_draft_id)
      REFERENCES public.email_drafts(id)
      ON DELETE SET NULL;
  END IF;
END
$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'notification_deliveries_sent_email_id_sent_emails_id_fk'
      AND connamespace = 'public'::regnamespace
  ) THEN
    ALTER TABLE public.notification_deliveries
      ADD CONSTRAINT notification_deliveries_sent_email_id_sent_emails_id_fk
      FOREIGN KEY (sent_email_id)
      REFERENCES public.sent_emails(id)
      ON DELETE SET NULL;
  END IF;
END
$$;
