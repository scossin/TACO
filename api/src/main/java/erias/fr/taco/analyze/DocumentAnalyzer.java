package erias.fr.taco.analyze;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import erias.fr.taco.exceptions.InvalidArraysLength;
import fr.erias.IAMsystem.exceptions.UnfoundTokenInSentence;

/**
 * The class that analyzes a new Document
 * 
 * @author cossin
 *
 */
public class DocumentAnalyzer {
	
	/**
	 * The instance that segments the sentences
	 */
	private SentenceSegmentation sentenceSegmentation;
	
	/**
	 * the instance that analyses each sentence
	 */
	private SentenceAnalyzer sentenceAnalyzer;

	/**
	 * Constructor to analyze document
	 * @param sentenceSegmentation
	 * @param sentenceAnalyzer
	 */
	public DocumentAnalyzer(SentenceSegmentation sentenceSegmentation, SentenceAnalyzer sentenceAnalyzer) {
		this.sentenceSegmentation = sentenceSegmentation;
		this.sentenceAnalyzer = sentenceAnalyzer;
	}
	
	/**
	 * 
	 * @param docDw a {@link DocumentDW}
	 * @throws InvalidArraysLength
	 * @throws UnfoundTokenInSentence
	 */
	public void analyzerDoc(DocumentDW docDw) throws InvalidArraysLength, UnfoundTokenInSentence {
		sentenceSegmentation.setContent(docDw.getTxt());
		for (Sentence sentence : sentenceSegmentation.getSentences()) {
			sentenceAnalyzer.analyzeSentence(sentence.getContent(),docDw);
		}
	}
	
	/**
	 * 
	 * @param txt textual content to test Detection
	 * @return
	 * @throws InvalidArraysLength
	 * @throws JSONException
	 * @throws UnfoundTokenInSentence
	 */
	public JSONArray testDetection(String txt) throws InvalidArraysLength, JSONException, UnfoundTokenInSentence {
		JSONArray jsonArray = new JSONArray();
		sentenceSegmentation.setContent(txt);
		for (Sentence sentence : sentenceSegmentation.getSentences()) {
			JSONObject jsonSentence = sentence.getJSONrepresentation();
			jsonSentence.put("detectionSentence", sentenceAnalyzer.testDetection(sentence.getContent()));
			jsonArray.put(jsonSentence);
		}
		return(jsonArray);
	}
}
