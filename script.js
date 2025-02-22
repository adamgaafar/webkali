document.addEventListener("DOMContentLoaded", function() {
    // Nmap Form
    const nmapForm = document.getElementById("nmap-form");
    nmapForm.addEventListener("submit", function(event) {
        event.preventDefault();
        const nmapIp = document.getElementById("nmap-ip").value;
        testNmap(nmapIp);
    });

    // Metasploit Form
    const metasploitForm = document.getElementById("metasploit-form");
    metasploitForm.addEventListener("submit", function(event) {
        event.preventDefault();
        const metasploitIp = document.getElementById("metasploit-ip").value;
        const exploitModule = document.getElementById("metasploit-exploit").value;
        testMetasploit(metasploitIp, exploitModule);
    });

    // SQLMap Form
    const sqlmapForm = document.getElementById("sqlmap-form");
    sqlmapForm.addEventListener("submit", function(event) {
        event.preventDefault();
        const sqlmapUrl = document.getElementById("sqlmap-url").value;
        testSQLMap(sqlmapUrl);
    });

    // Nessus Form
    const nessusForm = document.getElementById("nessus-form");
    nessusForm.addEventListener("submit", function(event) {
        event.preventDefault();
        const nessusIp = document.getElementById("nessus-ip").value;
        testNessus(nessusIp);
    });

    // Function to handle Nmap tool
    function testNmap(ip) {
        const output = document.getElementById("nmap-output");
        output.innerHTML = "Running Nmap on " + ip + "...";

        // Example of API call (replace with your actual API endpoint)
        fetch(`https://your-api-endpoint.com/nmap?ip=${ip}`)
            .then(response => response.json())
            .then(data => {
                output.innerHTML = `<pre>${JSON.stringify(data, null, 2)}</pre>`;
                document.getElementById("final-output").style.display = "block";
            })
            .catch(error => {
                output.innerHTML = "Error: " + error.message;
            });
    }

    // Function to handle Metasploit tool
    function testMetasploit(ip, exploit) {
        const output = document.getElementById("metasploit-output");
        output.innerHTML = `Running Metasploit with exploit ${exploit} on ${ip}...`;

        // Example of API call (replace with your actual API endpoint)
        fetch(`https://your-api-endpoint.com/metasploit?ip=${ip}&exploit=${exploit}`)
            .then(response => response.json())
            .then(data => {
                output.innerHTML = `<pre>${JSON.stringify(data, null, 2)}</pre>`;
                document.getElementById("final-output").style.display = "block";
            })
            .catch(error => {
                output.innerHTML = "Error: " + error.message;
            });
    }

    // Function to handle SQLMap tool
    function testSQLMap(url) {
        const output = document.getElementById("sqlmap-output");
        output.innerHTML = "Running SQLMap on " + url + "...";

        // Example of API call (replace with your actual API endpoint)
        fetch(`https://your-api-endpoint.com/sqlmap?url=${url}`)
            .then(response => response.json())
            .then(data => {
                output.innerHTML = `<pre>${JSON.stringify(data, null, 2)}</pre>`;
                document.getElementById("final-output").style.display = "block";
            })
            .catch(error => {
                output.innerHTML = "Error: " + error.message;
            });
    }

    // Function to handle Nessus tool
    function testNessus(ip) {
        const output = document.getElementById("nessus-output");
        output.innerHTML = "Running Nessus on " + ip + "...";

        // Example of API call (replace with your actual API endpoint)
        fetch(`https://your-api-endpoint.com/nessus?ip=${ip}`)
            .then(response => response.json())
            .then(data => {
                output.innerHTML = `<pre>${JSON.stringify(data, null, 2)}</pre>`;
                document.getElementById("final-output").style.display = "block";
            })
            .catch(error => {
                output.innerHTML = "Error: " + error.message;
            });
    }
});