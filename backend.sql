-- phpMyAdmin SQL Dump
-- version 4.5.2
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Apr 05, 2018 at 12:20 PM
-- Server version: 10.1.13-MariaDB
-- PHP Version: 5.6.20

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `backend`
--

-- --------------------------------------------------------

--
-- Table structure for table `facebookuser`
--

CREATE TABLE `facebookuser` (
  `userid` varchar(255) NOT NULL,
  `username` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `facebookuser`
--

INSERT INTO `facebookuser` (`userid`, `username`) VALUES
('2090545357847773', 'Tharun Rajendran');

-- --------------------------------------------------------

--
-- Table structure for table `googleuser`
--

CREATE TABLE `googleuser` (
  `userid` varchar(255) NOT NULL,
  `username` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `googleuser`
--

INSERT INTO `googleuser` (`userid`, `username`, `email`) VALUES
('105565190919104206731', 'tharun rajendran', 'rajendrantharun@gmail.com');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `mobile` varchar(255) NOT NULL,
  `dob` varchar(255) NOT NULL,
  `secretKey` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`name`, `email`, `password`, `mobile`, `dob`, `secretKey`) VALUES
('Tharun R', 'rajendrantharun@live.com', 'lovecode<3', 'undefined', '20-08-1996', 'FAYVGJRVJFQTORJUPMQSCQBEPVUCY2KX');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `facebookuser`
--
ALTER TABLE `facebookuser`
  ADD PRIMARY KEY (`userid`);

--
-- Indexes for table `googleuser`
--
ALTER TABLE `googleuser`
  ADD PRIMARY KEY (`userid`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`email`);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
