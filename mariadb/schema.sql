-- MySQL dump 10.16  Distrib 10.3.10-MariaDB, for debian-linux-gnu (x86_64)
--
-- Host: localhost    Database: TACO
-- ------------------------------------------------------
-- Server version	10.3.10-MariaDB-1:10.3.10+maria~bionic

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `UsersAuth`
--

DROP TABLE IF EXISTS `UsersAuth`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `UsersAuth` (
  `email` varchar(255) NOT NULL,
  `pw` text DEFAULT NULL,
  `username` text DEFAULT NULL,
  `organisme` text DEFAULT NULL,
  PRIMARY KEY (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `abbreviations`
--

DROP TABLE IF EXISTS `abbreviations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `abbreviations` (
  `abbreviation` tinytext NOT NULL,
  `term` tinytext NOT NULL,
  `concept_id` smallint(6) NOT NULL,
  KEY `fk_concept_id_abbreviation` (`concept_id`),
  CONSTRAINT `fk_concept_id_abbreviation` FOREIGN KEY (`concept_id`) REFERENCES `concepts` (`concept_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `abbreviations`
--

LOCK TABLES `abbreviations` WRITE;
/*!40000 ALTER TABLE `abbreviations` DISABLE KEYS */;
INSERT INTO `abbreviations` VALUES ('oap','oedeme aigu du poumon',2),('aigue','aigu',2),('dyspne','dyspnee',2),('œdeme','oedeme',2),('oedemes','oedeme',2),('pulmonaire','poumon',2),('poumons','poumon',2),('gr','globules rouges',1),('cgr','concentre de globules rouges',1),('globule','globules',1),('rouge','rouges',1),('transfusions','transfusion',1),('culots','culot',1),('globulaires','globulaire',1),('concentres','concentre',1),('psl','produit sanguin labile',1);
/*!40000 ALTER TABLE `abbreviations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `concepts`
--

DROP TABLE IF EXISTS `concepts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `concepts` (
  `concept` tinytext NOT NULL,
  `concept_id` smallint(6) NOT NULL,
  UNIQUE KEY `concept_id` (`concept_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `concepts`
--

LOCK TABLES `concepts` WRITE;
/*!40000 ALTER TABLE `concepts` DISABLE KEYS */;
INSERT INTO `concepts` VALUES ('transfusion',1),('taco',2);
/*!40000 ALTER TABLE `concepts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `signaux`
--

DROP TABLE IF EXISTS `signaux`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `signaux` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `txt` text NOT NULL,
  `npat` tinytext NOT NULL,
  `nsej` tinytext NOT NULL,
  `date` datetime NOT NULL,
  `loc` tinytext NOT NULL,
  `validation` smallint(6) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `signaux`
--

LOCK TABLES `signaux` WRITE;
/*!40000 ALTER TABLE `signaux` DISABLE KEYS */;
INSERT INTO `signaux` VALUES (1,'oap apres concentre de globules rougess','5','7','2019-06-13 00:00:00','CRC',0),(2,'oap apres transfusion de 3 cgr','5','8','2019-06-20 00:00:00','CRC',0),(3,'atcd d oap apres transfusion de 3 cgr','5','9','2019-06-21 00:00:00','CRC',2);
/*!40000 ALTER TABLE `signaux` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `stopwords`
--

DROP TABLE IF EXISTS `stopwords`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `stopwords` (
  `stopword` tinytext NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `stopwords`
--

LOCK TABLES `stopwords` WRITE;
/*!40000 ALTER TABLE `stopwords` DISABLE KEYS */;
INSERT INTO `stopwords` VALUES ('du'),('de');
/*!40000 ALTER TABLE `stopwords` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `terms`
--

DROP TABLE IF EXISTS `terms`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `terms` (
  `term` tinytext NOT NULL,
  `code` tinytext NOT NULL,
  `concept_id` smallint(6) NOT NULL,
  KEY `fk_concept_id_terms` (`concept_id`),
  CONSTRAINT `fk_concept_id_terms` FOREIGN KEY (`concept_id`) REFERENCES `concepts` (`concept_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `terms`
--

LOCK TABLES `terms` WRITE;
/*!40000 ALTER TABLE `terms` DISABLE KEYS */;
INSERT INTO `terms` VALUES ('oedeme aigu du poumon','oedeme aigu du poumon',2),('oedeme du poumon','oedeme du poumon',2),('dyspnee','dyspnee',2),('sdra','sdra',2),('lasilix','lasilix',2),('taco','taco',2),('decompensation cardiaque','decompensation cardiaque',2),('transfusion','transfusion',1),('culot globulaire','culot globulaire',1),('concentre globulaire','concentre globulaire',1),('produit sanguin labile','produit sanguin labile',1),('transfusionnel','transfusionnel',1),('posttransfusionnel','posttransfusionnel',1),('concentre de globules rouges','concentre de globules rouges',1);
/*!40000 ALTER TABLE `terms` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2019-06-26 12:15:15
