    // Function to convert HTML element to XPath
        function getXPathForElement(element) {
            if (!element || element.nodeType !== 1) return ''; // Ensure the element is an element node

            let xpath = '//' + element.tagName.toLowerCase(); // Start with the tag name

            // Special handling for <meta> elements
            if (element.tagName.toLowerCase() === 'meta') {
                const property = element.getAttribute('property');
                const name = element.getAttribute('name');

                if (property) {
                    xpath += `[@property="${property}"]`; // Handle property attributes
                } else if (name) {
                    xpath += `[@name="${name}"]`; // Handle name attributes
                }
                return xpath; // Return immediately for meta tags
            }

            // Handle attributes for other elements
            const attributes = element.attributes;
            if (attributes.length > 0) {
                let conditions = [];
                for (let i = 0; i < attributes.length; i++) {
                    let attr = attributes[i];
                    // Exclude 'id' and 'class' if needed, but keep all other attributes
                    if (attr.name !== "id" && attr.name !== "class") {
                        conditions.push(`@${attr.name}="${attr.value}"`);
                    }
                }

                // Combine all attribute conditions
                if (conditions.length > 0) {
                    xpath += '[' + conditions.join(' and ') + ']'; // Combine attributes into one predicate
                }
            }

            // Check for id and class attributes last to add them if they exist
            if (element.id) {
                xpath += `[@id="${element.id}"]`;
            } 
            if (element.className) {
                xpath += `[@class="${element.className}"]`;
            }

            return xpath; // Return the constructed XPath
        }

        // Function to convert the HTML input to XPath
        function convertToXPath() {
            const htmlCode = document.getElementById('htmlInput').value;
            const parser = new DOMParser();
            const doc = parser.parseFromString(htmlCode, 'text/html');

            // Select all elements within the document including <head> section
            const elements = doc.querySelectorAll('head meta, body *'); // Select meta from head and all from body

            // Prepare an array to hold the XPaths
            let xpaths = [];
            elements.forEach(element => {
                const xpath = getXPathForElement(element);
                if (xpath) xpaths.push(xpath); // Only add non-empty XPath
            });

            // Join the XPath results with a line break
            document.getElementById('xpathOutput').value = xpaths.join('\n');
        }

   function xpathToCSS(xpath) {
    // List of attributes and nodes to ignore if they appear at the end of XPath
    const ignoredEndings = ['@src', '@href', '@data-src', '@data-original', 'text()'];
    
    // Regex to match XPath patterns with tag, optional attribute, and value, or attribute-only selection
    const regex = /\/{1,2}(\w+)(?:\[@(\w+)="([^"]+)"\])?(?:\/@(\w+))?(?:\/text\(\))?/g;
    let cssSelector = '';
    let match;
    let isLastSegmentIgnored = false;

    // Loop through each match of the XPath pattern
    while ((match = regex.exec(xpath)) !== null) {
        const tag = match[1];       // Tag name (e.g., ul, img, div, a)
        const attr = match[2];      // Attribute (e.g., id or class)
        const value = match[3];     // Value of the attribute (e.g., newlist)
        const attrOnly = match[4];  // Attribute only (e.g., src)

        // Check if this is the last part of the XPath and if it's an ignored attribute or node
        const xpathEnd = xpath.slice(regex.lastIndex - match[0].length).trim();
        isLastSegmentIgnored = ignoredEndings.some(ending => xpathEnd.endsWith(ending)) && regex.lastIndex === xpath.length;

        // Build the CSS selector part by part
        if (attr && value) {
            cssSelector += `${tag}[${attr}="${value}"]`;
        } else {
            cssSelector += tag;  // If no attribute, just add the tag
        }

        // Add '>' to indicate direct descendant if this isn't the last ignored segment
        if (regex.lastIndex < xpath.length && !isLastSegmentIgnored) {
            cssSelector += '>';
        }
    }

    // Return the final CSS selector or indicate if no valid match was found
    return cssSelector || 'Invalid XPath';
}

