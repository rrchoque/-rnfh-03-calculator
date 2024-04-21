import { useRef, useState } from 'react';

enum Operator {
  add,
  subtract,
  multiply,
  divide,
}

export const useCalculator = () => {

  const [ number, setNumber ] = useState( '0' );
  const [ prevNumber, setPrevNumber ] = useState( '0' );

  const lastOperation = useRef<Operator>();

  // Borrar todo
  const clean = () => {
    setNumber( '0' );
    setPrevNumber('0');
  };

  // Borrar el último número
  const deleteOperation = () => {

    let currentSign = '';
    let temporalNumber = number;

    if ( number.includes( '-' ) ) {
      currentSign = '-';
      temporalNumber = number.substring( 1 ); // 88
    }

    if ( temporalNumber.length > 1 ) {
      return setNumber( currentSign + temporalNumber.slice( 0, -1 ) ); // 
    }

    setNumber( '0' );

  };


  const toggleSign = () => {
    if ( number.includes( '-' ) ) {
      return setNumber( number.replace( '-', '' ) );
    }

    setNumber( '-' + number );
  };


  const buildNumber = ( numberString: string ) => {

    if ( number.includes( '.' ) && numberString === '.' ) return;

    if ( number.startsWith( '0' ) || number.startsWith( '-0' ) ) {

      // Evaluar si es otro cero y no hay punto
      if ( numberString === '0' && number === '0' ) return;

      // Evitar 000000.00
      if ( numberString === '0' && !number.includes( '.' ) ) {
        return;
      }

      // Evaluar si es diferente de cero, y es el primer número
      if ( number === '0' && numberString !== '0' && numberString !== '.') {
        return setNumber( numberString );
      }

    }

    setNumber( number + numberString );

  };

 

  return {
    // Properties
    number,
    prevNumber,

    // Methods
    buildNumber,
    toggleSign,
    clean,
    deleteOperation,
  };
}

