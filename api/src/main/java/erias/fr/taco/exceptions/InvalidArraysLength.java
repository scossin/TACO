package erias.fr.taco.exceptions;

import org.slf4j.Logger;

import fr.erias.IAMsystem.exceptions.MyExceptions;

public class InvalidArraysLength extends MyExceptions{

	public InvalidArraysLength(Logger logger, int array1Length, int array2Length) {
		super(logger,"Arrays are expected to be the same size : \n " + 
				" first array : " + array1Length + " \n " + 
				"second array : " + array2Length);
	}

}
