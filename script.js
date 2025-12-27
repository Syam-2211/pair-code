// Mock WhatsApp Bot Pairing Script

document.addEventListener('DOMContentLoaded', function() {
    const qrContainer = document.getElementById('qr-code');
    const loadingElement = document.getElementById('loading');
    const statusMessage = document.getElementById('status-message');
    const refreshBtn = document.getElementById('refresh-btn');

    let qrCodeInstance = null;
    let pairingTimeout = null;

    // Function to show loading state
    function showLoading() {
        qrContainer.innerHTML = '';
        loadingElement.classList.remove('hidden');
        statusMessage.classList.add('hidden');
        refreshBtn.disabled = true;
    }

    // Function to hide loading state
    function hideLoading() {
        loadingElement.classList.add('hidden');
        refreshBtn.disabled = false;
    }

    // Function to show status message
    function showStatus(message, type = 'info') {
        statusMessage.textContent = message;
        statusMessage.className = `status ${type}`;
        statusMessage.classList.remove('hidden');
    }

    // Function to generate mock QR code
    function generateQRCode() {
        showLoading();

        // Clear any existing QR code
        if (qrCodeInstance) {
            qrCodeInstance.clear();
        }

        // Simulate API call delay
        setTimeout(() => {
            try {
                // Generate a mock QR code data (in real app, this would come from backend)
                const mockQRData = 'https://web.whatsapp.com/pairing/' + Math.random().toString(36).substr(2, 9);

                // Create QR code
                qrCodeInstance = new QRCode(qrContainer, {
                    text: mockQRData,
                    width: 256,
                    height: 256,
                    colorDark: '#000000',
                    colorLight: '#ffffff',
                    correctLevel: QRCode.CorrectLevel.H
                });

                hideLoading();
                showStatus('QR code generated successfully. Scan with WhatsApp to pair.', 'success');

                // Start pairing simulation
                startPairingSimulation();

            } catch (error) {
                hideLoading();
                showStatus('Failed to generate QR code. Please try again.', 'error');
                console.error('QR Code generation error:', error);
            }
        }, 2000); // Simulate 2 second delay
    }

    // Function to simulate pairing process
    function startPairingSimulation() {
        // Clear any existing timeout
        if (pairingTimeout) {
            clearTimeout(pairingTimeout);
        }

        // Simulate pairing success after 10-15 seconds
        const pairingTime = Math.random() * 5000 + 10000; // 10-15 seconds

        pairingTimeout = setTimeout(() => {
            showStatus('Pairing successful! Your WhatsApp account is now connected to the bot.', 'success');
            // In a real app, you might redirect or update UI here
        }, pairingTime);
    }

    // Function to refresh QR code
    function refreshQRCode() {
        if (pairingTimeout) {
            clearTimeout(pairingTimeout);
        }
        generateQRCode();
    }

    // Event listeners
    refreshBtn.addEventListener('click', refreshQRCode);

    // Initialize on page load
    generateQRCode();

    // Mock WebSocket simulation for real-time updates
    // In a real implementation, this would connect to a WebSocket server
    function simulateWebSocketUpdates() {
        // Simulate periodic status updates
        setInterval(() => {
            // Randomly show connection status updates
            const messages = [
                'Connected to WhatsApp servers',
                'Waiting for scan...',
                'Device detected, pairing in progress...'
            ];

            if (Math.random() < 0.3) { // 30% chance every 5 seconds
                const randomMessage = messages[Math.floor(Math.random() * messages.length)];
                showStatus(randomMessage, 'info');
            }
        }, 5000);
    }

    // Start WebSocket simulation
    simulateWebSocketUpdates();

    // Error handling for QR code library
    window.addEventListener('error', function(e) {
        if (e.error && e.error.name === 'QRCodeError') {
            showStatus('QR code library error. Please refresh the page.', 'error');
        }
    });

    // Handle page visibility changes (e.g., user switches tabs)
    document.addEventListener('visibilitychange', function() {
        if (document.hidden) {
            // Pause pairing simulation when page is not visible
            if (pairingTimeout) {
                clearTimeout(pairingTimeout);
            }
        } else {
            // Resume or restart pairing simulation
            startPairingSimulation();
        }
    });
});
