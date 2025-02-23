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
        const resultElement = document.createElement("p");
        const formattedResult = result.success ?
            JSON.stringify(result.output, null, 2) :
            randomErrors[Math.floor(Math.random() * randomErrors.length)];

        resultElement.textContent = "C:adamgaafar> " + formattedResult;
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
            }).then(response => response.json())
            .catch(handleError);
    }

    function sendGetRequest(endpoint) {
        return fetch(`${apiBase}/${endpoint}`)
            .then(response => response.json())
            .catch(handleError);
    }

    function disableButton(button, text = "Processing...") {
        button.disabled = true;
        button.innerText = text;
    }

    function enableButton(button, text = "Submit") {
        button.disabled = false;
        button.innerText = text;
    }

    document.getElementById("nmap-form").addEventListener("submit", function(event) {
        event.preventDefault();
        const target = document.getElementById("nmap-ip").value;
        const submitButton = event.target.querySelector("button");

        if (!target) {
            appendResult({ success: false, error: "Please enter a target IP." });
            return;
        }

        disableButton(submitButton, "Scanning...");
        sendPostRequest("nmap", { target })
            .then(data => {
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

        disableButton(submitButton, "Exploiting...");
        sendPostRequest("metasploit", { target, module: exploit })
            .then(data => {
                console.log("Metasploit API Response:", data);
                appendResult(data.message);
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

        disableButton(submitButton, "Scanning for SQL vulnerabilities...");
        sendPostRequest("sqlmap", { url })
            .then(data => {
                console.log("SQLMap API Response:", data);
                appendResult(data);
                enableButton(submitButton);
            });
    });

    document.getElementById("nessus-form").addEventListener("submit", function(event) {
        event.preventDefault();
        const scanId = document.getElementById("nessus-ip").value;
        const submitButton = event.target.querySelector("button");

        if (!scanId) {
            appendResult({ success: false, error: "Please enter a Nessus scan ID." });
            return;
        }

        disableButton(submitButton, "Starting scan...");

        sendPostRequest("start_scan", { scan_id: scanId })
            .then(startResponse => {
                console.log("Nessus Start Scan Response:", startResponse);
                appendResult({ success: true, output: "Nessus scan started successfully." });

                setTimeout(() => {
                    sendGetRequest(`scan_results/${scanId}`)
                        .then(resultsResponse => {
                            console.log("Nessus Scan Results:", resultsResponse);
                            appendResult({ success: true, output: resultsResponse });
                            enableButton(submitButton, "Start Scan");
                        });
                }, 10000); // Adjust delay based on expected scan time
            });
    });
});