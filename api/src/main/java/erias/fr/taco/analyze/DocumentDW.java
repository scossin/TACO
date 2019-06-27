package erias.fr.taco.analyze;


/**
 * A minimal representation of a document : <ul>
 * <li> txt : the textual content
 * <li> npat : patient number
 * <li> nsej: sejour (encounter) number
 * <li> date: date of the document in the format YYYY-mm-dd (ex : 2010-01-20)
 * <li> loc: localisation of the document in the EHR
 * Only the txt is processed. npat, nsej, date and loc go directly to the database if a signal is detected in txt
 * </ul>
 * DW stands for DataWarehouse
 * @author cossin
 *
 */

public class DocumentDW extends Document {

	private String txt;

	private String npat;

	private String nsej;

	private String date;

	private String loc;

	@Override
	public String getTxt() {
		// TODO Auto-generated method stub
		return txt;
	}

	/**
	 * 
	 * @param txt the textual content
	 * @param npat patient number
	 * @param nsej sejour (encounter) number
	 * @param date date of the document in the format YYYY-mm-dd (ex : 2010-01-20)
	 * @param loc  localisation of the document in the EHR
	 */
	public DocumentDW(String txt, String npat, String nsej, String date, String loc) {
		this.txt = txt;
		this.npat = npat;
		this.nsej = nsej ;
		this.date = date;
		this.loc = loc;
	}

	public String getLoc() {
		return loc;
	}

	public void setLoc(String loc) {
		this.loc = loc;
	}

	public String getDate() {
		return date;
	}

	public void setDate(String date) {
		this.date = date;
	}

	public String getNsej() {
		return nsej;
	}

	public String getNpat() {
		return npat;
	}
}
