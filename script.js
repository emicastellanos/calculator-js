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
        case "add": 
            return n1_float + n2_float
        case "subtract":
            return n1_float - n2_float
        case "multiply":
            return n1_float * n2_float
        case "divide":
            return n1_float / n2_float    
    }
}

keys.addEventListener('click', e => {
 if (e.target.matches('button')) {
     const key = e.target // e.target va a ser el boton
     const action = key.dataset.action //se usa para obtener el data-action="add"> del elemento html, los numeros no tienen data-action definido => si es null es un numero
     const keyContent = key.textContent //textcontent es el contenido del elemento html (un 7 o un + o lo que sea)
     const displayedNum = display.textContent //display es el div que tiene inicialmente un 0, al que podemos acceder usando textContent
     const previousKeyType = calculator.dataset.previousKeyType
     if(!action){
         console.log('NUMBER')
         console.log ('prev', previousKeyType, 'n1',calculator.dataset.firstValue , 'n2', calculator.dataset.secondValue, 'previousKeyType', previousKeyType, 'op',calculator.dataset.operator)
         if(displayedNum === "0" || previousKeyType === 'operator' || previousKeyType === 'calculate' ){
            display.textContent = keyContent
            Array.from(key.parentNode.children).forEach( k => k.classList.remove('is-depressed'))
            if(previousKeyType === 'calculate'){
                calculator.dataset.firstValue = ''
            }
         } else{
             display.textContent = displayedNum.concat(keyContent)
         }
         calculator.dataset.previousKeyType = 'number'
         clear.textContent = 'CE'
         
     } else {
         if( action === 'add' || action === 'subtract' || action === 'multiply' || action === 'divide') {
             console.log('OPERATOR')
             console.log ('prev', previousKeyType, 'n1',calculator.dataset.firstValue , 'n2', calculator.dataset.secondValue, 'previousKeyType', previousKeyType, 'op',calculator.dataset.operator)
             const firstValue = calculator.dataset.firstValue
             const secondValue = displayedNum
             const operator = calculator.dataset.operator
             if (firstValue && secondValue && operator && previousKeyType!=='operator' && previousKeyType!=='calculate'){
                 display.textContent = calculate(firstValue,secondValue,operator)
                 calculator.dataset.firstValue = display.textContent
             } else {
                 calculator.dataset.firstValue = displayedNum                 
             }

             if(previousKeyType === 'operator'){
                 Array.from(key.parentNode.children).forEach( k => k.classList.remove('is-depressed'))
             }

             key.classList.add('is-depressed') //para dejar presionado el boton y que el usuario sepa cual eligio
             calculator.dataset.operator = action
             calculator.dataset.previousKeyType = 'operator'
         } else {
            Array.from(key.parentNode.children).forEach( k => k.classList.remove('is-depressed'))
         }
         if (action === 'decimal') {
             if(!displayedNum.includes('.')){
                 if(displayedNum === "0" || previousKeyType === 'operator' || previousKeyType === 'calculate'){
                     display.textContent = '0.'
                     if(previousKeyType === 'calculate') {
                         calculator.dataset.firstValue = ''
                     }
                 }else{
                     display.textContent = displayedNum.concat('.')
                 }
             }
             calculator.dataset.previousKeyType = 'decimal'
         }
         if (action === 'clear') {
            display.textContent = 0
            calculator.dataset.firstValue = ''
            calculator.dataset.operator = ''
            calculator.dataset.previousKeyType = ''
            clear.textContent = 'AC'
         } else if (action !== 'calculate') {
            clear.textContent = 'CE'
         }

         if (action === 'calculate') {
            console.log('CALCULATE')
            let firstValue = calculator.dataset.firstValue
            let secondValue = displayedNum
            const operator = calculator.dataset.operator
            if(firstValue && operator) {
                if (previousKeyType === 'calculate'){
                    firstValue = displayedNum
                    secondValue = calculator.dataset.modValue
                }
                display.textContent = calculate(firstValue,secondValue,operator)
            }
            calculator.dataset.modValue = secondValue
            calculator.dataset.previousKeyType = 'calculate'
         }
     }

 }
})

