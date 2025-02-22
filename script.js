document.addEventListener("DOMContentLoaded", function() {
    const apiBase = "http://13.61.150.212:5000"; // Your VPS IP and port
    const resultsDiv = document.querySelector(".results");

    const randomErrors = [
        "Connection timed out. Please check the target IP and try again.",
        "Invalid credentials. Authentication failed.",
        "Target service is not responding. Ensure the service is running.",
        "Scan completed with warnings. Some vulnerabilities may not be detected.",
        "Unexpected error occurred during the scan. Please try again.",
        "Target is not reachable. Check your network connection.",
        "Scan interrupted due to resource constraints.",
        "No vulnerabilities detected. Target appears to be secure.",
        "Error: Target system is blocking scan requests.",
        "Scan completed successfully, but no results were found."
    ];

    function appendResult(result) {
        // Create a new <p> element for each result
        const resultElement = document.createElement("p");

        // Format the result: if success, show the output; if error, show a random error message
        const formattedResult = result.success ?
            JSON.stringify(result.output, null, 2) :
            randomErrors[Math.floor(Math.random() * randomErrors.length)]; // Generate a new random error message

        // Set the text content of the new <p> element
        resultElement.textContent = "C:adamgaafar> " + formattedResult;

        // Append the new <p> element to the results div
        resultsDiv.appendChild(resultElement);
    }

    function handleError(error) {
        console.error("API Error:", error);
        appendResult({ success: false, error: "Something went wrong. Please try again later." });
    }

    function sendPostRequest(endpoint, data) {
        return fetch(`${apiBase}/${endpoint}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            })
            .then((response) => response.json())
            .catch(handleError);
    }

    function disableButton(button) {
        button.disabled = true;
        button.innerText = "Processing...";
    }

    function enableButton(button) {
        button.disabled = false;
        button.innerText = "Submit";
    }

    document.getElementById("nmap-form").addEventListener("submit", function(event) {
        event.preventDefault();
        const target = document.getElementById("nmap-ip").value;
        const submitButton = event.target.querySelector("button");
        if (!target) {
            appendResult({ success: false, error: "Please enter a target IP." });
            return;
        }
        disableButton(submitButton);
        sendPostRequest("nmap", { target: target })
            .then((data) => {
                console.log("Nmap API Response:", data);
                appendResult(data);
                enableButton(submitButton);
            });
    });

    document.getElementById("metasploit-form").addEventListener("submit", function(event) {
        event.preventDefault();
        const target = document.getElementById("metasploit-ip").value;
        const exploit = document.getElementById("metasploit-exploit").value;
        const submitButton = event.target.querySelector("button");
        if (!target || !exploit) {
            appendResult({ success: false, error: "Both target IP and exploit are required." });
            return;
        }
        disableButton(submitButton);
        sendPostRequest("metasploit", { target: target })
            .then((data) => {
                console.log("Metasploit API Response:", data);
                appendResult(data);
                enableButton(submitButton);
            });
    });

    document.getElementById("sqlmap-form").addEventListener("submit", function(event) {
        event.preventDefault();
        const url = document.getElementById("sqlmap-url").value;
        const submitButton = event.target.querySelector("button");
        if (!url) {
            appendResult({ success: false, error: "Please enter a URL." });
            return;
        }
        disableButton(submitButton);
        sendPostRequest("sqlmap", { url: url })
            .then((data) => {
                console.log("SQLMap API Response:", data);
                appendResult(data);
                enableButton(submitButton);
            });
    });

    document.getElementById("nessus-form").addEventListener("submit", function(event) {
        event.preventDefault();
        const submitButton = event.target.querySelector("button");
        disableButton(submitButton);
        sendPostRequest("nessus", {})
            .then((data) => {
                console.log("Nessus API Response:", data);
                appendResult(data);
                enableButton(submitButton);
            });
    });
});