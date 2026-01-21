// Global variables for basic calculator
let currentInput = '0';
let previousInput = '';
let operator = '';
let waitingForNewNumber = false;

// Global variables for scientific calculator
let currentInputSci = '0';
let previousInputSci = '';
let operatorSci = '';
let waitingForNewNumberSci = false;

// Unit conversion data
const unitData = {
    length: {
        name: 'Dužina',
        units: {
            'm': { name: 'Metar', factor: 1 },
            'cm': { name: 'Centimetar', factor: 0.01 },
            'mm': { name: 'Milimetar', factor: 0.001 },
            'km': { name: 'Kilometar', factor: 1000 },
            'in': { name: 'Inč', factor: 0.0254 },
            'ft': { name: 'Stopa', factor: 0.3048 },
            'yd': { name: 'Jard', factor: 0.9144 },
            'mi': { name: 'Milja', factor: 1609.344 }
        }
    },
    weight: {
        name: 'Težina',
        units: {
            'kg': { name: 'Kilogram', factor: 1 },
            'g': { name: 'Gram', factor: 0.001 },
            'mg': { name: 'Miligram', factor: 0.000001 },
            't': { name: 'Tona', factor: 1000 },
            'lb': { name: 'Funta', factor: 0.453592 },
            'oz': { name: 'Unca', factor: 0.0283495 }
        }
    },
    temperature: {
        name: 'Temperatura',
        units: {
            'C': { name: 'Celzijus' },
            'F': { name: 'Fahrenheit' },
            'K': { name: 'Kelvin' }
        }
    },
    area: {
        name: 'Površina',
        units: {
            'm2': { name: 'Kvadratni metar', factor: 1 },
            'cm2': { name: 'Kvadratni centimetar', factor: 0.0001 },
            'mm2': { name: 'Kvadratni milimetar', factor: 0.000001 },
            'km2': { name: 'Kvadratni kilometar', factor: 1000000 },
            'ha': { name: 'Hektar', factor: 10000 },
            'ft2': { name: 'Kvadratna stopa', factor: 0.092903 },
            'in2': { name: 'Kvadratni inč', factor: 0.00064516 }
        }
    },
    volume: {
        name: 'Zapremina',
        units: {
            'l': { name: 'Litar', factor: 1 },
            'ml': { name: 'Mililitar', factor: 0.001 },
            'm3': { name: 'Kubni metar', factor: 1000 },
            'cm3': { name: 'Kubni centimetar', factor: 0.001 },
            'gal': { name: 'Galon', factor: 3.78541 },
            'qt': { name: 'Kvart', factor: 0.946353 },
            'pt': { name: 'Pinta', factor: 0.473176 },
            'cup': { name: 'Šolja', factor: 0.236588 }
        }
    }
};

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeCalculator();
    initializeConverter();
});

// Navigation between calculators
document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        const calculatorType = this.dataset.calculator;
        switchCalculator(calculatorType);
    });
});

