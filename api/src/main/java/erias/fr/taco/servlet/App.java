package erias.fr.taco.servlet;

import java.io.IOException;
import java.io.InputStream;
import java.sql.SQLException;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import erias.fr.taco.analyze.DetectionHandlerDW;
import erias.fr.taco.analyze.DocumentDW;
import erias.fr.taco.analyze.SentenceAnalyzer;
import erias.fr.taco.analyze.SentenceSegmentation;
import erias.fr.taco.analyze.DocumentAnalyzer;
import erias.fr.taco.exceptions.InvalidArraysLength;
import erias.fr.taco.mariadb.MariaDB;
import erias.fr.taco.termDetectors.TermDetectorMariaDB;
import fr.erias.IAMsystem.exceptions.MyExceptions;
import fr.erias.IAMsystem.exceptions.UnfoundTokenInSentence;
import opennlp.tools.util.InvalidFormatException;

/**
 * The class that initializes at the first query and handle all the requests
 * 
 * @author cossin
 *
 */

public class App {

	final static Logger logger = LoggerFactory.getLogger(App.class);
	
	public static DocumentAnalyzer documentAnalyzer;
	
	static {
		logger.info("Initializing app...");
		logger.info("new SentenceSegmentation...");
		InputStream in = Thread.currentThread().getContextClassLoader().getResourceAsStream("fr-sent.bin");
		SentenceSegmentation sentenceSegmentation = null;
		try {
			sentenceSegmentation = new SentenceSegmentation(in);
		} catch (IOException e) {
			MyExceptions.logException(logger, e);
			e.printStackTrace();
		}
		
		logger.info("new MariaDB...");
		// terms detectors
		MariaDB mariaDB = new MariaDB();
		TermDetectorMariaDB termDetectorMariaDB = new TermDetectorMariaDB(mariaDB);
		
		logger.info("new CoocurenceHandlerDW...");
		// handle document
		DetectionHandlerDW coocurenceHandler = new DetectionHandlerDW(mariaDB);
		
		logger.info("new SentenceAnalyzer...");
		SentenceAnalyzer sentenceAnalyzer = null;
		try {
			sentenceAnalyzer = new SentenceAnalyzer(termDetectorMariaDB.getTermDetector(), coocurenceHandler);
		} catch (ClassNotFoundException | SQLException | IOException e) {
			MyExceptions.logException(logger, e);
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
		logger.info("new TextAnalyzer...");
		documentAnalyzer = new DocumentAnalyzer(sentenceSegmentation, sentenceAnalyzer);
		
		logger.info("end App initialization");
	}
	
	// the database must be running for this test
	// it will write to the database (the signal table) a new row
	public static void main(String[] args) throws InvalidArraysLength, UnfoundTokenInSentence {
		String txt = "Devant une dyspnée, transfusion de concentrés de globules rouges";
		String loc = "localisation";
		String nsej = "2";
		String npat = "1";
		String date = "2010-01-01";
		DocumentDW docDw = new DocumentDW(txt, npat, nsej, date, loc);
		App.documentAnalyzer.analyzerDoc(docDw);
	}
}
