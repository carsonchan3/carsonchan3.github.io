ALTER TABLE `contactSubmissions` ADD `repairIntake` text;--> statement-breakpoint
ALTER TABLE `contactSubmissions` ADD `status` enum('new','in_review','awaiting_customer','quoted','resolved','closed') DEFAULT 'new' NOT NULL;--> statement-breakpoint
ALTER TABLE `contactSubmissions` ADD `updatedAt` timestamp DEFAULT (now()) NOT NULL ON UPDATE CURRENT_TIMESTAMP;