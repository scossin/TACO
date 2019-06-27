package erias.fr.taco.analyze;

import java.util.TreeSet;

import org.json.JSONObject;

import fr.erias.IAMsystem.ct.CTcode;

public interface DetectionHandler<D extends Document> {
	
	/**
	 * 
	 * @param sentence the sentence
	 * @param cts terms detected in the sentence. {@link CTcode}
	 * @param document A document containing the sentence to retrieve metadata (localisation...)
	 */
	public void handleDetection(String sentence, TreeSet<CTcode> cts, D document);
	
	/**
	 * Get a JSON representation of the signals detected to be displayed on the interface. 
	 * @param sentence the sentence
	 * @param cts terms detected in the sentence. {@link CTcode}
	 * @return
	 */
	public JSONObject testDetection(String sentence, TreeSet<CTcode> cts);
}
