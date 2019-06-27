package erias.fr.taco.analyze;

import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.TreeSet;

import javax.json.JsonObject;

import org.json.JSONArray;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import erias.fr.taco.exceptions.InvalidArraysLength;
import erias.fr.taco.mariadb.MariaDB;
import erias.fr.taco.servlet.App;
import fr.erias.IAMsystem.ct.CTcode;
import fr.erias.IAMsystem.exceptions.UnfoundTokenInSentence;

/**
 * The class that handles the results of terms detections in a document
 * @author cossin
 *
 */
public class DetectionHandlerDW implements DetectionHandler<DocumentDW> {

	final static Logger logger = LoggerFactory.getLogger(DetectionHandlerDW.class);

	/**
	 * to write in the database
	 */
	private MariaDB mariaDB;

	/**
	 * 
	 * @param mariaDB An instance to connect to the database
	 */
	public DetectionHandlerDW(MariaDB mariaDB) {
		this.mariaDB = mariaDB;
	}

	private boolean isSignal(String normalizedSentence, TreeSet<CTcode> cts) {
		logger.info("nombre de CT : " + cts.size());
		// Nothing to do if 0 term detected
		if (cts.size() == 0) {
			return false;
		}

		int ntaco = 0;
		int ntransfusion = 0;

		for (CTcode ct : cts) {
			logger.info("code : " + ct.getCode());
			if (ct.getCode().equals("1")) { // transufion is 1
				ntransfusion = ntransfusion + 1;
			} else {
				ntaco = ntaco + 1;
			}
		}

		if (ntaco == 0 || ntransfusion == 0) {
			return false;
		}

		return(true);
	}
	@Override
	public void handleDetection(String normalizedSentence, TreeSet<CTcode> cts, DocumentDW document) {
		if (!isSignal(normalizedSentence, cts)) {
			return;
		}

		try {
			addSignalDetected(normalizedSentence, document);
		} catch (ClassNotFoundException | SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		// TODO Auto-generated method stub
	}

	/**
	 * Add a detected signal to the database
	 * @param normalizedSentence
	 * @param document
	 * @throws ClassNotFoundException
	 * @throws SQLException
	 */
	private void addSignalDetected(String normalizedSentence, DocumentDW document) throws ClassNotFoundException, SQLException {
		logger.info("addSignalDetected...");
		Connection conn = mariaDB.getConnection();
		Statement stmt = conn.createStatement();
		ResultSet rs = stmt.executeQuery("INSERT INTO TACO.signaux (txt, npat, nsej, date, loc, validation) VALUES "
				+ "(" + getStringInQuote(normalizedSentence) + "," + 
				getStringInQuote(document.getNpat()) + "," + 
				getStringInQuote(document.getNsej()) + "," +
				getStringInQuote(document.getDate()) + "," +
				getStringInQuote(document.getLoc()) + "," +
				"0)");
		rs.close();
		conn.close();
	}

	private String getStringInQuote(String string) {
		return("'" + string + "'");
	}

	@Override
	public JSONObject testDetection(String sentence, TreeSet<CTcode> cts) {
		boolean signalDetected = isSignal(sentence, cts);
		JSONObject jsonObject = new JSONObject();
		jsonObject.put("sentence", sentence);
		JSONArray jsonArray = new JSONArray();
		for (CTcode ct : cts) {
			jsonArray.put(ct.getJSONobject());
		}
		jsonObject.put("cts", jsonArray);
		jsonObject.put("signalDetected", signalDetected);
		return(jsonObject);
	}
}
