const userInput = document.querySelector(".input-area textarea");
const sendBtn = document.querySelector(".input-area span");
const chatBox = document.querySelector(".chatbox");
const chatboxToggler = document.querySelector(".chatbot-toggler");
const smCloseBtn = document.querySelector(".sm-close-btn");

let userMessage;
const API_TOKEN= "AIzaSyACp0yVn5laKluNdB8abZiQZ3L2wVqahfI";
const userInputInitHeight = userInput.scrollHeight;



function createChatList(message,className){
    const ChatLi = document.createElement("li");
    ChatLi.classList.add("chat",className);
    let chatContent = className=== "outgoing-chat"?
    `<p></p>`:
    `<span class="material-symbols-outlined">smart_toy</span><p></p>`;
    ChatLi.innerHTML = chatContent;
    ChatLi.querySelector("p").textContent=message;
    userInput.value = "";
    userInput.style.height=`${userInputInitHeight}px`;
    return ChatLi;
}

function generateResponse(incomingChatList){
    let API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key="+API_TOKEN;
    let generatedMessage = incomingChatList.querySelector("p");

    const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          contents: [{ 
            role: "user", 
            parts: [{ text: userMessage }] 
          }] 
        }),
      };

      fetch(API_URL,requestOptions)
      .then(res=>res.json())
      .then(data=>{
        console.log(data);
        generatedMessage.textContent = data.candidates[0].content.parts[0].text;
        console.log(generatedMessage);
      })
      .catch(error=>{
        console.log(error);
        generatedMessage.textContent="Looks like you are offline!";
      }).finally(()=>chatBox.scrollTo(0,chatBox.scrollHeight));
}

function handleChat(){
    userMessage  = userInput.value.trim();
    if(!userMessage){
        return;
    }
    else{
        chatBox.appendChild(createChatList(userMessage,"outgoing-chat"));
        chatBox.scrollTo(0,chatBox.scrollHeight)

        setTimeout(()=>{
            const incomingChatList = createChatList("Thinking","incoming-chat");
            chatBox.appendChild(incomingChatList)
            chatBox.scrollTo(0,chatBox.scrollHeight)
            generateResponse(incomingChatList);        
        },600)
    }
   
}

chatBox.scrollTo(0,chatBox.scrollHeight);
sendBtn.addEventListener("click",handleChat);
userInput.addEventListener("keydown",(e)=>{
    if(e.key==="Enter"&&!e.shiftKey){
        e.preventDefault();
        sendBtn.click();
    }
})
chatboxToggler.addEventListener("click",()=>{
    document.body.classList.toggle("chatbot-show");
})
smCloseBtn.addEventListener("click",()=>{
    document.body.classList.remove("chatbot-show");
})
userInput.addEventListener("input",()=>{
    userInput.style.height=`${userInputInitHeight}px`;
    userInput.style.height = `${userInput.scrollHeight}px`;
});