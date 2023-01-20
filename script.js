// 
// Developer: Javier Basualdo
// Github: https://github.com/javierbasualdo
// Linkedin: https://www.linkedin.com/in/javierbasualdo/
// Updated: 01/2023
// Licence: Free (Please, tag me!)
// 

runCalculator();

function runCalculator() {

    const calculationEl = document.getElementsByClassName('calculation');
    const resultEl = document.querySelector('.result span');
    const buttonsEl = document.querySelectorAll('.buttons div');

    let memory = [];
    let replace = false;
    let backResult = '0';
    let maxResult = 9999999999999;
    const noFirstCrh = ['=','/','*','+'];
    const availableKeys = {
        '1': 1, '2': 2, '3': 3, '4': 4, '5': 5,
        '6': 6, '7': 7, '8': 8, '9': 9, '0': '0',
        'Backspace': 'ac',
        'Enter': '=',
        '=': '=',
        '-': '-',
        '+': '+',
        '/': '/',
        '*': '*',
        ',': '.',
    }

    setButtonsListeners();
    checkIsMobile();

    function setButtonsListeners() {
        [...buttonsEl].forEach(button => {
            button.addEventListener('click', (e) => {
                calculate(e.target.dataset.info);
                clicked(e.target.dataset.info);
            });
        });
        document.onkeydown = (e) => {
            if  (availableKeys[e.key]) {
                calculate(availableKeys[e.key]);
                clicked(availableKeys[e.key]);
            }
        }
    }

    function calculate(chr) {
        
        if (noFirst(chr)) {
            return;
        }

        if (chr === '=') {
            setTotal();
            return;
        }
        if (chr === 'ac') {
            clear();
            return;
        }
        
        memory.push(chr);
        setCalculation();

        if (!isNaN(chr) || chr == '.') {
            showInTotal(chr, true);
        } else {
            replace = true;
        }
        
    }

    function setCalculation() {
        calculationEl[0].innerHTML = memory.join('');
    }

    function setTotal() {
        const mem = memory.join('');
        let total;
        try {
            total = eval(mem) || '';
        } catch {
            total = '';
        }
        
        if (isMaxNumber(total)) {
            showAlert();
        } else {
            showInTotal(total);
        }
    }

    async function showInTotal(num, add) {
        if (backResult == '0') {
            resultEl.innerHTML = null;
            backResult = '';
        }
        
        if (replace) {
            resultEl.innerHTML = null;
            backResult = '';
            replace = false;
        }

        if (add) {
            num =  backResult + num;
        }

        if (isMaxNumber(num)) {
            showAlert();
            return;
        }

        backResult = num;
        resultEl.innerHTML = await replaceChr(num);
        updateFontSize();
    }

    function replaceChr(num) {
        let format;

        return new Promise((resolve) => {
            if (String(num).slice(-1) == '.') {
                if (num.length == 1) num = 0;
                format = new Intl.NumberFormat('de-DE').format(num) + ',';
                resolve(format);
            } else {
                format = new Intl.NumberFormat('de-DE').format(num);
                resolve(format);
            }
        })
        
    }

    function clear() {
        memory.splice(0);
        calculationEl[0].innerHTML = null;
        resultEl.innerHTML = 0;
        backResult = '0';
        updateFontSize(true);
    }

    function updateFontSize(clear) {
        if (clear) {
            resultEl.parentElement.removeAttribute('style');
        }
        for (let x = 0; x < 10; x++) {
            if (resultEl.scrollWidth > resultEl.parentElement.clientWidth) {
                let fontSize = window.getComputedStyle(resultEl.parentElement).getPropertyValue('font-size');
                let calc = parseInt(fontSize) - 1;
                resultEl.parentElement.style.fontSize = `${calc}px`;
            }
        }
    }

    function isMaxNumber(num) {
        if (num <= maxResult || !num || num == '.') {
            return false;
        }
        return true;
    }

    function showAlert() {
        alert(`Sorry!, The maximum number can be ${Intl.NumberFormat('de-DE').format(maxResult)}`);
        clear();
    }

    function clicked(chr) {
        if (noFirst(chr)) {
            return;
        }
        const beforeClicked = document.querySelector('.clicked');
        beforeClicked?.classList.remove('clicked');
        const button = [...buttonsEl].filter(btn => btn.dataset.info == chr )[0];
        button.classList.add('clicked');
    }

    function noFirst(chr) {
        if (memory.length == 0 && noFirstCrh.includes(chr)) {
            return true;
        }
        return false;
    }

    function checkIsMobile() {
        const toMatch = [
            /Android/i,
            /webOS/i,
            /iPhone/i,
            /iPad/i,
            /iPod/i,
            /BlackBerry/i,
            /Windows Phone/i
        ];
        if (navigator.userAgentData.mobile || navigator.userAgent.match(toMatch) !== null) {
            document.body.classList.add('ismobile');
            document.getElementsByClassName('calculator')[0].classList.add('ismobile');
        }
    }
}