function switchCalculator(type) {
    // Update navigation buttons
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-calculator="${type}"]`).classList.add('active');

    // Update calculator sections
    document.querySelectorAll('.calculator-section').forEach(section => {
        section.classList.remove('active');
    });
    document.getElementById(`${type}-calculator`).classList.add('active');
}

function initializeCalculator() {
    updateDisplay();
    updateDisplaySci();
}

// ===== BASIC CALCULATOR FUNCTIONS =====

function updateDisplay() {
    document.getElementById('display').textContent = currentInput;
    if (previousInput && operator) {
        document.getElementById('history').textContent = `${previousInput} ${operator}`;
    } else {
        document.getElementById('history').textContent = '';
    }
}

function inputNumber(num) {
    if (waitingForNewNumber) {
        currentInput = num;
        waitingForNewNumber = false;
    } else {
        currentInput = currentInput === '0' ? num : currentInput + num;
    }
    updateDisplay();
}

function inputDecimal() {
    if (waitingForNewNumber) {
        currentInput = '0.';
        waitingForNewNumber = false;
    } else if (currentInput.indexOf('.') === -1) {
        currentInput += '.';
    }
    updateDisplay();
}

function operate(op) {
    if (previousInput && operator && !waitingForNewNumber) {
        calculate();
    }
    
    operator = op;
    previousInput = currentInput;
    waitingForNewNumber = true;
    updateDisplay();
}

function calculate() {
    if (!previousInput || !operator) return;
    
    const prev = parseFloat(previousInput);
    const current = parseFloat(currentInput);
    let result;
    
    switch (operator) {
        case '+':
            result = prev + current;
            break;
        case '-':
            result = prev - current;
            break;
        case '*':
            result = prev * current;
            break;
        case '/':
            if (current === 0) {
                alert('Deljenje nulom nije dozvoljeno!');
                return;
            }
            result = prev / current;
            break;
        default:
            return;
    }
    
    currentInput = result.toString();
    operator = '';
    previousInput = '';
    waitingForNewNumber = true;
    updateDisplay();
}

function clearAll() {
    currentInput = '0';
    previousInput = '';
    operator = '';
    waitingForNewNumber = false;
    updateDisplay();
}

function clearEntry() {
    currentInput = '0';
    updateDisplay();
}

function deleteLast() {
    if (currentInput.length > 1) {
        currentInput = currentInput.slice(0, -1);
    } else {
        currentInput = '0';
    }
    updateDisplay();
}

// ===== SCIENTIFIC CALCULATOR FUNCTIONS =====

function updateDisplaySci() {
    document.getElementById('sci-display').textContent = currentInputSci;
    if (previousInputSci && operatorSci) {
        document.getElementById('sci-history').textContent = `${previousInputSci} ${operatorSci}`;
    } else {
        document.getElementById('sci-history').textContent = '';
    }
}

function inputNumberSci(num) {
    if (waitingForNewNumberSci) {
        currentInputSci = num;
        waitingForNewNumberSci = false;
    } else {
        currentInputSci = currentInputSci === '0' ? num : currentInputSci + num;
    }
    updateDisplaySci();
}

function inputDecimalSci() {
    if (waitingForNewNumberSci) {
        currentInputSci = '0.';
        waitingForNewNumberSci = false;
    } else if (currentInputSci.indexOf('.') === -1) {
        currentInputSci += '.';
    }
    updateDisplaySci();
}

function operateSci(op) {
    if (previousInputSci && operatorSci && !waitingForNewNumberSci) {
        calculateSci();
    }
    
    operatorSci = op;
    previousInputSci = currentInputSci;
    waitingForNewNumberSci = true;
    updateDisplaySci();
}

function calculateSci() {
    if (!previousInputSci || !operatorSci) return;
    
    const prev = parseFloat(previousInputSci);
    const current = parseFloat(currentInputSci);
    let result;
    
    switch (operatorSci) {
        case '+':
            result = prev + current;
            break;
        case '-':
            result = prev - current;
            break;
        case '*':
            result = prev * current;
            break;
        case '/':
            if (current === 0) {
                alert('Deljenje nulom nije dozvoljeno!');
                return;
            }
            result = prev / current;
            break;
        default:
            return;
    }
    
    currentInputSci = result.toString();
    operatorSci = '';
    previousInputSci = '';
    waitingForNewNumberSci = true;
    updateDisplaySci();
}

function scientificFunction(func) {
    const current = parseFloat(currentInputSci);
    let result;
    
    switch (func) {
        case 'sin':
            result = Math.sin(current * Math.PI / 180);
            break;
        case 'cos':
            result = Math.cos(current * Math.PI / 180);
            break;
        case 'tan':
            result = Math.tan(current * Math.PI / 180);
            break;
        case 'log':
            if (current <= 0) {
                alert('Logaritam mora biti pozitivan broj!');
                return;
            }
            result = Math.log10(current);
            break;
        case 'ln':
            if (current <= 0) {
                alert('Prirodni logaritam mora biti pozitivan broj!');
                return;
            }
            result = Math.log(current);
            break;
        case 'sqrt':
            if (current < 0) {
                alert('Kvadratni koren negativnog broja nije realan!');
                return;
            }
            result = Math.sqrt(current);
            break;
        case 'power2':
            result = current * current;
            break;
        case 'factorial':
            if (current < 0 || !Number.isInteger(current)) {
                alert('Faktorijel mora biti prirodan broj!');
                return;
            }
            result = factorial(current);
            break;
        default:
            return;
    }
    
    currentInputSci = result.toString();
    waitingForNewNumberSci = true;
    updateDisplaySci();
}

function factorial(n) {
    if (n === 0 || n === 1) return 1;
    let result = 1;
    for (let i = 2; i <= n; i++) {
        result *= i;
    }
    return result;
}

function clearAllSci() {
    currentInputSci = '0';
    previousInputSci = '';
    operatorSci = '';
    waitingForNewNumberSci = false;
    updateDisplaySci();
}

function clearEntrySci() {
    currentInputSci = '0';
    updateDisplaySci();
}

function deleteLastSci() {
    if (currentInputSci.length > 1) {
        currentInputSci = currentInputSci.slice(0, -1);
    } else {
        currentInputSci = '0';
    }
    updateDisplaySci();
}

// ===== UNIT CONVERTER FUNCTIONS =====

function initializeConverter() {
    changeConverterType();
}

function changeConverterType() {
    const type = document.getElementById('converter-type').value;
    const fromUnit = document.getElementById('from-unit');
    const toUnit = document.getElementById('to-unit');
    
    // Clear existing options
    fromUnit.innerHTML = '';
    toUnit.innerHTML = '';
    
    // Populate units
    const units = unitData[type].units;
    Object.keys(units).forEach(key => {
        const option1 = new Option(units[key].name, key);
        const option2 = new Option(units[key].name, key);
        fromUnit.add(option1);
        toUnit.add(option2);
    });
    
    // Set default selections
    if (Object.keys(units).length > 1) {
        toUnit.selectedIndex = 1;
    }
    
    convert();
}

function convert() {
    const type = document.getElementById('converter-type').value;
    const fromValue = parseFloat(document.getElementById('from-value').value) || 0;
    const fromUnit = document.getElementById('from-unit').value;
    const toUnit = document.getElementById('to-unit').value;
    
    let result;
    
    if (type === 'temperature') {
        result = convertTemperature(fromValue, fromUnit, toUnit);
    } else {
        const units = unitData[type].units;
        const fromFactor = units[fromUnit].factor;
        const toFactor = units[toUnit].factor;
        result = (fromValue * fromFactor) / toFactor;
    }
    
    document.getElementById('to-value').value = result.toFixed(6).replace(/\.?0+$/, '');
}

function convertTemperature(value, from, to) {
    let celsius;
    
    // Convert to Celsius first
    switch (from) {
        case 'C':
            celsius = value;
            break;
        case 'F':
            celsius = (value - 32) * 5/9;
            break;
        case 'K':
            celsius = value - 273.15;
            break;
    }
    
    // Convert from Celsius to target
    switch (to) {
        case 'C':
            return celsius;
        case 'F':
            return celsius * 9/5 + 32;
        case 'K':
            return celsius + 273.15;
    }
}

// ===== FINANCIAL CALCULATOR FUNCTIONS =====

function showFinancialTab(tab) {
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelectorAll('.financial-tab').forEach(tabEl => {
        tabEl.classList.remove('active');
    });
    
    event.target.classList.add('active');
    document.getElementById(`${tab}-calc`).classList.add('active');
}

function calculateLoan() {
    const amount = parseFloat(document.getElementById('loan-amount').value);
    const rate = parseFloat(document.getElementById('loan-rate').value) / 100 / 12;
    const years = parseFloat(document.getElementById('loan-years').value);
    const months = years * 12;
    
    if (!amount || !rate || !years) {
        alert('Molimo unesite sve potrebne vrednosti!');
        return;
    }
    
    const monthlyPayment = (amount * rate * Math.pow(1 + rate, months)) / (Math.pow(1 + rate, months) - 1);
    const totalPayment = monthlyPayment * months;
    const totalInterest = totalPayment - amount;
    
    document.getElementById('loan-result').innerHTML = `
        <h5>Rezultat kalkulacije kredita:</h5>
        <p><strong>Mesečna rata:</strong> <span class="highlight">${monthlyPayment.toLocaleString('sr-RS')} RSD</span></p>
        <p><strong>Ukupan iznos:</strong> ${totalPayment.toLocaleString('sr-RS')} RSD</p>
        <p><strong>Ukupna kamata:</strong> ${totalInterest.toLocaleString('sr-RS')} RSD</p>
    `;
}

function calculateCompound() {
    const principal = parseFloat(document.getElementById('compound-principal').value);
    const rate = parseFloat(document.getElementById('compound-rate').value) / 100;
    const years = parseFloat(document.getElementById('compound-years').value);
    const frequency = parseFloat(document.getElementById('compound-frequency').value);
    
    if (!principal || !rate || !years || !frequency) {
        alert('Molimo unesite sve potrebne vrednosti!');
        return;
    }
    
    const amount = principal * Math.pow(1 + rate / frequency, frequency * years);
    const interest = amount - principal;
    
    document.getElementById('compound-result').innerHTML = `
        <h5>Rezultat složene kamate:</h5>
        <p><strong>Početni iznos:</strong> ${principal.toLocaleString('sr-RS')} RSD</p>
        <p><strong>Konačni iznos:</strong> <span class="highlight">${amount.toLocaleString('sr-RS')} RSD</span></p>
        <p><strong>Zarada:</strong> ${interest.toLocaleString('sr-RS')} RSD</p>
        <p><strong>Procenat rasta:</strong> ${((interest / principal) * 100).toFixed(2)}%</p>
    `;
}

function calculateSimple() {
    const principal = parseFloat(document.getElementById('simple-principal').value);
    const rate = parseFloat(document.getElementById('simple-rate').value) / 100;
    const years = parseFloat(document.getElementById('simple-years').value);
    
    if (!principal || !rate || !years) {
        alert('Molimo unesite sve potrebne vrednosti!');
        return;
    }
    
    const interest = principal * rate * years;
    const amount = principal + interest;
    
    document.getElementById('simple-result').innerHTML = `
        <h5>Rezultat jednostavne kamate:</h5>
        <p><strong>Početni iznos:</strong> ${principal.toLocaleString('sr-RS')} RSD</p>
        <p><strong>Konačni iznos:</strong> <span class="highlight">${amount.toLocaleString('sr-RS')} RSD</span></p>
        <p><strong>Kamata:</strong> ${interest.toLocaleString('sr-RS')} RSD</p>
    `;
}

// ===== GEOMETRY CALCULATOR FUNCTIONS =====

function showGeometryTab(tab) {
    document.querySelectorAll('.geometry-tabs .tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelectorAll('.geometry-tab').forEach(tabEl => {
        tabEl.classList.remove('active');
    });
    
    event.target.classList.add('active');
    document.getElementById(`${tab}-calc`).classList.add('active');
}

function calculateCircle() {
    const radius = parseFloat(document.getElementById('circle-radius').value);
    
    if (!radius || radius <= 0) {
        document.getElementById('circle-result').innerHTML = '';
        return;
    }
    
    const area = Math.PI * radius * radius;
    const circumference = 2 * Math.PI * radius;
    const diameter = 2 * radius;
    
    document.getElementById('circle-result').innerHTML = `
        <h5>Rezultati za krug:</h5>
        <p><strong>Poluprečnik:</strong> ${radius}</p>
        <p><strong>Prečnik:</strong> ${diameter}</p>
        <p><strong>Površina:</strong> <span class="highlight">${area.toFixed(2)}</span></p>
        <p><strong>Obim:</strong> <span class="highlight">${circumference.toFixed(2)}</span></p>
    `;
}

function calculateRectangle() {
    const length = parseFloat(document.getElementById('rect-length').value);
    const width = parseFloat(document.getElementById('rect-width').value);
    
    if (!length || !width || length <= 0 || width <= 0) {
        document.getElementById('rectangle-result').innerHTML = '';
        return;
    }
    
    const area = length * width;
    const perimeter = 2 * (length + width);
    const diagonal = Math.sqrt(length * length + width * width);
    
    document.getElementById('rectangle-result').innerHTML = `
        <h5>Rezultati za pravougaonik:</h5>
        <p><strong>Dužina:</strong> ${length}</p>
        <p><strong>Širina:</strong> ${width}</p>
        <p><strong>Površina:</strong> <span class="highlight">${area.toFixed(2)}</span></p>
        <p><strong>Obim:</strong> <span class="highlight">${perimeter.toFixed(2)}</span></p>
        <p><strong>Dijagonala:</strong> <span class="highlight">${diagonal.toFixed(2)}</span></p>
    `;
}

function calculateTriangle() {
    const base = parseFloat(document.getElementById('triangle-base').value);
    const height = parseFloat(document.getElementById('triangle-height').value);
    
    if (!base || !height || base <= 0 || height <= 0) {
        document.getElementById('triangle-result').innerHTML = '';
        return;
    }
    
    const area = (base * height) / 2;
    
    document.getElementById('triangle-result').innerHTML = `
        <h5>Rezultati za trougao:</h5>
        <p><strong>Osnova:</strong> ${base}</p>
        <p><strong>Visina:</strong> ${height}</p>
        <p><strong>Površina:</strong> <span class="highlight">${area.toFixed(2)}</span></p>
    `;
}

function calculateSphere() {
    const radius = parseFloat(document.getElementById('sphere-radius').value);
    
    if (!radius || radius <= 0) {
        document.getElementById('sphere-result').innerHTML = '';
        return;
    }
    
    const volume = (4/3) * Math.PI * radius * radius * radius;
    const surfaceArea = 4 * Math.PI * radius * radius;
    const diameter = 2 * radius;
    
    document.getElementById('sphere-result').innerHTML = `
        <h5>Rezultati za sferu:</h5>
        <p><strong>Poluprečnik:</strong> ${radius}</p>
        <p><strong>Prečnik:</strong> ${diameter}</p>
        <p><strong>Zapremina:</strong> <span class="highlight">${volume.toFixed(2)}</span></p>
        <p><strong>Površina:</strong> <span class="highlight">${surfaceArea.toFixed(2)}</span></p>
    `;
}

// Keyboard support for basic calculator
document.addEventListener('keydown', function(event) {
    if (document.getElementById('basic-calculator').classList.contains('active')) {
        const key = event.key;
        
        if (key >= '0' && key <= '9') {
            inputNumber(key);
        } else if (key === '.') {
            inputDecimal();
        } else if (key === '+') {
            operate('+');
        } else if (key === '-') {
            operate('-');
        } else if (key === '*') {
            operate('*');
        } else if (key === '/') {
            event.preventDefault();
            operate('/');
        } else if (key === 'Enter' || key === '=') {
            calculate();
        } else if (key === 'Escape') {
            clearAll();
        } else if (key === 'Backspace') {
            deleteLast();
        }
    }
});

// Prevent form submission on Enter key
document.addEventListener('keydown', function(event) {
    if (event.key === 'Enter' && event.target.tagName !== 'BUTTON') {
        event.preventDefault();
    }
});


