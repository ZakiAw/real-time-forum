function renderSignupForm() {
    document.body.innerHTML = `
         <div class="container1">
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
        <div class="container1">
            <h1>Log in</h1>
            <form id="login-form">
                <input id="nname" name="nickname" placeholder="Nickname" required>
                <input id="password" name="password" placeholder="Password" type="password" required>
                <button id="submit" type="submit">Log In</button>
                <button id="signup-page-button">Sign up</button>
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
                const { nickname } = await response.json();
                sessionStorage.setItem("username", nickname)
                renderHome();
            } else {
                const errorText = await response.text();
                alert(`Error: ${errorText}`);
            }
        } catch (err) {
            console.error("Login error:", err);
        }
    });
    const signupPageButton = document.getElementById("signup-page-button");
    signupPageButton.addEventListener("click", () => {
        renderSignupForm();
    });
 }
 async function renderHome() {
    try {
        const response = await fetch("/home", {
            method: "GET",
            credentials: "include", // Include cookies for session authentication
        });

        if (!response.ok) {
            throw new Error(`Failed to load home: ${await response.text()}`);
        }

        const { posts, members } = await response.json();
        const storedUsername = sessionStorage.getItem("username");
        document.body.innerHTML = `
            <div class="container">
                <div class="header">
                <div>${storedUsername}</div>
                <button id="logout-button">Logout</button>
                </div>
                <div class="main-content">
                    <div class="members-list">
                        <h3>Members</h3>
                        <ul id="member-list"></ul>
                    </div>
                    <div class="content">
                        <form id="post-form">
                            <textarea id="post-content" placeholder="Post" required></textarea>
                            <button class="comment-button" type="submit">Post</button>
                        </form>
                        <div id="posts">
                            <h2>Recent Posts</h2>
                            <div id="post-list" class="post-grid"></div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Attach logout functionality
        document.getElementById("logout-button").addEventListener("click", async () => {
            try {
                const logoutResponse = await fetch("/logout", {
                    method: "POST",
                    credentials: "include",
                });

                if (logoutResponse.ok) {
                    renderLoginForm();
                } else {
                    alert(`Logout failed: ${await logoutResponse.text()}`);
                }
            } catch (err) {
                console.error("Logout error:", err);
            }
        });

        // Handle post submission
        const postForm = document.getElementById("post-form");
        postForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const content = document.getElementById("post-content").value;

            try {
                const postResponse = await fetch("/home", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ content }),
                });

                if (postResponse.ok) {
                    renderHome(); // Refresh posts after submission
                } else {
                    alert(`Failed to post: ${await postResponse.text()}`);
                }
            } catch (err) {
                console.error("Error posting:", err);
            }
        });

        // Render posts
        const postList = document.getElementById("post-list");
        if (!posts || posts.length === 0) {
            postList.innerHTML = "<p>No posts available yet.</p>";
        } else {
            posts.forEach(post => {
                const postDiv = document.createElement("div");
                postDiv.className = "post";

                postDiv.innerHTML = `
                    <div class="post-header">
                        <span class="post-username">${post.username}</span>
                    </div>
                    <p class="post-content">${post.content}</p>
                    <button class="comment-button">Comment</button>
                    <small class="post-date">${new Date(post.created_at).toLocaleString()}</small>
                `;

                // Attach functionality to the Comment button
                postDiv.querySelector(".comment-button").addEventListener("click", () => {
                    renderPostComments(post);
                });

                postList.appendChild(postDiv);
            });
        }
        // Render members
        const memberList = document.getElementById("member-list");
        members.forEach(member => {
            const memberItem = document.createElement("li");
            memberItem.className = "member-item";
            memberItem.textContent = member.nickname;

            const dropdown = document.createElement("div");
            dropdown.className = "chat-dropdown";
            dropdown.innerHTML = `
                <p>Start Chat</p>
                <p>View Profile</p>
            `;

            memberItem.appendChild(dropdown);
            memberItem.addEventListener("click", () => {
                memberItem.classList.toggle("active");
            });

            memberList.appendChild(memberItem);
        });

    } catch (err) {
        console.error("Error loading home page:", err);
        alert("Failed to load home page.");
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

async function renderPostComments(post) {
    const contentDiv = document.querySelector(".content");

    contentDiv.innerHTML = `
    <div class="commentpost">    
        <div class="post-header">
            <span class="post-username">${post.username}</span>
        </div>
        <p class="post-content">${post.content}</p>
        <small class="post-date">${new Date(post.created_at).toLocaleString()}</small>
    </div>
    <div id="comments-section">
        <textarea id="new-comment" placeholder="Comment"></textarea>
        <button id="submit-comment">Post</button>
        <button id="back-button">Back</button>
        <h3>Comments</h3>
        <ul id="comment-list"></ul>
    </div>`;

    // Fetch all comments when entering the comment section
    try {
        const commentResponse = await fetch(`/comments`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ post_id: post.id }), // Send post_id to get comments for that post
        });

        if (commentResponse.ok) {
            const comments = await commentResponse.json();
            updateCommentList(comments); // Update comment list
        } else {
            console.error("Failed to fetch comments");
        }
    } catch (err) {
        console.error("Error fetching comments:", err);
    }

    // Handle posting a new comment
    document.getElementById("submit-comment").addEventListener("click", async () => {
        const commentText = document.getElementById("new-comment").value;

        if (!commentText) return; // Don't post empty comments

        try {
            const commentResponse = await fetch(`/comments`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ post_id: post.id, content: commentText }),
            });

            if (commentResponse.ok) {
                const updatedComments = await commentResponse.json();
                updateCommentList(updatedComments); // Update comment list with new comments
            } else {
                alert("Failed to post comment");
            }
        } catch (err) {
            console.error("Error posting comment:", err);
        }
    });

    document.getElementById("back-button").addEventListener("click", () => {
        renderHome(); // Return to the main post list
    });

    // Render the comment list
    function updateCommentList(comments) {
        const commentList = document.getElementById("comment-list");
        commentList.innerHTML = ''; // Clear the existing list

        comments.forEach(comment => {
            const commentItem = document.createElement("li");
            commentItem.className = "comment-item";
            commentItem.innerHTML = `
                <span class="comment-username">${comment.username}</span>: 
                <span class="comment-content">${comment.content}</span>
            `;
            commentList.appendChild(commentItem);
        });
    }
}
