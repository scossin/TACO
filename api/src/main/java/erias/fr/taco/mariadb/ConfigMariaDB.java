package erias.fr.taco.mariadb;

import java.io.IOException;
import java.net.InetAddress;
import java.net.InetSocketAddress;
import java.net.Socket;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import fr.erias.IAMsystem.exceptions.MyExceptions;


/**
 * Configuration of MariaDB 
 * @author cossin
 *
 */
public class ConfigMariaDB {
	final static Logger logger = LoggerFactory.getLogger(ConfigMariaDB.class);

	/**
	 * Hard coded user, password, timezone and database
	 */
	public static String HOST ;
	public static int PORT = 3307;
	public static String USER = "hemovigilants";
	public static String PASSWORD = "hemovigilantspwd";
	public static String TIMEZONE = "utc";
	public static String DATABASE = "TACO";

	public static String getURL() {
		return("jdbc:mariadb://" + HOST + ":" + PORT + "/" + DATABASE);
	}

	/**
	 * Try to discover the IP host inside a docker using docker-compose
	 */
	static {
		// environment
		String user = System.getenv("USER_MARIADB");
		if (!(user == null)) {
			USER = user;
		}
		
		String pwd = System.getenv("USERPWD_MARIADB");
		if (!(pwd == null)) {
			PASSWORD = pwd;
		}

		// environment
		String host = System.getenv("HOST_MARIADB");
		if (!(host == null)) {
			HOST = host;
		}
		
		// docker
		if (HOST == null) {
			setDockerEndpoint();
		}
		
		// localhost
		if (HOST == null) {
			localhostEndpoint();
		}

		if (HOST == null) {
			String msg = "Can't connect to a mariadb";
			MyExceptions.logMessage(logger, msg);
			throw new NullPointerException(msg);
		}
	}

	/**
	 * case the programs is inside a tomcat container (docker) with docker-compose 
	 */
	private static void setDockerEndpoint() {
		logger.info("Checking the existence of a mariadbtaco docker container...");
		
		String hostname = System.getenv("MARIADB_NAME");
		String port = System.getenv("MARIADB_PORT");
		if (hostname == null) {
			return;
		}
		boolean reachable = false;
		try {
			reachable = InetAddress.getByName(hostname).isReachable(1000);
		} catch (IOException e) {
			logger.info("fail to connect to a docker container");
		}
		if (reachable) {
			HOST = hostname;
			PORT = Integer.valueOf(port);
		}
	}

	/**
	 * case in eclipse for development
	 */
	private static void localhostEndpoint() {
		logger.info("Checking the existence of a mariadb application at port " + PORT);
		boolean reachable = false;
		reachable = pingHost("localhost",PORT,1000);
		if (reachable) {
			HOST = "localhost";
		} else {
			logger.info("Can't find a mariadb application at port " + PORT);
		}
	}
	
	private static boolean pingHost(String host, int port, int timeout) {
		try (Socket socket = new Socket()) {
			socket.connect(new InetSocketAddress(host, port), timeout);
			return true;
		} catch (IOException e) {
			return false; // Either timeout or unreachable or failed DNS lookup.
		}
	}
}




