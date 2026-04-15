let firstChar = '';
let stringContent = '';

window.onload = function() {
    generateRandomString();
};

function generateRandomString() {
    // 生成 0-2 个随机字符
    const randomCount = Math.floor(Math.random() * 3); // 0, 1, 或 2
    stringContent = '';
    
    for (let i = 0; i < randomCount; i++) {
        const randomChar = String.fromCharCode(97 + Math.floor(Math.random() * 26)); // a-z
        stringContent += randomChar;
    }
    
    firstChar = stringContent.length > 0 ? stringContent[0] : '';
    updateDisplay();
    console.log('Generated string:', stringContent, 'First char:', firstChar);
}

function updateDisplay() {
    const container = document.getElementById('container');
    container.textContent = stringContent;
}

window.addEventListener("keyup", function(e) {
    console.log(e.key);
    if(e.key && e.key.match(/[a-z]/i)) {
        if(e.key.toLowerCase() === firstChar) {
            // 删除第一个字符
            stringContent = stringContent.substring(1);
            firstChar = stringContent.length > 0 ? stringContent[0] : '';
            console.log('Matched! Removed first char. Remaining:', stringContent);
        } else {
            // 没按到当前第一个字符时，才追加随机字符
            const newCharCount = 1 + Math.floor(Math.random() * 3); // 1-3
            for (let i = 0; i < newCharCount; i++) {
                const randomChar = String.fromCharCode(97 + Math.floor(Math.random() * 26)); // a-z
                stringContent += randomChar;
            }
        }
        
        // 更新第一个字符
        if (stringContent.length === 0) {
            firstChar = '';
        } else if (firstChar === '') {
            firstChar = stringContent[0];
        }
        
        updateDisplay();
        console.log('Updated string:', stringContent, 'First char:', firstChar);
    }
});
