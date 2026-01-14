CREATE TABLE `show_reels` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`video_standard` text NOT NULL,
	`video_definition` text NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `video_clips` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`video_standard` text NOT NULL,
	`video_definition` text NOT NULL,
	`start_timecode` text NOT NULL,
	`end_timecode` text NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
CREATE INDEX `video_clips_standard_definition_idx` ON `video_clips` (`video_standard`,`video_definition`);--> statement-breakpoint
CREATE TABLE `show_reel_clips` (
	`show_reel_id` text NOT NULL,
	`video_clip_id` text NOT NULL,
	`position` integer NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	PRIMARY KEY(`show_reel_id`, `video_clip_id`),
	FOREIGN KEY (`show_reel_id`) REFERENCES `show_reels`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`video_clip_id`) REFERENCES `video_clips`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `show_reel_clips_show_reel_id_idx` ON `show_reel_clips` (`show_reel_id`);--> statement-breakpoint
CREATE INDEX `show_reel_clips_video_clip_id_idx` ON `show_reel_clips` (`video_clip_id`);