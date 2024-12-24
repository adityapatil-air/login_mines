// Function to handle Google Sign-In
function onSignIn(googleUser) {
    try {
        console.log('Google Sign-In successful.');

        // Retrieve profile information
        const profile = googleUser.getBasicProfile();
        console.log('Name:', profile.getName());
        console.log('Email:', profile.getEmail());

        // Store user data in localStorage
        localStorage.setItem('loggedIn', 'true');
        localStorage.setItem('currentUser', profile.getEmail());

        // Redirect to the game page
        console.log('Redirecting to game.html...');
        window.location.href = 'game.html';
    } catch (error) {
        console.error('Error in onSignIn:', error);
        alert('An error occurred during the sign-in process. Please try again.');
    }
}


// Function to handle Sign-Out
function signOut() {
    const auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(() => {
        console.log('User signed out.');
        localStorage.clear();
        window.location.href = 'index.html';
    });
}
