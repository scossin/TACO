source("MariaDBapi.R")
mariaDBapi <- MariaDBapi$new(host = "127.0.0.1",
                             port = "3307",
                             dbname = "TACO",
                             username = "hemovigilants")

mariaDBapi$getTables()

### terms and abbreviations : 
terms <- read.table("terms.csv",sep = "\t",header=T)
stopwords <- readLines("stopwords")
abbreviations <- read.table("abbreviations.csv",sep="\t",header=T)


termDetector <- RIAMsystem::newTermDetector()
RIAMsystem::addStopwords(termDetector = termDetector, stopwords = stopwords)
RIAMsystem::addTerms(termDetector,terms = terms$term, codes = terms$term)
i <- 1
for (i in 1:nrow(abbreviations)){
  abbreviation <- as.character(abbreviations$abbreviation[i])
  token <- as.character(abbreviations$term[i])
  RIAMsystem::addAbbreviations(termDetector = termDetector,token = token,abbreviation = abbreviation)
}

### tests :
RIAMsystem::detect(termDetector = termDetector, text = "concentrés de GR")
RIAMsystem::detect(termDetector = termDetector, text = "CGR")
RIAMsystem::detect(termDetector = termDetector, text = "oedeme aigu pulmonaire")
RIAMsystem::detect(termDetector = termDetector, text = "oedeme du poumon")
RIAMsystem::detect(termDetector = termDetector, text = "œdème post-transfusionnel")
RIAMsystem::detect(termDetector = termDetector, text = "dyspnée")
RIAMsystem::detect(termDetector = termDetector, text = "oap")
RIAMsystem::detect(termDetector = termDetector, text = "décompensation cardiaque")


## concepts
concepts <- data.frame(concept=c("transfusion","taco"),concept_id=1:2)
mariaDBapi$appendTable(table = concepts)

## terms
terms <- merge(terms, concepts, by.x="concept")
terms$concept <- NULL
terms$code <- terms$term
mariaDBapi$appendTable(table = terms)

## abbreviations
abbreviations <- merge(abbreviations, concepts, by.x="concept")
abbreviations$concept <- NULL
mariaDBapi$appendTable(table = abbreviations)

## stopwords
stopwords <- data.frame(stopword=stopwords)
mariaDBapi$appendTable(table = stopwords)


mariaDBapi$getTable(tableName = "terms")

rm(signaux)
mariaDBapi$getTableCreateDf(tableName = "signaux")
