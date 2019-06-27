MariaDBapi <- R6::R6Class(
  classname="MariaDBapi",
  
  public=list(
    con = NULL,
    username = character(),
    password = character(),
    host= character(),
    port = character(),
    dbname = character(),
    
    initialize = function(host, port, dbname,username){
      self$host <- host
      self$port <- port
      self$dbname <- dbname
      self$username <- username
      self$password <- getPass::getPass(msg="mariadb password:")
    },
    
    connect = function(){
      self$con <- DBI::dbConnect(RMariaDB::MariaDB(), 
                                 username= self$username, 
                                 password= self$password,
                                 host=self$host,
                                 port=self$port, 
                                 dbname=self$dbname)
    },
    
    appendTable = function(table){
      self$connect()
      tableName <- deparse(substitute(table))
      RMariaDB::dbWriteTable(self$con, tableName, 
                   table, append=T)
      self$disconnect()
    },
    
    truncateTable = function(table){
      self$connect()
      tableName <- deparse(substitute(table))
      query <- paste0("TRUNCATE TABLE ",tableName)
      RMariaDB::dbSendQuery(self$con, query)
      self$disconnect()
    },
    
    getTable = function(tableName){
      self$connect()
      tableName <- tolower(tableName)
      query <- paste0("SELECT * FROM ", tableName)
      res <- RMariaDB::dbSendQuery(self$con,query)
      results <- RMariaDB::dbFetch(res)
      RMariaDB::dbClearResult(res)
      self$disconnect()
      return(results)
    },
    
    sendQuery = function(query){
      self$connect()
      res <- RMariaDB::dbSendQuery(self$con,query)
      results <- RMariaDB::dbFetch(res)
      RMariaDB::dbClearResult(res)
      self$disconnect()
      return(results)
    },
    
    getFields = function(tableName){
      self$connect()
      fields <- RMariaDB::dbListFields(self$con, tableName)
      self$disconnect()
      return(fields)
    },
    
    disconnect = function(){
      RMariaDB::dbDisconnect(self$con)
      # cat("disconnected \n")
    },
    
    getTables = function() {
      self$connect()
      tables <- RMariaDB::dbListTables(self$con)
      self$disconnect()
      return(tables)
    },
    
    getTableCreateDf = function(tableName){
      newTableName <- tolower(tableName)
      if(!exists(newTableName)){
        theTable <- self$getTable(tableName)
        assign(newTableName, theTable, envir = globalenv())
        cat(newTableName, "table created \n")
      } else {
        cat(newTableName, "table already exist \n")
      }
    }
  ),
  
  private=list(
    
  )
)