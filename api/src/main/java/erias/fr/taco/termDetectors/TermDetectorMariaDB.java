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
		ResultSet rs = stmt.executeQuery("SELECT term, code FROM terms;");
		Terminology terminology = new Terminology();
		while (rs.next()) {
			String term = rs.getString("term");
    		String code = rs.getString("code");
    		terminology.addTerm(term, code, termDetector.getTokenizerNormalizer().getNormalizer());
    	}
		rs.close();
		conn.close();
		return(terminology);
	}
	
	/**
	 * Add abbreviations to the termDetector
	 * @param termDetector
	 * @throws SQLException
	 * @throws ClassNotFoundException
	 */
	private void retrieveAbbreviations(TermDetector termDetector) throws SQLException, ClassNotFoundException {
		IStopwords stopwords = termDetector.getTokenizerNormalizer().getNormalizer().getStopwords();
		Connection conn = mariaDB.getConnection();
		Statement stmt = conn.createStatement();
		ResultSet rs = stmt.executeQuery("SELECT abbreviation, term FROM abbreviations;");
		while (rs.next()) {
			String abbreviation = rs.getString("abbreviation");
    		String term = rs.getString("term");
    		String[] tokensArray = termDetector.getTokenizerNormalizer().tokenizeNormalize(term).getTokens();
    		tokensArray = IStopwords.removeStopWords(stopwords, tokensArray);
    		String normalizedTerm = ITokenizer.arrayToString(tokensArray, " ".charAt(0));
    		termDetector.addAbbreviations(normalizedTerm, abbreviation);
    	}
		rs.close();
		conn.close();
	}
	
	/**
	 * add stopwords to the TermDetector
	 * @param termDetector
	 * @throws SQLException
	 * @throws ClassNotFoundException
	 */
	private void retrieveStopwords(TermDetector termDetector) throws SQLException, ClassNotFoundException {
		Connection conn = mariaDB.getConnection();
		Statement stmt = conn.createStatement();
		IStopwords stopwords = new StopwordsImpl();
		ResultSet rs = stmt.executeQuery("SELECT stopword FROM stopwords;");
		while (rs.next()) {
			String stopword = rs.getString("stopword");
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
		System.out.println(termDetector.detect("concenttre de globules rouges").getCTcodes().size());
	}
}
