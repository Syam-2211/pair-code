document.addEventListener('DOMContentLoaded', function() {
    // Select DOM elements
    const phoneInputContainer = document.getElementById('phone-input-container');
    const phoneNumberInput = document.getElementById('phone-number');
    const submitPhoneBtn = document.getElementById('submit-phone-btn');
    
    const pairingCodeDisplay = document.getElementById('pairing-code-display');
    const pairingCodeSpan = document.getElementById('pairing-code');
    
    const loadingElement = document.getElementById('loading');
    const statusMessage = document.getElementById('status-message');
    const refreshBtn = document.getElementById('refresh-btn');

    // --- UI Helper Functions ---

    function showLoading() {
        phoneInputContainer.classList.add('hidden');
        pairingCodeDisplay.classList.add('hidden');
        loadingElement.classList.remove('hidden');
        statusMessage.classList.add('hidden');
        refreshBtn.classList.add('hidden');
    }

    function showPairingCode(code) {
        loadingElement.classList.add('hidden');
        phoneInputContainer.classList.add('hidden'); // Keep phone input hidden
        pairingCodeDisplay.classList.remove('hidden'); // Show the code
        pairingCodeSpan.textContent = code; // Set the code text
        refreshBtn.classList.remove('hidden'); // Allow user to try again
    }

    function showInputForm() {
        loadingElement.classList.add('hidden');
        pairingCodeDisplay.classList.add('hidden');
        phoneInputContainer.classList.remove('hidden');
        refreshBtn.classList.add('hidden');
    }

    function showStatus(message, type = 'info') {
        statusMessage.textContent = message;
        statusMessage.className = `status ${type}`;
        statusMessage.classList.remove('hidden');
    }

    // --- Core Logic: Fetch Pairing Code ---

    async function getPairingCode() {
        // 1. Get and Validate Phone Number
        let phoneNumber = phoneNumberInput.value.trim();
        
        // Basic validation: Ensure it contains only numbers and is long enough
        phoneNumber = phoneNumber.replace(/[^0-9]/g, ''); // Remove non-numeric chars
        
        if (phoneNumber.length < 10) {
            showStatus('Please enter a valid WhatsApp number (e.g., 628123456789)', 'error');
            return;
        }

        // 2. Prepare UI
        showLoading();
        showStatus('Requesting Pairing Code from Bot...', 'info');

        try {
            // =================================================================
            // ⚠️ IMPORTANT: REPLACE THE URL BELOW WITH YOUR REAL BOT SERVER URL
            // =================================================================
            // Example: 'https://my-whatsapp-bot.herokuapp.com/pair'
            // The backend should expect a query param ?number=...
            const apiUrl = `/pair?number=${phoneNumber}`; 

            const response = await fetch(apiUrl);
            
            if (!response.ok) {
                throw new Error(`Server Error: ${response.status}`);
            }

            const data = await response.json();

            // 3. Handle Success
            if (data.code) {
                // Format code if needed (e.g., ABC-DEF)
                let formattedCode = data.code;
                if (data.code.length === 8 && !data.code.includes('-')) {
                    formattedCode = `${data.code.slice(0, 4)}-${data.code.slice(4)}`;
                }
                
                showPairingCode(formattedCode);
                showStatus('Code received! Enter this code in WhatsApp > Linked Devices > Link with phone number.', 'success');
                
                // Optional: Start checking for connection status here
                // startConnectionCheck(); 

            } else {
                throw new Error(data.message || 'No pairing code received from server.');
            }

        } catch (error) {
            // 4. Handle Error
            console.error('Pairing Error:', error);
            showStatus(`Error: ${error.message}. Is your bot server running?`, 'error');
            showInputForm(); // Let user try again
        }
    }

    // --- Event Listeners ---

    submitPhoneBtn.addEventListener('click', getPairingCode);

    // Allow pressing "Enter" in the phone input
    phoneNumberInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            getPairingCode();
        }
    });

    refreshBtn.addEventListener('click', function() {
        showStatus('Resetting...', 'info');
        phoneNumberInput.value = ''; // Clear input
        showInputForm();
    });

    // Initialize state
    showInputForm();
});
