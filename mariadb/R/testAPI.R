### Send documents to the API : 
library(httr)

txt <- "oap apres concentre de globules rougess"
nsej <- 7
npat <- 5
date <- "2019-06-13"
loc <- "CRC"

txt <- "oap apres transfusion de 3 CGR"
nsej <- 8
npat <- 5
date <- "2019-06-20"
loc <- "CRC"

txt <- "ATCD d'oap apres transfusion de 3 CGR"
nsej <- 9
npat <- 5
date <- "2019-06-21"
loc <- "CRC"

results <- httr::POST(url="http://localhost:8893/taco-0.0.1/DetectTACO",
           body = txt, 
           query=list(
             Nsej = nsej,
             Npat = npat,
             date = date,
             loc = loc
           ))
rawToChar(results$content)
results$status_code


results <- httr::GET(url="http://localhost:8893/taco-0.0.1/TestDetectTACO",
                      query=list(
                        txt = txt
                      ))
content <- rawToChar(results$content)
json <- jsonlite::fromJSON(content)
json$detectionSentence
results$status_code
