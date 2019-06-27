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

import org.json.JSONArray;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import erias.fr.taco.analyze.DocumentDW;
import erias.fr.taco.exceptions.InvalidArraysLength;
import fr.erias.IAMsystem.exceptions.UnfoundTokenInSentence;


public class TestDetectTACO extends HttpServlet{

	final static Logger logger = LoggerFactory.getLogger(TestDetectTACO.class);
	
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	protected Charset charset;

	public void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException ,IOException {
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

		logger.info("new Document received to test detection Taco");
		
		// parameters:
		String txt = req.getParameter("txt"); // patient num
		if (txt == null) {
			sendError(resp, "txt is null");
			return;
		}
		try {
			JSONArray jsonArray = App.documentAnalyzer.testDetection(txt);
			OutputStream os = resp.getOutputStream();
			resp.setStatus(200);
			os.write(jsonArray.toString().getBytes());
			os.close();
		} catch (InvalidArraysLength | UnfoundTokenInSentence e) {
			fr.erias.IAMsystem.exceptions.MyExceptions.logException(logger, e);
			sendError(resp, e.getMessage());
			return;
		}
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
}
