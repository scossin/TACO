package unit;

import static org.junit.Assert.assertTrue;

import java.io.IOException;
import java.sql.SQLException;
import org.junit.Test;
import erias.fr.taco.mariadb.MariaDB;
import erias.fr.taco.termDetectors.TermDetectorMariaDB;
import fr.erias.IAMsystem.detect.TermDetector;
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
		assertTrue(termDetector.detect("concentrés de GR").getCTcodes().size() == 1);
		assertTrue(termDetector.detect("CGR").getCTcodes().size() == 1);
		assertTrue(termDetector.detect("oedeme aigu pulmonaire").getCTcodes().size() == 1);
		assertTrue(termDetector.detect("oedeme du poumon").getCTcodes().size() == 1);
		assertTrue(termDetector.detect("œdème post-transfusionnel").getCTcodes().size() == 1);
		assertTrue(termDetector.detect("dyspnée").getCTcodes().size() == 1);
		assertTrue(termDetector.detect("concentre de globules rougess").getCTcodes().size() == 1);
    }
}
