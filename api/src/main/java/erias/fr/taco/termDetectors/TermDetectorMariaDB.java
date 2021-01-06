package erias.fr.taco.termDetectors;

import java.io.IOException;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

import erias.fr.taco.mariadb.MariaDB;
import fr.erias.IAMsystem.detect.TermDetector;
import fr.erias.IAMsystem.exceptions.UnfoundTokenInSentence;
import fr.erias.IAMsystem.stopwords.IStopwords;
import fr.erias.IAMsystem.stopwords.StopwordsImpl;
import fr.erias.IAMsystem.terminology.Terminology;
import fr.erias.IAMsystem.tokenizer.ITokenizer;

public class TermDetectorMariaDB {
	
	/**
	 * Connection to mariaDB
	 */
	private final MariaDB mariaDB;
	
	/**
	 * TermDetector
	 */
	private final TermDetector termDetector;
	
	/**
	 * 
	 * @param mariaDB a mariaDB connection
	 */
	public TermDetectorMariaDB(MariaDB mariaDB) {
		this.mariaDB = mariaDB;
		this.termDetector = new TermDetector();
		try {
			retrieveStopwords(termDetector);
			retrieveAbbreviations(termDetector);
			Terminology terminology = retrieveTerms(termDetector);
			termDetector.addTerminology(terminology);
			termDetector.addLevenshteinIndex(terminology);
		} catch (ClassNotFoundException | SQLException | IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
	
	/**
	 * Retrieve the term detector from the database
	 * @return
	 * @throws SQLException 
	 * @throws ClassNotFoundException 
	 * @throws IOException 
	 */
	public TermDetector getTermDetector() throws ClassNotFoundException, SQLException, IOException {
		return(termDetector);
	}
	
	/**
	 * Retrieve terms stored in database
	 * @param termDetector
	 * @throws SQLException
	 * @throws ClassNotFoundException 
	 */
	private Terminology retrieveTerms(TermDetector termDetector) throws SQLException, ClassNotFoundException {
		Connection conn = mariaDB.getConnection();
		Statement stmt = conn.createStatement();
		ResultSet rs = stmt.executeQuery("SELECT * FROM terms;");
		Terminology terminology = new Terminology();
		while (rs.next()) {
			String term = rs.getString(1);
    		String code = rs.getString(3);
    		terminology.addTerm(term, code, termDetector.getTokenizerNormalizer().getNormalizer());
    	}
		rs.close();
		conn.close();
		return(terminology);
	}
	
	private void retrieveAbbreviations(TermDetector termDetector) throws SQLException, ClassNotFoundException {
		IStopwords stopwords = termDetector.getTokenizerNormalizer().getNormalizer().getStopwords();
		Connection conn = mariaDB.getConnection();
		Statement stmt = conn.createStatement();
		ResultSet rs = stmt.executeQuery("SELECT * FROM abbreviations;");
		while (rs.next()) {
			String abbreviation = rs.getString(1);
    		String term = rs.getString(2);
    		String[] tokensArray = termDetector.getTokenizerNormalizer().tokenizeNormalize(term).getTokens();
    		tokensArray = IStopwords.removeStopWords(stopwords, tokensArray);
    		String normalizedTerm = ITokenizer.arrayToString(tokensArray, " ".charAt(0));
    		termDetector.addAbbreviations(normalizedTerm, abbreviation);
    	}
		rs.close();
		conn.close();
	}
	
	private String getStopwordsReq = "SELECT * FROM stopwords;";
	
	private void retrieveStopwords(TermDetector termDetector) throws SQLException, ClassNotFoundException {
		Connection conn = mariaDB.getConnection();
		Statement stmt = conn.createStatement();
		IStopwords stopwords = new StopwordsImpl();
		ResultSet rs = stmt.executeQuery(getStopwordsReq);
		while (rs.next()) {
			String stopword = rs.getString(1);
			stopwords.addStopwords(stopword);
    	}
		rs.close();
		conn.close();
		termDetector.getTokenizerNormalizer().getNormalizer().setStopwords(stopwords);
	}
	
	public static void main(String[] args) throws ClassNotFoundException, SQLException, UnfoundTokenInSentence, IOException {
		MariaDB mariaDB = new MariaDB();
		mariaDB.checkConnection();
		TermDetectorMariaDB termDetectorMariaDB = new TermDetectorMariaDB(mariaDB);
		TermDetector termDetector = termDetectorMariaDB.getTermDetector();
		System.out.println(termDetector.detect("concentres culots globulairess").getCTcodes().size());
	}
}
