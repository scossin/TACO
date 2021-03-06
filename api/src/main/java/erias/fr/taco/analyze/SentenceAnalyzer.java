package erias.fr.taco.analyze;

import java.util.TreeSet;
import org.json.JSONObject;
import erias.fr.taco.termDetectors.TermDetector;
import fr.erias.IAMsystem.ct.CTcode;
import fr.erias.IAMsystem.exceptions.UnfoundTokenInSentence;

/**
 * This class analyzes the sentence to detect signals 
 * 
 * @author cossin
 *
 */
public class SentenceAnalyzer {
	
	/**
	 * termDetector has a terminology
	 */
	private TermDetector termDetector;
	
	/**
	 * the instance that handle the results of the TermDetector
	 */
	private DetectionHandler<DocumentDW> detectionHandler;
	
	/**
	 * Constructor 
	 * @param termDetector termDetector has a terminology
	 * @param coocurenceHandler the instance that handle the results of the TermDetector
	 */
	public SentenceAnalyzer(TermDetector termDetector, DetectionHandler<DocumentDW> coocurenceHandler) {
		this.termDetector = termDetector;
		this.detectionHandler = coocurenceHandler;
	}
	
	/**
	 * 
	 * @param sentence the sentence to analyze
	 * @param doc the document where the sentence comes from
	 * @throws UnfoundTokenInSentence
	 */
	public void analyzeSentence(String sentence, DocumentDW doc) throws UnfoundTokenInSentence {
		TreeSet<CTcode> cts = termDetector.detect(sentence);
		String normalizedSentence = termDetector.getTokenizerNormalizer().getNormalizerTerm().getNormalizedSentence();
		detectionHandler.handleDetection(normalizedSentence, cts , doc);
	}
	
	/**
	 * Test the detection - return a jsonObject
	 * @param sentence
	 * @return 
	 * @throws UnfoundTokenInSentence
	 */
	public JSONObject testDetection(String sentence) throws UnfoundTokenInSentence {
		TreeSet<CTcode> cts = termDetector.detect(sentence);
		String normalizedSentence = termDetector.getTokenizerNormalizer().getNormalizerTerm().getNormalizedSentence();
		return(detectionHandler.testDetection(normalizedSentence, cts));
	}
}
