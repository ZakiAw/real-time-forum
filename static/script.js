
function renderSignupForm() {
    document.body.innerHTML = `
         <div class="container">
             <h1>Sign Up</h1>
             <form id="signup-form">
                 <input id="nname" name="nickname" placeholder="Nickname" required>
                 <input id="fname" name="first_name" placeholder="First Name" required>
                 <input id="lname" name="last_name" placeholder="Last Name" required>
                 <input id="email" name="email" placeholder="Email" required>
                 <input id="password" name="password" placeholder="Password" type="password" required>
                 <div class="dropdown-container">
                     <input id="age-input" name="age" placeholder="Age" type="number" required>
                     <select id="gender-dropdown" name="gender" required>
                         <option value="" disabled selected>Gender</option>
                         <option value="male">Male</option>
                         <option value="female">Female</option>
                     </select>
                 </div>
                 <button id="submit" type="submit">Sign Up</button>
             </form>
             <br>
              <button id="login-page-button">Have an Account?</button>
         </div>
         `
 
   //   Attach event listener for the sign-up form
     const signupForm = document.getElementById("signup-form");
     signupForm.addEventListener("submit", async (e) => {
         e.preventDefault();
         const formData = new FormData(signupForm);
 
         try {
             const response = await fetch("/", {
                 method: "POST",
                 body: formData,
             });
 
             if (response.ok) {
                 renderLoginForm();
             } else {
                 const errorText = await response.text();
                 alert(`Error: ${errorText}`);
             }
         } catch (err) {
             console.error("Sign-up error:", err);
         }
     });
     const loginPageButton = document.getElementById("login-page-button");
     loginPageButton.addEventListener("click", () => {
         renderLoginForm();
     });
}

function renderLoginForm() {
    document.body.innerHTML = `
        <div class="container">
            <h1>Log in</h1>
            <form id="login-form">
                <input id="nname" name="nickname" placeholder="Nickname" required>
                <input id="password" name="password" placeholder="Password" type="password" required>
                <button id="submit" type="submit">Log In</button>
            </form>
        </div>
    `;
 
    const loginForm = document.getElementById("login-form");
    loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const formData = new FormData(loginForm);
 
        try {
            const response = await fetch("/login", {
                method: "POST",
                body: formData,
            });
 
            if (response.ok) {
                // Login successful, now render the home page
                renderHome();
            } else {
                const errorText = await response.text();
                alert(`Error: ${errorText}`);
            }
        } catch (err) {
            console.error("Login error:", err);
        }
    });
 }
 
 function renderHome() {
    document.body.innerHTML = `
        <div class="container">
            <h1>Welcome to the Forum</h1>
            <form id="post-form">
                <textarea id="post-content" placeholder="Write your post here..." required></textarea>
                <button type="submit">Post</button>
            </form>
            <div id="posts">
                <h2>Recent Posts</h2>
                <ul id="post-list"></ul>
            </div>
        </div>
    `;

    // Attach event listener for posting
    document.getElementById("post-form").addEventListener("submit", async (e) => {
        e.preventDefault();
        const content = document.getElementById("post-content").value;

        try {
            const response = await fetch("/home", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ content }),
            });

            if (response.ok) {
                const data = await response.json();
                alert(data.message);
                const postList = document.getElementById("post-list");
                const newPost = document.createElement("li");
                newPost.textContent = content;
                postList.appendChild(newPost);
            } else {
                const errorText = await response.text();
                alert(`Error: ${errorText}`);
            }
        } catch (err) {
            console.error("Error posting:", err);
        }
    });
}

document.addEventListener("DOMContentLoaded", async () => {
    const loggedIn = await checkLoginStatus();  // Function to check login status
    if (loggedIn) {
        renderHome();  // Skip signup/login, directly show home
    } else {
        renderSignupForm();  // Show signup form
    }
});

// Function to check login status by sending a request to the server
async function checkLoginStatus() {
    const response = await fetch("/check-login", {
        method: "GET",
        credentials: "same-origin",  // Include cookies in the request
    });
    return response.ok;
}
