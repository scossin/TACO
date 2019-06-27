package erias.fr.taco.analyze;

import java.io.IOException;
import java.io.InputStream;
import java.sql.SQLException;

import erias.fr.taco.exceptions.InvalidArraysLength;
import erias.fr.taco.mariadb.MariaDB;
import erias.fr.taco.servlet.App;
import fr.erias.IAMsystem.exceptions.UnfoundTokenInSentence;

/**
 * Tests for development only
 * @author cossin
 *
 */
public class Test {

	public static void appTest() throws ClassNotFoundException, SQLException, InvalidArraysLength, UnfoundTokenInSentence {
		String txt = "Hospitalisation ce jour pour OAP post-transfusionnel. "
				+ "Le patient a présenté une dyspnée après passage de 2 CGR";
		DocumentDW docDw = new DocumentDW(txt, "0", "1", "2015-03-03", "CRH");
		App.documentAnalyzer.analyzerDoc(docDw);
	}
	
	public static void jsonTest() throws ClassNotFoundException, SQLException, InvalidArraysLength, UnfoundTokenInSentence {
		String txt = "Hospitalisation ce jour pour OAP post-transfusionnel. "
				+ "Le patient a présenté une dyspnée après passage de 2 CGR";
		DocumentDW docDw = new DocumentDW(txt, "0", "1", "2015-03-03", "CRH");
		App.documentAnalyzer.analyzerDoc(docDw);
	}
	
	public static void main(String[] args){
		
	}
}
