package erias.fr.taco.termDetectors;

import java.util.HashSet;
import java.util.TreeSet;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import fr.erias.IAMsystem.ct.CTcode;
import fr.erias.IAMsystem.detect.DetectDictionaryEntry;
import fr.erias.IAMsystem.detect.Synonym;
import fr.erias.IAMsystem.exceptions.UnfoundTokenInSentence;
import fr.erias.IAMsystem.load.Loader;
import fr.erias.IAMsystem.normalizer.NormalizerTerm;
import fr.erias.IAMsystem.normalizer.StopwordsImpl;
import fr.erias.IAMsystem.tokenizer.TokenizerNormalizer;
import fr.erias.IAMsystem.tree.SetTokenTree;
import fr.erias.IAMsystem.tree.TokenTree;

/**
 * This class is used to detect terms in textual content. It uses the IAMsystem algorithm. 
 * 
 * @author Cossin Sebastien
 *
 */
public class TermDetector {
	
	final static Logger logger = LoggerFactory.getLogger(TermDetector.class);
	
	/**
	 * stores stopwords
	 */
	private StopwordsImpl stopwordsImpl;
	
	/**
	 * normalizes terms and textual content. It stores the stopwords instances
	 */
	private TokenizerNormalizer tokenizerNormalizer;
	
	/**
	 * store abbreviations
	 */
	private Abbreviations abbreviations = new Abbreviations();

	/**
	 * stores the terminology in a tree datastructure
	 */
	private SetTokenTree setTokenTree;
	
	/**
	 * This object stores the terminology (setTokenTree), abbreviations (synonyms) and the tokenizerNormalizer
	 */
	private DetectDictionaryEntry detectDictionaryEntry;
	
	/**
	 * Retrieves the detector
	 * @return DetectDictionaryEntry
	 */
	public DetectDictionaryEntry getDetectDictionaryEntry() {
		return(detectDictionaryEntry);
	}
	
	/**
	 * Constructor
	 */
	public TermDetector() {
		this.stopwordsImpl = new StopwordsImpl(); // no stopwords by default
		
		this.tokenizerNormalizer = new TokenizerNormalizer(new NormalizerTerm(stopwordsImpl));
		
		HashSet<Synonym> synonyms = new HashSet<Synonym>();
		synonyms.add(abbreviations);
		this.setTokenTree = new SetTokenTree();
		this.detectDictionaryEntry = new DetectDictionaryEntry(setTokenTree,tokenizerNormalizer,synonyms);
	}
	
	/**
	 * 
	 * @return the tokenizer and normalizer
	 */
	public TokenizerNormalizer getTokenizerNormalizer() {
		return(tokenizerNormalizer);
	}

	/**
	 * 
	 * @param word a stopword to add
	 */
	public void addStopwords(String word) {
		this.stopwordsImpl.addStopwords(word);
	}
	
	/**
	 * Add an abbreviation
	 * @param token (ex : 'acide')
	 * @param abbreviation (ex: 'ac')
	 */
	public void addAbbreviations(String token, String abbreviation) {
		String[] tokensArray = getNormalizedTerm(token);
		if (tokensArray.length == 0) {
			String message = "abbreviation: '" + abbreviation + "' was not added because of no word left after stopword removal";
			logger.info(message);
			return;
		}
		abbreviations.addAbbreviation(tokensArray, abbreviation);
	}
	
	/**
	 * Private function to normalize a term
	 * @param term a term to normalize
	 * @return An array of normalized token
	 */
	private String[] getNormalizedTerm(String term) {
		String normalizedTerm = tokenizerNormalizer.normalizeLabel(term);
		if (this.stopwordsImpl.isStopWord(normalizedTerm)) {
			return(new String[]{});
		}
		String[] tokensArray = TokenizerNormalizer.tokenizeAlphaNum(normalizedTerm);
		tokensArray = Loader.removeStopWords(stopwordsImpl, tokensArray);
		if (tokensArray.length == 0) {
			return(new String[]{});
		}
		return(tokensArray);
	}
	
	/**
	 * Add a term of a terminology
	 * @param term the label of a term (it will be normalized)
	 * @param code the code of the term
	 */
	public void addTerm(String term, String code) {
		String normalizedTerm = tokenizerNormalizer.normalizeLabel(term);
		if (tokenizerNormalizer.getNormalizerTerm().isStopWord(normalizedTerm)) {
			String message = "term: '" + term + "' was not added because of no word left after stopword removal";
			logger.info(message);
			return;
		}
		String[] tokensArray = TokenizerNormalizer.tokenizeAlphaNum(normalizedTerm);
		tokensArray = Loader.removeStopWords(stopwordsImpl, tokensArray);
		if (tokensArray.length == 0) {
			String message = "term: '" + term + "' was not added because of no word left after stopword removal";
			logger.info(message);
			return;
		}
		TokenTree tokenTree = new TokenTree(null,tokensArray, code);
		// this.detectDictionaryEntry.getSetTokenTree().addTokenTree(tokenTree);
		this.setTokenTree.addTokenTree(tokenTree);
	}
	
	/**
	 * 
	 * @param sentence textual content to analyze
	 * @return A set of CandidateTerm (CT) detected
	 * @throws UnfoundTokenInSentence 
	 */
	public TreeSet<CTcode> detect(String sentence) throws UnfoundTokenInSentence{
		this.detectDictionaryEntry.detectCandidateTerm(sentence);
		return(this.detectDictionaryEntry.getCTcode());
	}
}
