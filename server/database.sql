-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
-- Host: 127.0.0.1
-- Generation Time: Dec 04, 2023 at 10:38 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

-- --------------------------------------------------------
-- Database: `products_database`
-- --------------------------------------------------------

-- --------------------------------------------------------
-- Table structure for table `products`
-- --------------------------------------------------------
CREATE TABLE `products` (
  `id` int(11) NOT NULL,
  `search_term` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `brand` varchar(255) NOT NULL,
  `image` varchar(255) NOT NULL,
  `entry_data` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='storing basic product information (name, brand, image and search_term)';

-- --------------------------------------------------------
-- Table structure for table `supermarkets`
-- --------------------------------------------------------
CREATE TABLE `supermarkets` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `supermarket_name` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Stores supermarket names';

-- --------------------------------------------------------
-- Dumping data for table `supermarkets`
-- --------------------------------------------------------
INSERT INTO `supermarkets` (`id`, `supermarket_name`) VALUES
(1, 'tesco'),
(2, 'sainsburys'),
(3, 'asda'),
(4, 'morrisons'),
(5, 'ocado'),
(6, 'iceland'),
(7, 'waitrose'),
(8, 'aldi');

-- --------------------------------------------------------
-- Table structure for table `skus`
-- --------------------------------------------------------
CREATE TABLE `skus` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `sku` varchar(255) NOT NULL,
  `product_id` int(11) NOT NULL,
  `supermarket_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `product_id` (`product_id`),
  KEY `supermarket_id` (`supermarket_id`),
  CONSTRAINT `fk_skus_products` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`),
  CONSTRAINT `fk_skus_supermarkets` FOREIGN KEY (`supermarket_id`) REFERENCES `supermarkets` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Contains SKUs for each product from different supermarkets';

-- --------------------------------------------------------
-- Table structure for table `price`
-- --------------------------------------------------------
CREATE TABLE `price` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `price` decimal(10,2) NOT NULL,
  `unit_price` decimal(10,2) NOT NULL,
  `unit_measure` varchar(255) NOT NULL,
  `product_id` int(11) NOT NULL,
  `supermarket_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `product_id` (`product_id`, `supermarket_id`),
  KEY `fk_price_supermarkets` (`supermarket_id`),
  CONSTRAINT `fk_price_products` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`),
  CONSTRAINT `fk_price_supermarkets` FOREIGN KEY (`supermarket_id`) REFERENCES `supermarkets` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Store price information for products from different supermarkets';

COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
