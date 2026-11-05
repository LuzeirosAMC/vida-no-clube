CREATE TABLE `users` (`id` text PRIMARY KEY NOT NULL, `login` text NOT NULL, `password_hash` text NOT NULL, `birth_date` text NOT NULL, `role` text DEFAULT 'guest' NOT NULL, `active` integer DEFAULT true NOT NULL, `created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL, `updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_login_unique` ON `users` (`login`);
--> statement-breakpoint
CREATE TABLE `sessions` (`id` text PRIMARY KEY NOT NULL, `user_id` text NOT NULL, `token_hash` text NOT NULL, `expires_at` text NOT NULL, `created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL, FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade);
--> statement-breakpoint
CREATE UNIQUE INDEX `sessions_token_hash_unique` ON `sessions` (`token_hash`);
--> statement-breakpoint
CREATE TABLE `bank_details` (`id` integer PRIMARY KEY DEFAULT 1 NOT NULL, `pix_key` text DEFAULT '' NOT NULL, `pix_type` text DEFAULT '' NOT NULL, `account_holder` text DEFAULT '' NOT NULL, `bank_name` text DEFAULT '' NOT NULL, `instructions` text DEFAULT '' NOT NULL, `enabled` integer DEFAULT false NOT NULL, `updated_by` text, `updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL, FOREIGN KEY (`updated_by`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action);
--> statement-breakpoint
CREATE TABLE `donation_reports` (`id` text PRIMARY KEY NOT NULL, `donor_name` text, `donor_user_id` text, `amount_cents` integer NOT NULL, `purpose` text NOT NULL, `note` text DEFAULT '' NOT NULL, `status` text DEFAULT 'reported' NOT NULL, `created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL, `reviewed_by` text, `reviewed_at` text, FOREIGN KEY (`donor_user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE set null, FOREIGN KEY (`reviewed_by`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action);
--> statement-breakpoint
CREATE TABLE `submissions` (`id` text PRIMARY KEY NOT NULL, `author_id` text NOT NULL, `kind` text NOT NULL, `title` text DEFAULT '' NOT NULL, `body` text DEFAULT '' NOT NULL, `object_key` text, `mime_type` text, `status` text DEFAULT 'pending' NOT NULL, `moderation_note` text DEFAULT '' NOT NULL, `reviewed_by` text, `reviewed_at` text, `created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL, FOREIGN KEY (`author_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade, FOREIGN KEY (`reviewed_by`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action);
--> statement-breakpoint
CREATE TABLE `audit_log` (`id` text PRIMARY KEY NOT NULL, `actor_id` text, `action` text NOT NULL, `target_type` text NOT NULL, `target_id` text NOT NULL, `details` text DEFAULT '' NOT NULL, `created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL, FOREIGN KEY (`actor_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE set null);
