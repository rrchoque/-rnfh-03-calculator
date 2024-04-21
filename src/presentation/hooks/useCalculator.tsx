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

  const setLastNumber = () => {

    if ( number.endsWith( '.' ) ) {
      setPrevNumber( number.slice( 0, -1 ) );
    } else {
      setPrevNumber( number );
    }

    setNumber( '0' );
  }

  const calculateLastOperation = () => {
    if (lastOperation.current != undefined) {
      const result = calculateResult()
      setPrevNumber(result)
      setNumber('0')
    } else {
      setLastNumber();
    }
  }

  const divideOperation = () => {
    calculateLastOperation();
    lastOperation.current = Operator.divide;
  }

  const multiplyOperation = () => {
    calculateLastOperation();
    lastOperation.current = Operator.multiply;
  }

  const subtractOperation = () => {
    calculateLastOperation();
    lastOperation.current = Operator.subtract;
  }

  const addOperation = () => {
    calculateLastOperation();
    lastOperation.current = Operator.add;
  }

  const calculateResult = () => {
      
    const num1 = Number( number ); //NaN
    const num2 = Number( prevNumber ); //NaN

    switch( lastOperation.current ) {
      
      case Operator.add:
        lastOperation.current = undefined
        return ( `${ num2 + num1 }` );
        break;

      case Operator.subtract:
        lastOperation.current = undefined
        return ( `${ num2 - num1 }` );
        break;

      case Operator.multiply:
        lastOperation.current = undefined
        return ( `${ num2 * num1 }` );
        break;

      case Operator.divide:
        lastOperation.current = undefined
        return ( `${ num2 / num1 }` );
        break;

      default:
        lastOperation.current = undefined
        throw new Error('Operation not implemented');
    }

    //setPrevNumber('0');
    
  }

  const calculateOperation = () =>{
    const result = calculateResult()
    setNumber(result)
    setPrevNumber('0');
  }

  return {
    // Properties
    number,
    prevNumber,

    // Methods
    buildNumber,
    toggleSign,
    clean,
    deleteOperation,
    divideOperation,
    multiplyOperation,
    subtractOperation,
    addOperation,
    calculateOperation
  };
}

