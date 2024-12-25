// Function to handle Google Sign-In
async function onSignIn(response) {
    if (response.credential) {
        // Decode the ID token
        const credential = response.credential;
        const profile = jwt_decode(credential);

        console.log('Google Sign-In successful.');
        console.log('Name:', profile.name);
        console.log('Email:', profile.email);

        // Save user data locally
        const email = profile.email;
        localStorage.setItem('loggedIn', 'true');
        localStorage.setItem('currentUser', email);

        // Fetch or initialize wallet balance from the backend
        try {
            const res = await fetch(`http://localhost:3000/wallet/${email}`);
            if (res.ok) {
                const data = await res.json();
                localStorage.setItem('wallet', data.wallet); // Store wallet balance locally
                console.log(`Wallet loaded: $${data.wallet}`);
            } else if (res.status === 404) {
                // If user is new, initialize wallet with $10,000
                console.log('New user. Initializing wallet to $10,000.');
                await fetch('http://localhost:3000/wallet', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, wallet: 10000 }),
                });
                localStorage.setItem('wallet', 10000); // Default wallet
            }
        } catch (error) {
            console.error('Error fetching or initializing wallet:', error);
        }

        // Redirect to the game page
        console.log('Redirecting to game.html...');
        window.location.href = 'game.html';
    } else {
        console.error('Error in onSignIn: No credential received');
        alert('An error occurred during the sign-in process. Please try again.');
    }
}

// Function to handle Sign-Out
function signOut() {
    google.accounts.id.disableAutoSelect();
    localStorage.clear();
    window.location.href = 'index.html';
}
