import { useEffect, useRef, useState } from 'react';

enum Operator {
  add = '+',
  subtract = '-',
  multiply = 'x',
  divide = '÷',
}

export const useCalculator = () => {

  const [ formula, setFormula ] = useState( '' );
  const [ number, setNumber ] = useState( '0' );
  const [ prevNumber, setPrevNumber ] = useState( '0' );

  const lastOperation = useRef<Operator>();

  useEffect( () => {
    if ( lastOperation.current ) {
      const firstFormulaPart = formula.split( ' ' ).at( 0 );
      setFormula( `${ firstFormulaPart } ${ lastOperation.current } ${ number }` );
    } else {
      setFormula( number );
    }

  }, [ number ] );

  useEffect(() => {
    const subResult = calculateSubResult();
    setPrevNumber( `${ subResult }`);    
  }, [formula])

  // Borrar todo
  const clean = () => {
    setNumber( '0' );
    setPrevNumber('0');
    setFormula('');
    lastOperation.current = undefined;
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
    calculateResult();
    
    if ( number.endsWith( '.' ) ) {
      setPrevNumber( number.slice( 0, -1 ) );
    } else {
      setPrevNumber( number );
    }

    setNumber( '0' );
  };

  const divideOperation = () => {
    setLastNumber();
    lastOperation.current = Operator.divide;
  };

  const multiplyOperation = () => {
    setLastNumber();
    lastOperation.current = Operator.multiply;
  };

  const subtractOperation = () => {
    setLastNumber();
    lastOperation.current = Operator.subtract;
  };

  const addOperation = () => {
    setLastNumber();
    lastOperation.current = Operator.add;
  };

  const calculateResult = () => {

    const result = calculateSubResult();
    setFormula( `${ result }` );

    lastOperation.current = undefined;
    setPrevNumber( '0' );
  };

  const calculateSubResult = (): number => {

    const [ firstValue, operation, secondValue ] = formula.split( ' ' );

    const num1 = Number( firstValue );
    const num2 = Number( secondValue ); //NaN

    if ( isNaN( num2 ) ) return num1;

    switch ( operation ) {

      case Operator.add:
        return num1 + num2;

      case Operator.subtract:
        return num1 - num2;

      case Operator.multiply:
        return num1 * num2;

      case Operator.divide:
        return num1 / num2;

      default:
        throw new Error( 'Operation not implemented' );
    }

  };

  return {
    // Properties
    number,
    prevNumber,
    formula,

    // Methods
    buildNumber,
    toggleSign,
    clean,
    deleteOperation,
    divideOperation,
    multiplyOperation,
    subtractOperation,
    addOperation,
    calculateResult
  };
}

