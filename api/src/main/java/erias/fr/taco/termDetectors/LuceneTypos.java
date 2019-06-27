package erias.fr.taco.termDetectors;

import java.io.File;
import java.io.IOException;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.HashSet;

import erias.fr.taco.mariadb.MariaDB;
import fr.erias.IAMsystem.detect.LevenshteinTypoLucene;
import fr.erias.IAMsystem.detect.Synonym;
import fr.erias.IAMsystem.load.Loader;
import fr.erias.IAMsystem.lucene.IndexBigramLucene;
import fr.erias.IAMsystem.normalizer.Stopwords;
import fr.erias.IAMsystem.normalizer.StopwordsImpl;
import fr.erias.IAMsystem.tokenizer.TokenizerNormalizer;

/**
 * Detect Typos using the Levenshtein distance implemented in Lucene. It creates a Lucene index. 
 * @author cossin
 *
 */
public class LuceneTypos {

	/**
	 * Create a LuceneTypos instance to add to the detector a way to detect typo (getLevenshteinSynonym)
	 * @param mariaDB MariaDB class to connect and retrieve terms, stopwords...
	 * @throws ClassNotFoundException Driver not found
	 * @throws IOException Can't write to the disk
	 * @throws SQLException SQL errors
	 */
	public LuceneTypos(MariaDB mariaDB) throws ClassNotFoundException, IOException, SQLException {
		createIndex(mariaDB);
	}
	
	/**
	 * Create the index to the disk (inside a docker container)
	 * @param mariaDB MariaDB class to connect and retrieve terms, stopwords...
	 * @throws ClassNotFoundException Driver not found
	 * @throws IOException Can't write to the disk
	 * @throws SQLException SQL errors
	 */
	private void createIndex(MariaDB mariaDB) throws ClassNotFoundException, IOException, SQLException {
		HashMap<String,String> uniqueTokensBigram = this.getUniqueTokenBigram(mariaDB);
		File indexFolder1 = new File(ConfigLucene.INDEX_FOLDER);
		IndexBigramLucene.IndexLuceneUniqueTokensBigram(uniqueTokensBigram, indexFolder1, ConfigLucene.CONCATENATION_FIELD,
				ConfigLucene.BIGRAM_FIELD);
	}
	
	/**
	 * 
	 * @return
	 * @throws IOException Can't write to the disk
	 */
	public Synonym getLevenshteinSynonym() throws IOException {
		File file = new File(ConfigLucene.INDEX_FOLDER);
		LevenshteinTypoLucene levenshteinTypoLucene = new LevenshteinTypoLucene(file,
				ConfigLucene.CONCATENATION_FIELD, ConfigLucene.BIGRAM_FIELD);
		return(levenshteinTypoLucene);
	}
	

	/**
	 * 
	 * @param mariaDB class to connect and retrieve terms, stopwords...
	 * @return
	 * @throws IOException
	 * @throws ClassNotFoundException
	 * @throws SQLException
	 */
	private HashMap<String,String> getUniqueTokenBigram(MariaDB mariaDB) throws IOException, ClassNotFoundException, SQLException{
		HashSet<String> stopwords = mariaDB.getStopwords();
		Stopwords stopwordsImp = new StopwordsImpl();
		for (String stopword : stopwords) {
			stopwordsImp.addStopwords(stopword);
		}
		TokenizerNormalizer tokenizerNormalizer = Loader.getTokenizerNormalizer(stopwordsImp);
		HashMap<String,String> uniqueTokens = new HashMap<String,String>();
		for (String term : mariaDB.getTerms()) {
			String libNormal = tokenizerNormalizer.normalizeLabel(term);
			if (tokenizerNormalizer.getNormalizerTerm().isStopWord(libNormal)) {
				continue;
			}
			String[] tokensArray = TokenizerNormalizer.tokenizeAlphaNum(libNormal);
			tokensArray = Loader.removeStopWords(stopwordsImp, tokensArray);
			for (int i =0; i<(tokensArray.length-1);i++) {
				// as we use a Levenshtein distance, there is no point to concatenate a 1 character token
				// the Levenshtein distance will find a bigram with the first token alone
				// for example "vitamine K", "vitamine" will be matched "vitamine K" with concatenation and lucene distance
				// we want to avoid this situation :
				if (tokensArray[i+1].length() == 1) {
					continue;
				}
				String collapse = tokensArray[i] + tokensArray[i+1];
				String bigram = tokensArray[i] + " " + tokensArray[i+1];
				uniqueTokens.put(collapse, bigram);
			}
			for (String token : tokensArray) {
				uniqueTokens.put(token, token);
			}
		}
		return(uniqueTokens);
	}
	
	public static void main(String[] args) throws IOException, ClassNotFoundException, SQLException {
		MariaDB mariaDB = new MariaDB();
		new LuceneTypos(mariaDB);
	}
}
