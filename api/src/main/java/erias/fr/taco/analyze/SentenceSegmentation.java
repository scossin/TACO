package erias.fr.taco.analyze;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.util.TreeSet;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import erias.fr.taco.exceptions.InvalidArraysLength;
import opennlp.tools.sentdetect.SentenceDetectorME;
import opennlp.tools.sentdetect.SentenceModel;
import opennlp.tools.util.InvalidFormatException;
import opennlp.tools.util.Span;


/**
 * This class is used to segment phrases
 * It uses {@link SentenceDetectorME}
 * @author Cossin Sebastien (cossin.sebastien@gmail.com)
 *
 */

public class SentenceSegmentation {

	final static Logger logger = LoggerFactory.getLogger(SentenceSegmentation.class);
	
	private TreeSet<Sentence> sentences ;
	
	/**
	 * Sentence detection is performed by {@link SentenceDetectorME}
	 */
	private SentenceDetectorME sentenceDetector;
	
	/**
	 * Sentence detection is performed by {@link SentenceDetectorME}
	 * @return an instance of {@link SentenceDetectorME}
	 */
	public SentenceDetectorME getSentenceDetector(){
		return(sentenceDetector);
	}
	
	/**
	 * Constructor ; create an instance of {@link SentenceDetectorME}
	 * @param modelFile To create an instance of {@link SentenceModel} 
	 * @throws InvalidFormatException If the format is 
	 * @throws IOException If the file is not found
	 */
	public SentenceSegmentation(File modelFile) throws InvalidFormatException, IOException{
		  SentenceModel smodel = new SentenceModel(modelFile);
	      sentenceDetector = new SentenceDetectorME(smodel);
	}
	
	/**
	 * Constructor ; create an instance of {@link SentenceDetectorME}
	 * @param in An inputStream to the model File 
	 * @throws InvalidFormatException If the format is 
	 * @throws IOException If the file is not found
	 */
	public SentenceSegmentation(InputStream in) throws InvalidFormatException, IOException{
		  SentenceModel smodel = new SentenceModel(in);
	      sentenceDetector = new SentenceDetectorME(smodel);
	      in.close();
	}
	
	/**
	 * Segment a paragraph into phrases
	 * @param paragraph a paragraph to segment into a set of sentences
	 * @throws InvalidArraysLength If the length of the sentence doesn't match the length of its start and end
	 */
	public void setContent(String paragraph) throws InvalidArraysLength{
		// reinitialize
		this.sentences = new TreeSet<Sentence>();
		
		String[] sents = this.sentenceDetector.sentDetect(paragraph);
		Span[] spans = this.sentenceDetector.sentPosDetect(paragraph);
		
		if (sents.length != spans.length){
			throw new InvalidArraysLength(logger, sents.length, spans.length);
		}
		
		for (int i = 0; i<spans.length;i++){
			int start = spans[i].getStart();
			String content = sents[i];
			Sentence sentence = new Sentence(content,i,start);
			sentences.add(sentence);
		}
	}
	
	/**
	 * 
	 * @return A TreeSet of {@link Sentence} ordered by phraseNumber
	 */
	public TreeSet<Sentence> getSentences() {
		return sentences;
	}
	
}
