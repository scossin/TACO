package erias.fr.taco.termDetectors;

import java.io.IOException;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

import erias.fr.taco.mariadb.MariaDB;
import fr.erias.IAMsystem.detect.Synonym;
import fr.erias.IAMsystem.exceptions.UnfoundTokenInSentence;

public class TermDetectorMariaDB {
	
	/**
	 * Connection to mariaDB
	 */
	private MariaDB mariaDB;
	
	/**
	 * 
	 * @param mariaDB a mariaDB connection
	 */
	public TermDetectorMariaDB(MariaDB mariaDB) {
		this.mariaDB = mariaDB;
	}
	
	/**
	 * Retrieve the term detector from the database
	 * @return
	 * @throws SQLException 
	 * @throws ClassNotFoundException 
	 * @throws IOException 
	 */
	public TermDetector getTermDetector() throws ClassNotFoundException, SQLException, IOException {
		TermDetector termDetector = new TermDetector();
		retrieveStopwords(termDetector);
		retrieveTerms(termDetector);
		retrieveAbbreviations(termDetector);
		addLuceneTypos(termDetector);
		return(termDetector);
	}
	
	private void addLuceneTypos(TermDetector termDetector) throws ClassNotFoundException, IOException, SQLException {
		Synonym synonym = new LuceneTypos(this.mariaDB).getLevenshteinSynonym();
		termDetector.getDetectDictionaryEntry().addSynonym(synonym);
	}
	
	
	/**
	 * Retrieve terms stored in database
	 * @param termDetector
	 * @throws SQLException
	 * @throws ClassNotFoundException 
	 */
	private void retrieveTerms(TermDetector termDetector) throws SQLException, ClassNotFoundException {
		Connection conn = mariaDB.getConnection();
		Statement stmt = conn.createStatement();
		ResultSet rs = stmt.executeQuery("SELECT * FROM terms;");
		while (rs.next()) {
			String term = rs.getString(1);
    		String code = rs.getString(3);
    		termDetector.addTerm(term, code);
    	}
		rs.close();
		conn.close();
	}
	
	private void retrieveAbbreviations(TermDetector termDetector) throws SQLException, ClassNotFoundException {
		Connection conn = mariaDB.getConnection();
		Statement stmt = conn.createStatement();
		ResultSet rs = stmt.executeQuery("SELECT * FROM abbreviations;");
		while (rs.next()) {
			String abbreviation = rs.getString(1);
    		String term = rs.getString(2);
    		termDetector.addAbbreviations(term, abbreviation);
    	}
		rs.close();
		conn.close();
	}
	
	private String getStopwordsReq = "SELECT * FROM stopwords;";
	
	private void retrieveStopwords(TermDetector termDetector) throws SQLException, ClassNotFoundException {
		Connection conn = mariaDB.getConnection();
		Statement stmt = conn.createStatement();
		ResultSet rs = stmt.executeQuery(getStopwordsReq);
		while (rs.next()) {
			String stopword = rs.getString(1);
    		termDetector.addStopwords(stopword);
    	}
		rs.close();
		conn.close();
	}
	
	
	
	public static void main(String[] args) throws ClassNotFoundException, SQLException, UnfoundTokenInSentence, IOException {
		MariaDB mariaDB = new MariaDB();
		mariaDB.checkConnection();
		
		
		TermDetectorMariaDB termDetectorMariaDB = new TermDetectorMariaDB(mariaDB);
		TermDetector termDetector = termDetectorMariaDB.getTermDetector();
		
		System.out.println(termDetector.detect("concentrés de GR").size());
	}
}
