PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_show_reel_clips` (
	`show_reel_id` text NOT NULL,
	`video_clip_id` text NOT NULL,
	`position` integer NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	PRIMARY KEY(`show_reel_id`, `position`),
	FOREIGN KEY (`show_reel_id`) REFERENCES `show_reels`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`video_clip_id`) REFERENCES `video_clips`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_show_reel_clips`("show_reel_id", "video_clip_id", "position", "created_at") SELECT "show_reel_id", "video_clip_id", "position", "created_at" FROM `show_reel_clips`;--> statement-breakpoint
DROP TABLE `show_reel_clips`;--> statement-breakpoint
ALTER TABLE `__new_show_reel_clips` RENAME TO `show_reel_clips`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE INDEX `show_reel_clips_show_reel_id_idx` ON `show_reel_clips` (`show_reel_id`);--> statement-breakpoint
CREATE INDEX `show_reel_clips_video_clip_id_idx` ON `show_reel_clips` (`video_clip_id`);--> statement-breakpoint
ALTER TABLE `video_clips` ADD `deleted_at` integer;--> statement-breakpoint
CREATE INDEX `video_clips_deleted_at_idx` ON `video_clips` (`deleted_at`);