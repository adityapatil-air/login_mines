// Function to handle Google Sign-In
function onSignIn(googleUser) {
  const profile = googleUser.getBasicProfile();
  const idToken = googleUser.getAuthResponse().id_token;

  console.log('ID Token:', idToken); // Optional: Send to the server for verification
  console.log('Name:', profile.getName());
  console.log('Email:', profile.getEmail());

  // Store user info locally
  localStorage.setItem('loggedIn', 'true');
  localStorage.setItem('currentUser', profile.getEmail());
  window.location.href = 'game.html';
}

// Function to sign out
function signOut() {
  const auth2 = gapi.auth2.getAuthInstance();
  auth2.signOut().then(() => {
    console.log('User signed out.');
    localStorage.clear();
    window.location.href = 'index.html';
  });
}
