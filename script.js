const calculator = document.querySelector(".calculator")
const keys = calculator.querySelector(".calculator__keys")
const display = calculator.querySelector(".calculator__display")
const clear = document.getElementById("clear")
//const clearButton = calculator.querySelector('[data-action=clear]')

const calculate = (n1, n2, op) => {
    console.log("n1: ",n1, " n2: ", n2, " op: ", op)
    const n1_float = parseFloat(n1)
    const n2_float = parseFloat(n2)
    switch(op) {
        case "add": return n1_float + n2_float
        case "subtract": return n1_float - n2_float
        case "multiply": return n1_float * n2_float
        case "divide": return n1_float / n2_float    
    }
}

const getKeyType = action => {
    if (!action) return 'number'
    if (action === 'add' || action === 'subtract' || action === 'multiply' || action === 'divide') return 'operator'
    /* if (action === 'decimal') return 'decimal'
    if (action === 'clear') return 'clear'
    if (action === 'calculate') return 'calculate' 
    como cada action es igual a lo que se deberia retornar :
    */
    return action 
}

const createResultString = (key,displayedNum,calculator, keyType) => {
    const keyContent = key.textContent
    const { previousKeyType, firstValue, operator, modValue } = calculator.dataset
    

    if (keyType === 'number'){
        console.log('number', displayedNum, calculator.dataset)
        return (displayedNum === "0" 
            || previousKeyType === 'operator' 
            || previousKeyType === 'calculate' ) ?
            keyContent :
            displayedNum.concat(keyContent)
    }

    if (keyType === 'decimal') {
        //aca arreglar para que no concatene un . cuando viene de haber apretado un operador o un igual
        //
        if (!displayedNum.includes('.')) return displayedNum.concat('.')
        if (previousKeyType === 'operator' || previousKeyType === 'calculate') return  '0.'
        return displayedNum
    }

    if (keyType === 'operator') {
        return (firstValue 
            && operator 
            && previousKeyType!=='operator' 
            && previousKeyType!=='calculate') 
            ? calculate(firstValue,displayedNum,operator)
            : displayedNum
    }

    if (keyType === 'clear') return 0

    if (keyType === 'calculate') {
        console.log('calculate', firstValue,operator, displayedNum)
        if(firstValue && operator) {
            return (previousKeyType === 'calculate') 
                ? calculate(displayedNum, modValue, operator)
                : calculate(firstValue,displayedNum,operator)
        } else return displayedNum
    } 
}

const updateCalculatorState = (key, calculator, displayedNum,result, keyType) => {
    const modValue = calculator.dataset.modValue
    const previousKeyType = calculator.dataset.previousKeyType
    calculator.dataset.previousKeyType = keyType

    if(keyType === 'number'){
        if(previousKeyType === 'calculate'){
            calculator.dataset.firstValue = ''
        }
    }

    if(keyType === 'operator'){
        calculator.dataset.firstValue = result
        calculator.dataset.operator = key.dataset.action
    }

    if (keyType === 'decimal') {
        if(previousKeyType === 'calculate') {
            calculator.dataset.firstValue = ''
        }
    }

    if (keyType === 'clear') {
        clear.textContent = 'AC'
        calculator.dataset.firstValue = ''
        calculator.dataset.operator = ''
        calculator.dataset.previousKeyType = ''
    }

    if (keyType === 'calculate') {
        calculator.dataset.modValue = (previousKeyType === 'calculate') ? modValue : displayedNum
    }
}

const updateView = (key,keyType) =>{
    
    Array.from(key.parentNode.children).forEach( k => k.classList.remove('is-depressed'))
    
    if(keyType === 'number'){
        clear.textContent = 'CE'
    }
    if(keyType === 'operator'){
        key.classList.add('is-depressed') //para dejar presionado el boton y que el usuario sepa cual eligio
    }
    if (keyType === 'clear') {
        clear.textContent = 'AC'
    }else if (keyType !== 'calculate') {
        clear.textContent = 'CE'
    }
}

keys.addEventListener('click', e => {
    if (e.target.matches('button')) {
        const key = e.target
        const displayedNum = display.textContent
        const keyType = getKeyType (key.dataset.action)
        const result = createResultString(key, displayedNum, calculator, keyType)
        display.textContent = result
        updateCalculatorState(key, calculator,displayedNum, result, keyType)
        updateView(key,keyType)
    }
})