
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
 async function renderHome() {
    try {
        const response = await fetch("/home", {
            method: "GET",
            credentials: "include", // Include cookies if using sessions for authentication
        });

        const posts = await response.json();

        // Check if posts is null or not an array
        
        document.body.innerHTML = `
            <div class="container">
                <div class="header">
                    <button id="logout-button">Logout</button>
                </div>
                <form id="post-form">
                    <input id="post-title" placeholder="Title" required />
                    <textarea id="post-content" placeholder="Write your post here..." required></textarea>
                    <button type="submit">Post</button>
                </form>
                <div id="posts">
                    <h2>Recent Posts</h2>
                    <div id="post-list" class="post-grid"></div>
                </div>
            </div>
        `;

        document.getElementById("logout-button").addEventListener("click", async () => {
            try {
                const response = await fetch("/logout", {
                    method: "POST",
                    credentials: "include", // Include cookies for session management
                });

                if (response.ok) {
                    renderLoginForm(); // Redirect to login page after logout
                } else {
                    const errorText = await response.text();
                    alert(`Logout failed: ${errorText}`);
                }
            } catch (err) {
                console.error("Logout error:", err);
            }
        });
        // Re-attach the event listener for posting
        document.getElementById("post-form").addEventListener("submit", async (e) => {
            e.preventDefault();
            if (posts == null) {
                postList.innerHTML = "<p>No posts available yet.</p>";
            } else if  (!Array.isArray(posts)) {
                console.error("Invalid response format:", posts);
                return;  // Stop if posts is invalid
            }
            const title = document.getElementById("post-title").value;
            const content = document.getElementById("post-content").value;
            
            try {
                const response = await fetch("/home", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ title, content }),
                });

                if (response.ok) {
                    renderHome();
                } else {
                    const errorText = await response.text();
                    alert(`Error: ${errorText}`);
                }
            } catch (err) {
                console.error("Error posting:", err);
            }
        });

        // Display posts
        const postList = document.getElementById("post-list");
        if (posts.length === 0) {
            postList.innerHTML = "<p>No posts available yet.</p>";
        } else {
            posts.forEach(post => {
                const postDiv = document.createElement("div");
                postDiv.className = "post";

                postDiv.innerHTML = `
                    <div class="post-header">
                        <span class="post-username">${post.username}</span>
                    </div>
                    <h3 class="post-title">${post.title}</h3>
                    <p class="post-content">${post.content}</p>
                    <small class="post-date">${new Date(post.created_at).toLocaleString()}</small>
                `;
                postList.appendChild(postDiv);
            });
        }

    } catch (err) {
        console.error("Error loading posts:", err);
    }
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
