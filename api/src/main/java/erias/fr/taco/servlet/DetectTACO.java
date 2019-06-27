package erias.fr.taco.servlet;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.nio.charset.Charset;
import java.util.Scanner;

import javax.servlet.ServletException;
import javax.servlet.ServletInputStream;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import erias.fr.taco.analyze.DocumentDW;
import erias.fr.taco.exceptions.InvalidArraysLength;
import fr.erias.IAMsystem.exceptions.UnfoundTokenInSentence;


public class DetectTACO extends HttpServlet{

	final static Logger logger = LoggerFactory.getLogger(DetectTACO.class);
	
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	protected Charset charset;

	public void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException ,IOException {
		resp.setContentType("application/json");
		resp.setHeader("Content-Disposition","attachment;filename="+"response.json");

		// Charset
		String reqCharset = req.getCharacterEncoding();
		if (reqCharset == null) {
			charset = Charset.forName("UTF-8");
		} else if (Charset.isSupported(reqCharset)) {
			charset = Charset.forName(reqCharset);
		} else {
			charset = Charset.forName("UTF-8");
		}

		logger.info("new Document received to detect Taco");
		
		// txt content read in the body:
		String txt = getStringInput(req);
		
		// parameters:
		String npat = req.getParameter("Npat"); // patient num
		if (npat == null) {
			sendError(resp, "Npat is null");
			return;
		}
		String nsej = req.getParameter("Nsej"); // encounter num
		if (nsej == null) {
			sendError(resp, "Nsej is null");
			return;
		}
		String date = req.getParameter("date"); // document date
		if (date == null) {
			sendError(resp, "date is null");
			return;
		}
		String loc = req.getParameter("loc"); // some info on localization (compte rendu, formulaire...)
		if (loc == null) {
			sendError(resp, "loc is null");
			return;
		}
		
		DocumentDW docDw = new DocumentDW(txt, npat, nsej, date, loc);
		try {
			App.documentAnalyzer.analyzerDoc(docDw);
		} catch (InvalidArraysLength | UnfoundTokenInSentence e) {
			fr.erias.IAMsystem.exceptions.MyExceptions.logException(logger, e);
			sendError(resp, e.getMessage());
			return;
		}

		JSONObject jsonObject = new JSONObject();
		OutputStream os = resp.getOutputStream();
		resp.setStatus(200);
		os.write(jsonObject.toString().getBytes());
		os.close();
	}
	
	private void sendError(HttpServletResponse resp, String msg) throws IOException {
		JSONObject jsonObject = new JSONObject();
		OutputStream os = resp.getOutputStream();
		jsonObject.put("err", msg);
		resp.setStatus(500);
		os.write(jsonObject.toString().getBytes());
		os.close();
		return;
	}
	
	private String getStringInput(HttpServletRequest req) throws ServletException {
		ServletInputStream in;
		String stringInput = null;
		try {
			in = req.getInputStream();
			stringInput = convert(in, charset);
			in.close();
		} catch (IOException e) {
			fr.erias.IAMsystem.exceptions.MyExceptions.logMessage(logger, "Something went wrong reading the file");
			fr.erias.IAMsystem.exceptions.MyExceptions.logException(logger, e);
			throw new ServletException();
		}
		logger.info("stringInput has " + stringInput.getBytes().length + " bytes");
		return(stringInput);
	}
	
	private static String convert(InputStream inputStream, Charset charset) throws IOException {
		try (Scanner scanner = new Scanner(inputStream, charset.name())) {
			return scanner.useDelimiter("\\A").next();
		}
	}
}
