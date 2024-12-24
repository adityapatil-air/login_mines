// Function to handle Google Sign-In
function onSignIn(response) {
    if (response.credential) {
        // Decode the ID token
        const credential = response.credential;
        const profile = jwt_decode(credential);

        console.log('Google Sign-In successful.');
        console.log('Name:', profile.name);
        console.log('Email:', profile.email);

        // Store user data in localStorage
        localStorage.setItem('loggedIn', 'true');
        localStorage.setItem('currentUser', profile.email);

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
