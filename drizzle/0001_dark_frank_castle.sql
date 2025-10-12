CREATE TABLE `content_calendar` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`trip_id` integer NOT NULL,
	`destination_id` integer,
	`platform_id` integer,
	`scheduled_date` text NOT NULL,
	`caption` text,
	`tone` text,
	`location_suggestion` text,
	`hashtags` text,
	`status` text DEFAULT 'draft' NOT NULL,
	FOREIGN KEY (`trip_id`) REFERENCES `trips`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`destination_id`) REFERENCES `destinations`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`platform_id`) REFERENCES `platforms`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE TABLE `destinations` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`trip_id` integer NOT NULL,
	`name` text NOT NULL,
	`country` text NOT NULL,
	`latitude` real,
	`longitude` real,
	`visit_date` text,
	`notes` text,
	FOREIGN KEY (`trip_id`) REFERENCES `trips`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `location_database` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`country` text NOT NULL,
	`category` text NOT NULL,
	`description` text,
	`best_time_to_visit` text,
	`trending_score` integer DEFAULT 0,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `platforms` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`trip_id` integer NOT NULL,
	`platform_name` text NOT NULL,
	`is_selected` integer DEFAULT false,
	FOREIGN KEY (`trip_id`) REFERENCES `trips`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `trending_tags` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`tag_name` text NOT NULL,
	`usage_count` integer DEFAULT 0,
	`category` text,
	`last_updated` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `trending_tags_tag_name_unique` ON `trending_tags` (`tag_name`);--> statement-breakpoint
CREATE TABLE `trips` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` text NOT NULL,
	`title` text NOT NULL,
	`description` text,
	`start_date` text NOT NULL,
	`end_date` text NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
