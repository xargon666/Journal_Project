(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
// search button script
// index.html
const ind = require('./index.js')
const siteBackendUrl = `https://journal-project-backend.herokuapp.com`;
// const siteBackendUrl = `http://localhost:3000`;

function hideMainToggle() {
  if (mainWrapper.style.display != "none") {
    mainWrapper.style.display = "none";
  } else {
    mainWrapper.style.display = mainWrapperDisplayState;
  }
}

// function applyPostEvent() {}

// index
function getAllPosts() {
  //remove existing posts
  while (document.querySelector(".wrapper").firstElementChild) {
        document.querySelector(".wrapper").firstElementChild.remove();
  }
  // pull data and run appendPosts
  const route = "/posts";
  fetch(`${siteBackendUrl}${route}`)
    .then((r) => r.json())
    .then(appendPosts)
    .catch(console.warn);
}

function getPost(id) {
  const route = `/posts/:${id}`;
  fetch(`${siteBackendUrl}${route}`)
    .then((r) => r.json())
    .then(appendPosts)
    .catch(console.warn);
}

// create
function createPost(e) {
  e.preventDefault()
  const route = "/posts";
  const np = document.querySelector('#postForm');
  let postTitle;
  let postBody;
  let postLink;
  try {
    postTitle = np.querySelector('#postTitle').value;
    postBody = np.querySelector('#postContent').value;
    if (!postTitle || !postBody){
      throw new Error("The post container no text content")
    }
  }
  catch(err){
    alert(err)
    return
  } 

  np.querySelector('#newPostFormImg') && (postLink = np.querySelector('#newPostFormImg').src);
  
  let postData = {
      title: postTitle,
      body: postBody,
      link: postLink,
  };
  console.log(JSON.stringify(postData))

  const options = {
    method: "POST",
    body: JSON.stringify(postData),
    headers: {
      "Content-Type": "application/json",
    },
  };
  fetch(`${siteBackendUrl}${route}`, options)
  .then((r) => r.json())
  .then(data =>{
      console.log("posting content...")
      getAllPosts()
    })
    .catch(console.warn);    
}

function deletePost(postId) {
  const route = "/posts";
}

function createComment(postId, commentBodyText) {
  const route = "/posts/comments";

  const postData = {
    post: {
      "id": postId
    },
    comment: {
      "body": commentBodyText
    },
  };

  const options = {
    method: "POST",
    body: JSON.stringify(postData),
    headers: {
      "Content-Type": "application/json",
    },
  };

  fetch(`${siteBackendUrl}${route}`, options)
    .then((r) => r.json())
    .catch(console.warn);
}

function sendReact(postId, emojiId) {
  const route = "/posts/emojis";

  const postData = {
    post: {
      id: postId,
    },
    emoji: String(emojiId),
  };

  const options = {
    method: "POST",
    // body: postData,
    body: JSON.stringify(postData),
    headers: {
      "Content-Type": "application/json",
    },
  };

  fetch(`${siteBackendUrl}${route}`, options)
    .then((r) => r.json())
    .catch(console.warn);
}

// helpers
function appendPosts(posts) {
  posts.forEach(appendPost);
}

function appendPost(postData) {
  const mainWrapper = document.querySelector(".wrapper");
  // Create Post Elements
  let newPost = document.createElement("div");
  let newPostWrapper = document.createElement("div");
  let newPostTitle = document.createElement("h2");
  let newPostBody = document.createElement("p");
  let newPostComments = document.createElement("p");
  let newPostDateTime = document.createElement("p");
  let newPostReactions = document.createElement("div");
  let newGiphy = document.createElement("img");
  newPost.classList.add("post");
  newPostWrapper.classList.add("postWrapper");
  newPostTitle.className = "postTitle";
  newPostBody.className = "preview";
  newPostComments.classList.add("comments");
  newPostDateTime.classList.add("dateTime");
  newPostReactions.classList.add("reactions");

  let laugh = document.createElement("p");
  let thumbsUp = document.createElement("p");
  let hankey = document.createElement("p");
  laugh.classList.add("roflCount");
  laugh.classList.add("reaction");
  thumbsUp.className = "thumbsUpCount";
  thumbsUp.classList.add("reaction");
  hankey.className = "hankeyCount";
  hankey.classList.add("reaction");

  let commentsBody = document.createElement('div');
  commentsBody.className = 'commentsBodyHidden';
  let header = document.createElement('h3');
  header.textContent = 'Comments';
  let commentForm = document.createElement('form');
  commentForm.className = 'commentForm';
  let commentLabel = document.createElement('label');
  commentLabel.textContent = 'Enter your comment:';
  commentLabel.htmlFor = 'commentInput' + postData.id;
  let commentInput = document.createElement('textarea');
  commentInput.id = 'commentInput' + postData.id;
  commentInput.className = 'commentInput';
  commentInput.maxLength = '250';
  let commentSubmitBtn = document.createElement('button');
  commentSubmitBtn.className = 'commentSubmitBtn';
  commentSubmitBtn.textContent = 'Submit Comment';


  // Populate
  postData.id && newPost.setAttribute("id", postData.id);
  postData.title && (newPostTitle.textContent = postData.title);
  postData.body &&
    (newPostBody.textContent = postData.body); // create preview from message body
  postData.comments &&
    (newPostComments.textContent = `Comments: ${postData.comments.length}`);
  postData.date && (newPostDateTime.textContent = postData.date);
  if (postData.reactions) {
    if (postData.reactions.laugh) {
      laugh.textContent += `${postData.reactions.laugh} 🤣`;
      laugh.addEventListener("click", () => {
        sendReact(postData.id, 0);
        laugh.textContent = `${parseInt(laugh.textContent, 10) + 1} 🤣`;
      });
    }
    if (postData.reactions.thumbUp) {
      thumbsUp.textContent += `${postData.reactions.thumbUp} 👍`;
      thumbsUp.addEventListener("click", () => {
        sendReact(postData.id, 1);
        thumbsUp.textContent = `${parseInt(thumbsUp.textContent, 10) + 1} 👍`;
      });
    }
    if (postData.reactions.poo) {
      hankey.textContent += `${postData.reactions.poo} 💩`;
      hankey.addEventListener("click", () => {
        sendReact(postData.id, 2);
        hankey.textContent = `${parseInt(hankey.textContent, 10) + 1} 💩`;
      });
    }
  }

  // Append
  //   newPostTitle.appendChild("a");
  if (newPostBody.textContent && newPostTitle.textContent) {
    newPostWrapper.appendChild(newPostTitle);
    newPostWrapper.appendChild(newPostBody);
    newPostWrapper.appendChild(newPostComments);
    newPostWrapper.appendChild(newPostDateTime);
    newPostReactions.appendChild(laugh);
    newPostWrapper.appendChild(newGiphy);
    newPostReactions.appendChild(thumbsUp);
    newPostReactions.appendChild(hankey);
    newPostWrapper.appendChild(newPostReactions);
    newPost.appendChild(newPostWrapper);

    commentForm.appendChild(commentLabel);
    commentForm.appendChild(commentInput);
    commentForm.appendChild(commentSubmitBtn);
    commentsBody.appendChild(header);
    commentsBody.appendChild(commentForm);

    for (let i = 0; i < postData.comments.length; i++) {
      let comment = postData.comments[i];
      let thisComment = document.createElement("p");
      thisComment.textContent = comment.body;
      thisComment.id = comment.postRef;
      let thisDate = document.createElement("p");
      thisDate.textContent = 'Commented on ' + comment.date;
      commentsBody.appendChild(thisDate);
      commentsBody.appendChild(thisComment);
    }

    newPost.insertAdjacentElement("beforeEnd", commentsBody);

    mainWrapper.insertAdjacentElement("afterBegin", newPost);
    // add comments interface
    newPostComments.addEventListener("click", e => {
      commentsBody.classList.toggle('commentsBody');
    })

    commentSubmitBtn.addEventListener("click", e=>{
      e.preventDefault();
      if(commentInput.value!=""){
        createComment(postData.id, commentInput.value);

        
      }
    })
  }
}

module.exports = {
  getAllPosts,
  createPost,
  sendReact,
}

},{"./index.js":2}],2:[function(require,module,exports){
const app = require('./app');
document.addEventListener("DOMContentLoaded", init);

function init() {
    // Fetch all posts as soon as app is loaded
    app.getAllPosts();
    const newPostBtn = document.querySelector(".newPostBtn");
    const cancelPostBtn = document.querySelector("#cancelBtn");
    const addGifBtn = document.querySelector("#addGifBtn");

    // giphy API key
    let APIKEY = "T20UHWhHXbf47QtXnYSnHXJrYkeOXam3";

    // create post button
    newPostBtn.addEventListener('click', (e) => {
        document.getElementById("createPost").style.display = 'flex';
        document.getElementById("formBg").style.display = 'block';
        newPostBtn.classList.toggle("newPostBtnDisabled", true);
        
        // send post data
        const postForm = document.querySelector("#createPost > #postForm > form")
        postForm.addEventListener('submit',(e) => {
            app.createPost(e)
            closeCreatePost(e)
        })
        
        // giphy
        addGifBtn.addEventListener('click', (e) => {
            e.preventDefault();
            document.getElementById("gifForm").style.display = 'block';
        });

        document.getElementById("btnSearch").addEventListener("click", e => {
            e.preventDefault(); //to stop the page reload
            let url = `https://api.giphy.com/v1/gifs/search?api_key=${APIKEY}&limit=1&q=`;
            let str = document.getElementById("gifSearch").value.trim();
            url = url.concat(str);
            fetch(url)
                .then(response => response.json())
                .then(content => {
                    //  data, pagination, meta
                    if (document.getElementById("newPostFormImg")) {
                        let img = document.getElementById("newPostFormImg");
                        img.src = content.data[0].images.downsized.url;
                        img.alt = content.data[0].title;
                    }
                    else {
                        let img = document.createElement("img");
                        img.id = 'newPostFormImg';
                        img.src = content.data[0].images.downsized.url;
                        img.alt = content.data[0].title;
                        let out = document.querySelector("#gifForm");
                        out.insertAdjacentElement("afterend", img);
                    }
                    document.querySelector("#gifSearch").value = "";
                })
                .catch(err => {
                    console.error(err);
                });
        });

        cancelPostBtn.addEventListener('click', (e) => {
            closeCreatePost(e)
        });
    });    

    function closeCreatePost(e){
        console.log("closing create post window")
        e.preventDefault();
        document.getElementById("createPost").style.display = 'none';
        document.getElementById("formBg").style.display = 'none';
        newPostBtn.classList.toggle("newPostBtnDisabled", false);
        if (document.getElementById("newPostFormImg")) {
            document.getElementById("newPostFormImg").remove();
        }
    }

    module.exports = { closeCreatePost, }
}



},{"./app":1}]},{},[2]);
