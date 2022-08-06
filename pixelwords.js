var toBePainted = []
var toBeUndone = []
var counter = 0

var verb
var person
var tense

var hovered = []

// SETTINGS BUTTONS

function loadFromURL() {
    let imageLink = prompt("","enter a URL here")
    console.log(imageLink)
    canvas.style.removeProperty("background-color")
    canvas.style.backgroundImage = "url(" + imageLink + ")"
}
function load() {
    for (i = 0; i < 32*32; i++) {
        document.getElementById(i).style.backgroundColor = localStorage[i]
    }
}
function save() {
    for (i = 0; i < 32*32; i++) {
        if (document.getElementById(i).dataset.color != undefined) {
            localStorage[i] = document.getElementById(i).dataset.color
        }
    }
}
function clear() {
    for (i = 0; i < 32*32; i++) {
        document.getElementById(i).removeAttribute('data-color')
        document.getElementById(i).style.removeProperty('background-color')
        localStorage.removeItem(i)
    }
}

//KEY / MOUSE FUNCTIONALITY

function hover(target) {
    hovered.push(target)
    if (hovered.length === 2) {
        hovered[0].classList.toggle('hovered')
        hovered.splice(0,1)
    }
    hovered[0].classList.toggle('hovered')
}
function keyup(event) {
    switch (event.keyCode) {
        case 90 : if (event.ctrlKey) undo(); break;
        case 13 : event.preventDefault(); textBox.value != "" ? confirm() : paint(); return false;
        case 46 : erase(); break;
        case 37 : 
        case 38 :
        case 39 :
        case 40 :
            event.ctrlKey ? arrowKeyPaintHandler(event) : arrowKeyPixelHandler(event);
        default : return
    }
}
function arrowKeyPixelHandler(event) {
    if (counter === 3) {return}
    else
    event.preventDefault()
    let hoveredID = hovered[0].id
    switch (event.keyCode) {
        case 37 : if ((hoveredID/32)%1 != 0) {
            hover(document.getElementById(parseInt(hoveredID) - 1))
        } break
        case 38 : if (hoveredID > 31) {
            hover(document.getElementById(parseInt(hoveredID) - 32))
        } break
        case 39 : if ((hoveredID/32)%1 != 0.96875) {
            hover(document.getElementById(parseInt(hoveredID) + 1))
        } break
        case 40 : if (hoveredID < 991) {
            hover(document.getElementById(parseInt(hoveredID) + 32))
        } break
    }
}
function arrowKeyPaintHandler(event) {
    event.preventDefault()
    let chosenColorID = document.querySelectorAll('.activeColor')[0].id.substring(5)
    switch (event.keyCode) {
        case 37 : if ((chosenColorID/8)%1 != 0) {
            chooseColor(document.getElementById('color' + (parseInt(chosenColorID) - 1)))
        } break
        case 38 : if (chosenColorID > 7) {
            chooseColor(document.getElementById('color' + (parseInt(chosenColorID) - 8)))
        } break
        case 39 : if ((chosenColorID/8)%1 != 0.875) {
            chooseColor(document.getElementById('color' + (parseInt(chosenColorID) + 1)))
        } break
        case 40 : if (chosenColorID < 56) {
            chooseColor(document.getElementById('color' + (parseInt(chosenColorID) + 8)))
        } break
    }
}

function chooseColor(target) {
    if (document.querySelectorAll('.activeColor').length != 0) {
        document.querySelectorAll('.activeColor')[0].classList.toggle('activeColor')
    }
    chosenColor = crayola[(target.id).substring(5)]
    target.classList.toggle('activeColor')
}
function paint() {
    for (i = 0; i < toBePainted.length; i++) {
        if (hovered[0] === toBePainted[i]) {
            remove(hovered[0])
            return
        }
    }
    switch (counter) {
        case 0 : randomize()
        case 1 :
        case 2 : {
            if (chosenColor != undefined) {
                toBePainted.push(hovered[0])
                hovered[0].dataset.color = chosenColor
                hovered[0].style.backgroundColor = chosenColor+50
                counter++
                toBeUndone.push(hovered[0])
                if (counter === 3) {textBox.focus()}
            }
        }
        case 3 : break;
    }
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
                localStorage.setItem(toBePainted[i].id, toBePainted[i].dataset.color)
            }
            toBePainted = []
            toBeUndone = []
            counter = 0
            verbBox.placeholder = ""
            textBox.placeholder = ""
            textBox.value = ""
            textBox.blur()
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
function erase() {
    hovered[0].removeAttribute('data-color')
    hovered[0].style.removeProperty('background-color')
    localStorage.removeItem(hovered[0].id)
}

/** NOTES
 * change canvas background color
 * change canvas background pos/scale/rot
 */