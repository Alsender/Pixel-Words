var toBePainted = []
var toBeUndone = []
var counter = 0

var verb
var person
var tense

function loadFromURL(){
    let imageLink = prompt("","enter a URL here")
    console.log(imageLink)
    canvas.style.removeProperty("background-color")
    canvas.style.backgroundImage = "url(" + imageLink + ")"
}
function chooseColor(target) {
    if (document.querySelectorAll('.activeColor').length != 0) {
        document.querySelectorAll('.activeColor')[0].classList.toggle('activeColor')
    }
    chosenColor = crayola[(target.id).substring(5)]
    target.classList.toggle('activeColor')
}
function paint(target) {
    for (i = 0; i < toBePainted.length; i++) {
        if (target === toBePainted[i]) {
            remove(target)
            return
        }
    }
    if (counter === 0) {
        randomize()
    }
    if (counter < 3) {
        if (chosenColor === undefined) {
            return
        } else
        toBePainted.push(target)
        target.dataset.color = chosenColor
        target.style.backgroundColor = chosenColor+50
        counter++
        toBeUndone.push(target)
    }
}
function keyup(event) {
    if (event.keyCode === 90 && event.ctrlKey) undo();
    else if (event.keyCode === 13) confirm();
    else return
}
function confirm() {
    let checks = conjugate(...Object.values(verbs[verb]),person,tense).split(",")
    let check = ''
    for (i=0;i<checks.length;i++) {
        check = '(\\b' + checks[i].replace(/\s/g, '\\b)+[\\s/\\S]+(\\b') + '\\b)'
        checkExp = new RegExp(check,'g')
        console.log(checks,check)
        if (checkExp.test(textBox.value)) {
            for (i = 0; i <= toBePainted.length - 1; i++) {
                toBePainted[i].style.backgroundColor = toBePainted[i].dataset.color
            }
            toBePainted = []
            toBeUndone = []
            counter = 0
            verbBox.innerHTML = ""
            textBox.placeholder = ""
            textBox.value = ""
        }
    }
}
function remove(target) {
    for (i = 0; i < toBePainted.length; i++) {
        if (target === toBePainted[i]) {
            counter--
            toBePainted.splice(i, 1)
            target.removeAttribute('data-color')
            target.style.removeProperty('background-color')
        }
    }
    return
}
function undo() {
    target = toBeUndone[toBeUndone.length - 1]
    toBeUndone.splice(toBeUndone.length - 1, 1)
    remove(target)
}