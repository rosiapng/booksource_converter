 function getXPathForElement(element) {
            if (!element || element.nodeType !== 1) return '';
            
            let xpath = '//' + element.tagName.toLowerCase();

            if (element.id) {
                xpath += '[@id="' + element.id + '"]';
            } else if (element.className) {
                xpath += '[@class="' + element.className + '"]';
            } else {
                const attributes = element.attributes;
                if (attributes.length > 0) {
                    let conditions = [];
                    for (let i = 0; i < attributes.length; i++) {
                        let attr = attributes[i];
                        if (attr.name !== "id" && attr.name !== "class") {
                            conditions.push(`@${attr.name}="${attr.value}"`);
                        }
                    }
                    if (conditions.length > 0) {
                        xpath += '[' + conditions.join(' and ') + ']';
                    }
                }
            }

            return xpath;
        }

        function convertToXPath() {
            const htmlCode = document.getElementById('htmlInput').value;
            const parser = new DOMParser();
            const doc = parser.parseFromString(htmlCode, 'text/html');
            const firstElement = doc.body.firstElementChild;

            if (firstElement) {
                const xpath = getXPathForElement(firstElement);
                document.getElementById('xpathOutput').value = xpath;
            } else {
                document.getElementById('xpathOutput').value = 'No valid element found in HTML';
            }
        }

        // Function to convert XPath to CSS in the format: tag[attribute="value"]
        function xpathToCSS(xpath) {
    // Regex to match the XPath pattern and capture tag, attribute, and value
    const regex = /\/\/(\w+)\[@(\w+)="([^"]+)"\](?:\/\w+)?/;  // Updated regex
    const match = xpath.match(regex);

    if (match) {
        const tag = match[1];     // Tag name (e.g., div)
        const attr = match[2];    // Attribute (e.g., class or id)
        const value = match[3];   // Value of the attribute (e.g., intro)

        // Return CSS selector in the format: tag[attribute="value"]
        return `${tag}[${attr}="${value}"]`;
    }

    return 'Invalid XPath';
}

        function convertToCSS() {
            const xpathCode = document.getElementById('xpathInput').value;
            const cssSelector = xpathToCSS(xpathCode);
            document.getElementById('cssOutput').value = cssSelector;
        }

        // Function to clear input boxes
        function clearInput(inputId) {
            document.getElementById(inputId).value = '';
        }

        function copyOutput(outputId) {
    const outputElement = document.getElementById(outputId);
    outputElement.select();
    outputElement.setSelectionRange(0, 99999); // For mobile devices
    document.execCommand("copy");
    // Removed the alert
}
        
      
        function convertToCustomFunction() {
    let jsCode = document.getElementById('jsInput').value;

    // Step 1: Start the function definition with a comment
    let convertedCode = `function MYAnalysis(result) {\n//powered by RosiaP'ng\n\n`;

    // Step 2: Transform the provided JavaScript code
    convertedCode += jsCode
        .replace(/@js:/g, '') // Remove "@js:"
        

    // Step 3: Close the function
    convertedCode += `var jsonString = JSON.stringify(这里)//put return code here

return jsonString
}`;

    // Output the converted code
    document.getElementById('jsOutput').value = convertedCode;
}
        