function convertToCSS() {
    const xpathCode = document.getElementById('xpathInput').value;
    const cssSelector = xpathToCSS(xpathCode);
    document.getElementById('cssOutput').value = cssSelector;
}

      // Function to handle both query strings and key-value pairs
        function convertToJSON() {
            const input = document.getElementById('queryStringInput').value.trim();
            const jsonObject = {};

            if (input.includes('=') && !input.includes(':')) {
                // Handle query string format (e.g., searchkey=%E9%97%AA%E5%A9%9A&Submit=)
                const params = new URLSearchParams(input);
                for (const [key, value] of params.entries()) {
                    jsonObject[key] = decodeURIComponent(value);
                }
            } else {
                // Handle key-value pair format (e.g., searchkey: 都市, searchtype: articlename)
                const lines = input.split('\n');
                lines.forEach(line => {
                    const [key, value] = line.split(':').map(str => str.trim());
                    if (key) {
                        jsonObject[key] = value || '';
                    }
                });
            }

            // Output the JSON result
            document.getElementById('jsonOutput').value = JSON.stringify(jsonObject, null, 4);
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

// Function to handle both params query strings and key-value pairs
        function convertToJSON() {
            const input = document.getElementById('queryStringInput').value.trim();
            const jsonObject = {};

            if (input.includes('=') && !input.includes(':')) {
                // Handle query string format (e.g., searchkey=%E9%97%AA%E5%A9%9A&Submit=)
                const params = new URLSearchParams(input);
                for (const [key, value] of params.entries()) {
                    jsonObject[key] = decodeURIComponent(value);
                }
            } else {
                // Handle key-value pair format (e.g., searchkey: 都市, searchtype: articlename)
                const lines = input.split('\n');
                lines.forEach(line => {
                    if (line.includes(':')) {
                        const [key, value] = line.split(/:(.*)/).map(str => str.trim()); // Split only at the first colon
                        jsonObject[key] = value ? value.trim() : ''; // Assign empty string if value is missing
                    }
                });
            }

            // Output the JSON result
            document.getElementById('jsonOutput').value = JSON.stringify(jsonObject, null, 4);
        }

        // Function to convert前置 double quotes to single quotes
        function convertQuotes() {
            const input = document.getElementById('doubleQuoteInput').value;

            // Replace all double quotes with single quotes
            const converted = input.replace(/"/g, "'");

            // Output the converted result
            document.getElementById('singleQuoteOutput').value = converted;
        }
        
        //源发现Js
        // Function to convert HTML list to JSON
function convertHtmlToJson() {
    const input = document.getElementById('htmlInput').value;
    const parser = new DOMParser();
    const doc = parser.parseFromString(input, 'text/html');
    
    // Select all <a> elements, regardless of whether they are inside <li> or not
    const listItems = doc.querySelectorAll('a');
    const jsonArray = [];

    listItems.forEach(item => {
        const name = item.textContent.trim();  // Extract visible text (name)
        const value = item.getAttribute('href'); // Extract href attribute and rename it to 'value'

        if (name && value) {
            jsonArray.push({ name, value });
        }
    });

    // Replace input with the converted JSON
    document.getElementById('htmlInput').value = JSON.stringify(jsonArray, null, 4);
}
        // Function to paste text from clipboard
    function pasteText(inputId) {
        navigator.clipboard.readText().then(
            text => {
                document.getElementById(inputId).value = text;
            }
        ).catch(
            err => {
                console.error('Failed to read clipboard contents: ', err);
            }
        );
    }


    // Function to match regex and display matches
    function matchRegex() {
        const inputText = document.getElementById('htmlInput').value;
        const regexPattern = document.getElementById('regexPattern').value;

        try {
            const regex = new RegExp(regexPattern, 'g'); // Create regex with global flag
            const matches = inputText.match(regex); // Find all matches

            // Display matches in the regexMatches box
            document.getElementById('regexMatches').value = matches ? matches.join('\n') : 'No matches found';
        } catch (error) {
            document.getElementById('regexMatches').value = 'Invalid regex pattern';
        }
    }

    // Function to apply regex and replace matches
    function applyRegex() {
        const inputText = document.getElementById('htmlInput').value;
        const regexPattern = document.getElementById('regexPattern').value;
        const replacement = document.getElementById('regexReplacement').value;

        try {
            const regex = new RegExp(regexPattern, 'g'); // Create regex with global flag
            const updatedText = inputText.replace(regex, replacement); // Replace matches with replacement string

            // Display the result in the same input/output box
            document.getElementById('htmlInput').value = updatedText;
        } catch (error) {
            document.getElementById('regexMatches').value = 'Invalid regex pattern';
        }
    }

// Function to copy text from input/output field
function copyText(inputId) {
    const text = document.getElementById(inputId).value;
    navigator.clipboard.writeText(text).catch(
        err => {
            console.error('Failed to copy text: ', err);
        }
    );
}

//阅读转换极简发现

  function yueconvertJson() {
    const input = document.getElementById('htmlInput').value.trim();

    // Check if the input is a JSON array or a custom 'title::url' format
    try {
        // Attempt to parse the input as JSON
        const jsonArray = JSON.parse(input);

        // Convert JSON input (same as before)
        const converted = jsonArray
            .filter(item => item.title && item.title.trim() && item.url && item.url.trim()) // Check both title and url
            .map(item => ({
                name: item.title.trim(),  // Get the title as name
                value: item.url.trim()    // Get the url as value
            }));

        // Replace the input field with the converted JSON
        document.getElementById('htmlInput').value = JSON.stringify(converted, null, 4); // Output to 'htmlInput'
    } catch (error) {
        // If the input is not JSON, treat it as the custom format
        const lines = input.split('\n');
        const converted = lines
            .filter(line => line.includes('::'))  // Only process lines with the '::' format
            .map(line => {
                const parts = line.split('::');
                const name = parts[0].trim();  // The part before '::' is the name
                const value = parts[1] ? parts[1].trim() : '';  // The part after '::' is the value

                // Only include the item if both name and value are present and non-empty
                if (name && value) {
                    return { name, value };
                }
            })
            .filter(item => item); // Filter out any undefined items

        // Replace the input field with the converted JSON
        document.getElementById('htmlInput').value = JSON.stringify(converted, null, 4);
    }
}

function beautify() {
            const input = document.getElementById('inputCode').value;
            const type = document.getElementById('beautifyType').value;
            
            try {
                let beautifiedCode;
                if (type === 'json') {
                    // Beautify JSON
                    const parsedJSON = JSON.parse(input);
                    beautifiedCode = JSON.stringify(parsedJSON, null, 4);
                } else if (type === 'js') {
                    // Beautify JavaScript using js-beautify
                    beautifiedCode = js_beautify(input);
                }
                document.getElementById('output').textContent = beautifiedCode;
            } catch (error) {
                document.getElementById('output').textContent = 'Invalid input for the selected type!';
            }
        }
