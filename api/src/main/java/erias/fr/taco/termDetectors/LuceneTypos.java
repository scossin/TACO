package erias.fr.taco.termDetectors;

import java.io.File;
import java.io.IOException;
import java.sql.SQLException;

import fr.erias.IAMsystem.lucene.IndexBigramLucene;
import fr.erias.IAMsystem.synonym.ISynonym;
import fr.erias.IAMsystem.synonym.LevenshteinTypoLucene;
import fr.erias.IAMsystem.terminology.Terminology;
import fr.erias.IAMsystem.tokenizernormalizer.ITokenizerNormalizer;

/**
 * Detect Typos using the Levenshtein distance implemented in Lucene. It creates a Lucene index. 
 * @author cossin
 *
 */
public class LuceneTypos {

	public LuceneTypos(Terminology terminology, ITokenizerNormalizer tokenizerNormalizer) throws ClassNotFoundException, IOException, SQLException {
		createIndex(terminology, tokenizerNormalizer);
	}

	/**
	 * Create the index to the disk (inside a docker container)
	 * @param mariaDB MariaDB class to connect and retrieve terms, stopwords...
	 * @throws ClassNotFoundException Driver not found
	 * @throws IOException Can't write to the disk
	 * @throws SQLException SQL errors
	 */
	private void createIndex(Terminology terminology, ITokenizerNormalizer tokenizerNormalizer) throws ClassNotFoundException, IOException, SQLException {
		File indexFolder1 = new File(ConfigLucene.INDEX_FOLDER);
		IndexBigramLucene.IndexLuceneUniqueTokensBigram(terminology, tokenizerNormalizer, indexFolder1);
	}
	
	/**
	 * 
	 * @return
	 * @throws IOException Can't write to the disk
	 */
	public ISynonym getLevenshteinSynonym() throws IOException {
		File file = new File(ConfigLucene.INDEX_FOLDER);
		LevenshteinTypoLucene levenshteinTypoLucene = new LevenshteinTypoLucene(file);
		return(levenshteinTypoLucene);
	}
	
}
