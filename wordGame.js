const header = document.querySelector(".header")
const loadingAnimation = document.querySelector(".loading-animation");
const boxes = [...document.querySelectorAll(".cubic-displaybox")]   // each row has five columns
const firstRow  =  boxes.slice(0,5)  
const secondRow =  boxes.slice(5,10)  
const thirdRow  =  boxes.slice(10,15)  
const fourthRow =  boxes.slice(15,20)
const fifthRow  =  boxes.slice(20,25)
const sixthRow  =  boxes.slice(25, 30)
const boxRows = [firstRow,secondRow,thirdRow,fourthRow,fifthRow,sixthRow]
let theRightWord=""
let outerCounter = 0;
let innerCounter = 0;
function handleKey(event)
{
    if(event.key=="Backspace"&& innerCounter>0)
    {
        innerCounter--
        boxRows[outerCounter][innerCounter].innerText=""
    }
    else if(isLetter(event.key)&&innerCounter<=4)
    {
        boxRows[outerCounter][innerCounter].innerText=event.key
        innerCounter++
    }
    else if(event.key=="Enter" && innerCounter===5)
    {
        wordCheck(getTheWord(boxRows[outerCounter]),boxRows[outerCounter])
    }
    else
    {
        event.preventDefault()
    }
}
const RIGHT_WORD_URL = "https://words.dev-apis.com/word-of-the-day?random=1";
async function fetchRightWord()
{
    const promise = await fetch(RIGHT_WORD_URL)
    const wordObj = await promise.json()
    theRightWord=wordObj.word
    console.log(theRightWord)
}
function init()
{
    fetchRightWord()
    document.addEventListener("keydown",handleKey)
}
const VALIDATE_WORD="https://words.dev-apis.com/validate-word"
async function wordCheck(word,row)
{
    setLoading(true)
    const inputWord=
    {
        "word": word
    }
    const promise1 = await fetch(VALIDATE_WORD,{method:"POST",body:JSON.stringify(inputWord)})
    const responce = await promise1.json()
    if(responce.validWord)
    {
        removeFlashEffect(row)
        matchingLetters(word,theRightWord,row)
        if(word===theRightWord)
        {
            alert("you win")
            header.style.animation="rainbow  3s infinite linear"
            document.removeEventListener("keydown",handleKey)
        }
        else if(outerCounter===5)
        {
            alert(`you lost , the word was ${theRightWord.toUpperCase()}`)
            document.removeEventListener("keydown",handleKey)
        }
        else
        {
            outerCounter++
            innerCounter=0
        }
    }
    else
    {
        flashEffect(row)   
    }
    setLoading(false)

}
function flashEffect(row)
{
    for(element of row)
        {
            element.style.animation = "none"; // Reset the animation
            void element.offsetWidth;         // Trigger reflow to restart animation
            element.style.animation = "flash 1s";
        }
}
function removeFlashEffect(row)
{
    for(element of row)
        {
            element.style.animation="none"
        }
}
function getTheWord(row)
{
    word=""
    for(element of row)
    {
        word+=element.innerText.toLowerCase()
    }
    return word
}
function isLetter(letter) 
{
    return /^[a-zA-Z]$/
    .test(letter);
}
function matchingLetters(inputWord,rightWord,row)
{
    for(let index = 0 ; index < 5 ; index ++)
    {
        if(rightWord.includes(inputWord[index]))
        {
            if(rightWord[index]===inputWord[index])
            {
                row[index].style.backgroundColor="rgb(53, 108, 53)"
            }
            else
            {
                if(count(rightWord,inputWord[index]) != count(inputWord,inputWord[index]))
                    row[index].style.backgroundColor="grey"
                else
                    row[index].style.backgroundColor="rgb(186, 147, 74)"
            }
        }
        else
        {
            row[index].style.backgroundColor="grey"
        }
    }
}
function count(array ,element)
{
  let numOfOccurance = 0
  for(index of array)
  {
    if(index===element)
      numOfOccurance++
  }
  return numOfOccurance
}
function setLoading(force)
{
    loadingAnimation.classList.toggle("hidden",!force)
}
init()