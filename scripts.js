// Function to handle Google Sign-In
function onSignIn(googleUser) {
  const profile = googleUser.getBasicProfile();
  console.log('Name:', profile.getName());
  console.log('Email:', profile.getEmail());

  // Store login info and redirect to the game page
  localStorage.setItem('loggedIn', 'true');
  localStorage.setItem('currentUser', profile.getEmail());
  window.location.href = 'game.html'; // Redirect to game.html
}

// Function to handle Sign-Out
function signOut() {
  const auth2 = gapi.auth2.getAuthInstance();
  auth2.signOut().then(() => {
    console.log('User signed out.');
    localStorage.clear();
    window.location.href = 'index.html'; // Redirect to login page
  });
}
