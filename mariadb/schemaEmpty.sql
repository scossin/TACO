DROP DATABASE TACO ; 
CREATE DATABASE TACO ; 

CREATE TABLE IF NOT EXISTS TACO.concepts ( 
	`concept` TINYTEXT NOT NULL, 
	`concept_id` SMALLINT NOT NULL UNIQUE
) ENGINE = InnoDB ;

CREATE TABLE IF NOT EXISTS TACO.terms (
	`term`	TINYTEXT NOT NULL, 
	`code`	TINYTEXT NOT NULL, 
	`concept_id` SMALLINT NOT NULL,
	CONSTRAINT `fk_concept_id_terms`	
		FOREIGN KEY (concept_id) REFERENCES concepts (concept_id)
		ON UPDATE RESTRICT
) ENGINE = InnoDB ;

CREATE TABLE IF NOT EXISTS TACO.abbreviations (
	`abbreviation`	TINYTEXT NOT NULL,
	`term`	TINYTEXT NOT NULL,
	`concept_id` SMALLINT NOT NULL,
	CONSTRAINT `fk_concept_id_abbreviation`	
		FOREIGN KEY (concept_id) REFERENCES concepts (concept_id)
) ENGINE = InnoDB ;

CREATE TABLE IF NOT EXISTS TACO.stopwords (
	`stopword`	TINYTEXT NOT NULL
) ENGINE = InnoDB ;

CREATE TABLE IF NOT EXISTS TACO.signaux (
	`id` INTEGER NOT NULL PRIMARY KEY AUTO_INCREMENT,
	`txt`	TEXT NOT NULL,
	`npat`	TINYTEXT NOT NULL,
	`nsej`	TINYTEXT NOT NULL,
	`date`	DATETIME NOT NULL,
	`loc`	TINYTEXT NOT NULL,
	`validation` SMALLINT NOT NULL /* 0: not seen yet, 1: unvalidated, 2: validated*/
) ENGINE = InnoDB ;

