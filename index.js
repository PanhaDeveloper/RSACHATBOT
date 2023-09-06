const chatbotToggler = document.querySelector(".chatbot-toggler");
const closeBtn = document.querySelector(".close-btn");
const chatbox = document.querySelector(".chatbox");
const chatInput = document.querySelector(".chat-input textarea");
const sendChatBtn = document.querySelector(".chat-input span");
let userMessage = null;
function gcd(a, b) {
  if (b === 0) {
    return a;
  }
  return gcd(b, a % b);
}

function isPrime(number) {
  if (number < 2) {
    return false;
  }
  for (let i = 2; i <= Math.sqrt(number); i++) {
    if (number % i === 0) {
      return false;
    }
  }
  return true;
}

function modReverse(e, phi) {
  for (let d = 3; d < phi; d++) {
    if ((d * e) % phi === 1) {
      return d;
    }
  }
  throw new Error("modReverse does not exist");
}

function encrypt(message, e, n) {
  const messageEncode = Array.from(message).map((ch) => ch.charCodeAt(0));
  const cipherText = messageEncode.map(
    (ch) => BigInt(ch) ** BigInt(e) % BigInt(n)
  );
  return cipherText;
}

function decrypt(cipherText, d, n) {
  const messageDecode = cipherText.map(
    (ch) => BigInt(ch) ** BigInt(d) % BigInt(n)
  );
  const decryptedMessage = messageDecode
    .map((ch) => String.fromCharCode(Number(ch)))
    .join("");
  return decryptedMessage;
}

let p = localStorage.getItem("p");
let q = localStorage.getItem("q");
let e = localStorage.getItem("e");

if (!p || !q) {
  // If p and q are not stored in localStorage, generate new ones
  p = 137; // Fixed prime number p
  q = 157; // Fixed prime number q
  // Store p and q in localStorage for future use
  localStorage.setItem("p", p);
  localStorage.setItem("q", q);
}

if (!e) {
  const phiN = (q - 1) * (p - 1);
  e = Math.floor(Math.random() * (phiN - 1 - 3 + 1)) + 3;
  while (gcd(e, phiN) !== 1) {
    e = Math.floor(Math.random() * (phiN - 1 - 3 + 1)) + 3;
  }

  // Store e in localStorage for future use
  localStorage.setItem("e", e);
} else {
  e = parseInt(e, 10); // Parse the stored e as an integer
}

const n = p * q;
const phiN = (q - 1) * (p - 1);
const d = modReverse(e, phiN);
function gcd(a, b) {
  if (b === 0) {
    return a;
  }
  return gcd(b, a % b);
}
const inputInitHeight = chatInput.scrollHeight;
const createChatLi = (message, className) => {
  const chatLi = document.createElement("li");
  chatLi.classList.add("chat", `${className}`);
  let chatContent =
    className === "outgoing"
      ? `<p>${message}</p>`
      : `<span class="material-symbols-outlined">person</span><p>${message}</p>`;
  chatLi.innerHTML = chatContent;
  return chatLi;
};
const handleChat = () => {
  let d = modReverse(e, phiN);

  alert(`Public Key = ${e}`);
  alert(`Private Key = ${d}`);

  userMessage = chatInput.value.trim();
  let cipherText = encrypt(userMessage, e, n);

  sessionStorage.setItem("privateKey", d);
  sessionStorage.setItem("nValue", n);

  if (!userMessage) return;

  chatInput.value = "";
  chatInput.style.height = `${inputInitHeight}px`;
  const outgoingCiphertext = cipherText.join(", ");
  const outgoingCiphertextLi = createChatLi(outgoingCiphertext, "outgoing");
  chatbox.appendChild(outgoingCiphertextLi);
  chatbox.scrollTo(0, chatbox.scrollHeight);
  setTimeout(() => {
    const button = document.createElement("button");
    button.textContent = "click to decrypt message";
    button.style.border = "none";
    button.style.textTransform = "uppercase";
    button.style.cursor = "pointer";
    button.style.backgroundColor = "transparent";
    const incomingChatLi = createChatLi(button.outerHTML, "incoming");
    chatbox.appendChild(incomingChatLi);
    chatbox.scrollTo(0, chatbox.scrollHeight);
  }, 600);
};
chatbox.addEventListener("click", (event) => {
  const target = event.target;
  if (target.tagName === "BUTTON") {
    let privateKey = prompt("Input Private Key");
    let nValue = sessionStorage.getItem("nValue");
    let cipherText = prompt("Input Cipher Text :").split(",").map(Number);
    let decryptedMessage = decrypt(cipherText, privateKey, nValue);
    alert(decryptedMessage);
  }
});
chatInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey && window.innerWidth > 800) {
    e.preventDefault();
    handleChat();
  }
});
sendChatBtn.addEventListener("click", handleChat);
closeBtn.addEventListener("click", () => {
  document.body.classList.remove("showchatbot");
});
chatbotToggler.addEventListener("click", () => {
  document.body.classList.toggle("show-chatbot");
});

// window.addEventListener("load", function() {
//   // Show the spinner
//   document.getElementById("spinner").style.display = "block";

//   // Hide the content initially
//   document.body.style.display = "none";

//   // Simulate a 2-second delay
//   setTimeout(function() {
//     // Hide the spinner
//     document.getElementById("spinner").style.display = "none";

//     // Show the content
//     document.body.style.display = "block";
//   }, 4000);
// });