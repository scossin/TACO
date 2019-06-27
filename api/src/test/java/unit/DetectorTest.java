package unit;

import static org.junit.Assert.assertTrue;

import java.io.IOException;
import java.sql.SQLException;

import org.junit.Test;

import erias.fr.taco.mariadb.MariaDB;
import erias.fr.taco.termDetectors.TermDetector;
import erias.fr.taco.termDetectors.TermDetectorMariaDB;
import fr.erias.IAMsystem.exceptions.UnfoundTokenInSentence;

/**
 * Unit test for simple App.
 */
public class DetectorTest {

    /**
     * @throws SQLException 
     * @throws ClassNotFoundException 
     * @throws UnfoundTokenInSentence 
     * @throws IOException 
     */
	@Test
    public void detectorTest() throws ClassNotFoundException, SQLException, UnfoundTokenInSentence, IOException {
    	
		MariaDB mariaDB = new MariaDB();
		mariaDB.checkConnection();
		
		
		TermDetectorMariaDB termDetectorMariaDB = new TermDetectorMariaDB(mariaDB);
		TermDetector termDetector = termDetectorMariaDB.getTermDetector();
		
		assertTrue(termDetector.detect("concentrés de GR").size() == 1);
		assertTrue(termDetector.detect("CGR").size() == 1);
		assertTrue(termDetector.detect("oedeme aigu pulmonaire").size() == 1);
		assertTrue(termDetector.detect("oedeme du poumon").size() == 1);
		assertTrue(termDetector.detect("œdème post-transfusionnel").size() == 1);
		assertTrue(termDetector.detect("dyspnée").size() == 1);
		
		assertTrue(termDetector.detect("concentre de globules rougess").size() == 1);
    }
}
