package erias.fr.taco.analyze;

import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * A representation of a sentence
 * @author cossin
 *
 */
public class Sentence implements Comparable<Sentence> {
	
	final static Logger logger = LoggerFactory.getLogger(Sentence.class);
	
	/**
	 * the sentence
	 */
	private String content = null;
	
	/**
	 * the phrase number after segmentation
	 */
	
	private int phraseNumber ;
	
	/**
	 * start 
	 */
	private int start;
	
	/**
	 * end of the phrase 
	 */
	private int end;
	
	/**
	 * Create a new sentence
	 * @param content the sentence content
	 * @param phraseNumber the phrase number
	 * @param start the start offset
	 */
	public Sentence(String content, int phraseNumber, int start) {
		this.content = content;
		this.phraseNumber = phraseNumber;
		this.start = start;
		this.end = this.start + content.length() - 1; // as Java uses zero-based indexing;
	}
	
	/**
	 * Get a JSON representation of a phrase
	 * @return a JSON representation of a phrase (start,end,content, phraseNumber)
	 */
	public JSONObject getJSONrepresentation() {
		JSONObject outputObject = new JSONObject();
		outputObject.put("start", start);
		outputObject.put("end", end);
		outputObject.put("content", content);
		outputObject.put("phraseNumber", phraseNumber);
		return outputObject;
	}
	
	/**
	 * 
	 * @return the sentence content
	 */
	public String getContent() {
		return content;
	}

	/**
	 * 
	 * @return the sentence number in a paragraph after segmentation 
	 */
	public int getPhraseNumber() {
		return phraseNumber;
	}

	/**
	 * 
	 * @return the offsetStart
	 */
	public int getStart() {
		return start;
	}
	
	/**
	 * 
	 * @return the offset end (= start + content length)
	 */
	public int getEnd() {
		return end;
	}

	@Override
	public int compareTo(Sentence sentence2) {
		return this.phraseNumber - sentence2.getPhraseNumber();
	}
}
