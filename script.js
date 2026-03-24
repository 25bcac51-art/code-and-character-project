// 1. Memory Bank to store visitor info
let currentVisitor = { name: '', email: '' };

// 2. The Visitor Gate Logic
document.getElementById('gate-form').addEventListener('submit', async (e) => {
    e.preventDefault(); // STOPS THE REFRESH
    
    console.log("Gate submitted...");

    // Collect data from the form
    const nameVal = document.getElementById('visitor-name').value;
    const phoneVal = document.getElementById('visitor-phone').value;
    const emailVal = document.getElementById('visitor-email').value;

    // Save to memory bank
    currentVisitor.name = nameVal;
    currentVisitor.email = emailVal;

    try {
        const response = await fetch('/api/visitor-gate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: nameVal, phone: phoneVal, email: emailVal })
        });

        const result = await response.json();

        if (result.success) {
            console.log("Success! Unlocking study...");
            // HIDE GATE, SHOW CONTENT
            document.getElementById('visitor-gate').style.display = 'none';
            document.getElementById('main-content').style.display = 'block';
            
            // Re-trigger animations
            window.scrollTo(0, 0);
        }
    } catch (error) {
        console.error('Fetch Error:', error);
        alert('Server connection failed.');
    }
});

// 3. The Review/Contact Form Logic
document.getElementById('contact-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const reviewData = {
        name: currentVisitor.name,
        email: currentVisitor.email,
        message: document.getElementById('contact-message').value
    };

    try {
        const response = await fetch('/api/contact', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(reviewData)
        });

        const result = await response.json();

        if (result.success) {
            alert(`Thank you for the review, ${currentVisitor.name}!`);
            e.target.reset();
        }
    } catch (error) {
        alert("Error saving your review.");
    }
});

// 4. Certificate Modal Functions
function openCert(pdfPath) {
    const modal = document.getElementById('cert-modal');
    const viewer = document.getElementById('cert-viewer');
    viewer.src = pdfPath;
    modal.style.display = "block";
}

function closeCert() {
    const modal = document.getElementById('cert-modal');
    modal.style.display = "none";
    document.getElementById('cert-viewer').src = "";
}

// Close modal if user clicks outside
window.onclick = function(event) {
    const modal = document.getElementById('cert-modal');
    if (event.target == modal) {
        closeCert();
    }
};

const topBtn = document.getElementById("back-to-top");

// Show button when scrolling down
window.onscroll = function() {
    if (document.body.scrollTop > 300 || document.documentElement.scrollTop > 300) {
        topBtn.style.display = "block";
    } else {
        topBtn.style.display = "none";
    }
};

// Scroll to top function
topBtn.onclick = function() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth' // Smooth sliding effect
    });
};