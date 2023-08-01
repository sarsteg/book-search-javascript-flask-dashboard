function fadeOutAndRedirect(url) {
    document.body.style.opacity = 0; // Set the opacity to 0 (fully transparent) for the fade-out effect
    setTimeout(function () {
        window.location.href = url; // Redirect to the new page after the fade-out
    }, 1000); // Adjust the delay (in milliseconds) to match the transition duration in CSS (1s in this example)
}
