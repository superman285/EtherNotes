/*
 Navicat MySQL Data Transfer

 Source Server         : 我的数据库
 Source Server Type    : MySQL
 Source Server Version : 80012
 Source Host           : localhost:3306
 Source Schema         : notesDB

 Target Server Type    : MySQL
 Target Server Version : 80012
 File Encoding         : 65001

 Date: 14/02/2019 09:44:30
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for notesContent
-- ----------------------------
DROP TABLE IF EXISTS `notesContent`;
CREATE TABLE `notesContent` (
  `uid` int(10) unsigned NOT NULL,
  `text` varchar(255) NOT NULL,
  `noteid` int(10) unsigned NOT NULL,
  PRIMARY KEY (`uid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

SET FOREIGN_KEY_CHECKS = 1;
