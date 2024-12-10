document.getElementById('submit-btn').addEventListener('click', async function () {
    const firstName = document.getElementById('fname').value;
    const lastName = document.getElementById('lname').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const age = document.getElementById('age-input').value;
    const gender = document.getElementById('gender-dropdown').value;

    if (!firstName || !lastName || !email || !password || !age || !gender) {
        alert("Please fill in all fields.");
        return;
    }

    const user = {
        firstName,
        lastName,
        email,
        password,
        age: parseInt(age, 10),
        gender
    };

    try {
        const response = await fetch('http://localhost:8080/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(user),
        });

        if (response.ok) {
            alert("Registration successful! Redirecting to login...");
            window.location.href = 'test.html';
        } else {
            const errorText = await response.text();
            alert(`Registration failed: ${errorText}`);
        }
    } catch (error) {
        console.error("Error:", error);
        alert("An error occurred. Please try again.");
    }
});
