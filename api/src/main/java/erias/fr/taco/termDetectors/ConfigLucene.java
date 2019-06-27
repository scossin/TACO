package erias.fr.taco.termDetectors;

public class ConfigLucene {

	/**
	 * the name of the folder
	 */
	public static final String INDEX_FOLDER = "indexLucene";
	
	/**
	 * the field in the Lucene index contaning concatenation (concentres globules => concentresglobules)
	 */
	public static final String CONCATENATION_FIELD = "concatenation";
	
	/**
	 * The field in the Lucene index containing the original form of the term
	 */
	public static final String BIGRAM_FIELD = "bigram";

}
