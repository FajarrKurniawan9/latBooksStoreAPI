-- DropIndex
DROP INDEX `order_detail_books_id_fkey` ON `order_detail`;

-- DropIndex
DROP INDEX `order_detail_order_id_fkey` ON `order_detail`;

-- DropIndex
DROP INDEX `order_detail_user_id_fkey` ON `order_detail`;

-- AddForeignKey
ALTER TABLE `order_detail` ADD CONSTRAINT `order_detail_order_id_fkey` FOREIGN KEY (`order_id`) REFERENCES `order_users_list`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `order_detail` ADD CONSTRAINT `order_detail_books_id_fkey` FOREIGN KEY (`books_id`) REFERENCES `books`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `order_detail` ADD CONSTRAINT `order_detail_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
