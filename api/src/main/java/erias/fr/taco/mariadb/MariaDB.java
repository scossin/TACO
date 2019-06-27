package erias.fr.taco.mariadb;


import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.HashSet;
import java.util.Properties;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import erias.fr.taco.termDetectors.TermDetector;


/**
 * The class that communicates with the MariaDB database
 * @author Cossin Sebastien (cossin.sebastien@gmail.com)
 *
 */
public class MariaDB {
	
	final static Logger logger = LoggerFactory.getLogger(MariaDB.class);
	
	private String retrieveTermsReq = "SELECT * FROM terms;";
	private String getStopwordsReq = "SELECT * FROM stopwords";
	
	/**
	 * Connection properties
	 */
	private Properties properties = new Properties();
	
	private void setProperties() {
		properties.put("user", ConfigMariaDB.USER);
		properties.put("password", ConfigMariaDB.PASSWORD);
		properties.put("timezone", ConfigMariaDB.TIMEZONE);
	}
	
	/**
	 * New MariaDB instance
	 */
	public MariaDB() {
		this.setProperties();
	}
	
	/**
	 * Check connection to MariaDB
	 * @throws ClassNotFoundException
	 * @throws SQLException
	 */
	public void checkConnection() throws ClassNotFoundException, SQLException {
		logger.info("checking connection to mariaDB...");
		Connection conn = getConnection();
		Statement stmt = conn.createStatement();
		ResultSet rs = stmt.executeQuery("SHOW TABLES");
		while (rs.next()) {
    		String table = rs.getString(1);
    		logger.info("table : " + table);
    	}
		rs.close();
		conn.close();
	}
	
	public Connection getConnection() throws SQLException, ClassNotFoundException {
		Class.forName("org.mariadb.jdbc.Driver");
		Connection conn = DriverManager.getConnection(ConfigMariaDB.getURL(), properties);
		return(conn);
	}
	
	/**
	 * Retrieve terms stored in database
	 * @param termDetector
	 * @throws SQLException
	 * @throws ClassNotFoundException 
	 */
	public void retrieveTerms(TermDetector termDetector) throws SQLException, ClassNotFoundException {
		Connection conn = getConnection();
		Statement stmt = conn.createStatement();
		ResultSet rs = stmt.executeQuery(this.retrieveTermsReq);
		while (rs.next()) {
    		String term = rs.getString(2);
    		termDetector.addTerm(term, "code");
    	}
		rs.close();
		conn.close();
	}
	
	/**
	 * Retrieve all the terms in the database
	 * @return all the terms in the terms table
	 * @throws SQLException
	 * @throws ClassNotFoundException
	 */
	public HashSet<String> getTerms() throws SQLException, ClassNotFoundException {
		HashSet<String> terms = new HashSet<String>();
		Connection conn = getConnection();
		Statement stmt = conn.createStatement();
		ResultSet rs = stmt.executeQuery(this.retrieveTermsReq);
		while (rs.next()) {
    		String term = rs.getString(2);
    		terms.add(term);
    	}
		rs.close();
		conn.close();
		return(terms);
	}
	
	/**
	 * Retrieve all the stopwords
	 * @return
	 * @throws SQLException
	 * @throws ClassNotFoundException
	 */
	
	public HashSet<String> getStopwords() throws SQLException, ClassNotFoundException {
		HashSet<String> terms = new HashSet<String>();
		Connection conn = getConnection();
		Statement stmt = conn.createStatement();
		ResultSet rs = stmt.executeQuery(this.getStopwordsReq);
		while (rs.next()) {
    		String term = rs.getString(1);
    		terms.add(term);
    	}
		rs.close();
		conn.close();
		return(terms);
	}
	
	/**
	 * Connection properties
	 * @return
	 */
	private Properties getProps() {
		return(properties);
	}
	
	
	// test the connection
	public static void main(String[] args) throws SQLException {
		MariaDB mariaDBconnection = new MariaDB();
		//create connection for a server installed in localhost, with a user "root" with no password
        try (Connection conn = DriverManager.getConnection(
        		ConfigMariaDB.getURL(), mariaDBconnection.getProps())) {
            // create a Statement
            try (Statement stmt = conn.createStatement()) {
                //execute query
                try (ResultSet rs = stmt.executeQuery(
                		"SELECT * from terms")) {
                    //position result to first
                	while (rs.next()) {
                		String term = rs.getString(3);
                		System.out.println(term);
                	}
                }
            }
        }
	}
}

