CREATE TABLE `products` (
	`id` int AUTO_INCREMENT NOT NULL,
	`familyId` varchar(64) NOT NULL,
	`name` varchar(255) NOT NULL,
	`category` varchar(120) NOT NULL,
	`description` text NOT NULL,
	`imageUrl` varchar(500) NOT NULL,
	`imageAlt` varchar(255) NOT NULL,
	`refNumber` varchar(64) NOT NULL,
	`variants` text NOT NULL,
	`displayOrder` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `products_id` PRIMARY KEY(`id`),
	CONSTRAINT `products_familyId_unique` UNIQUE(`familyId`)
);
--> statement-breakpoint
CREATE TABLE `services` (
	`id` int AUTO_INCREMENT NOT NULL,
	`serviceId` varchar(64) NOT NULL,
	`title` varchar(255) NOT NULL,
	`subtitle` varchar(255) NOT NULL,
	`description` text NOT NULL,
	`imageUrl` varchar(500) NOT NULL,
	`imageAlt` varchar(255) NOT NULL,
	`duration` varchar(120) NOT NULL,
	`pricingText` varchar(255) NOT NULL,
	`details` text NOT NULL,
	`displayOrder` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `services_id` PRIMARY KEY(`id`),
	CONSTRAINT `services_serviceId_unique` UNIQUE(`serviceId`)
);
