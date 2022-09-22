var toBePainted = []
var toBeUndone = []
var counter = 0
var backgroundColor = "#fffaf0"
var mode = 'pencil'

var verb
var person
var tense

var hovered = []

// SETTINGS BUTTONS

function loadFromURL() {
    let imageLink = prompt("","enter a URL here")
    createRefWindow()
    reference.setAttribute("src", imageLink)
}
function createRefWindow() {
    referenceWindow = document.createElement("div")
    canvasArea.appendChild(referenceWindow)
    referenceWindow.id = 'referenceWindow'
    referenceWindow.onmousedown = function() {dragWindow(event)}
    referenceWindow.ondragstart = function() {return false}

    closeButton = document.createElement('button')
    referenceWindow.appendChild(closeButton)
    closeButton.id = 'closeButton'
    closeButton.onmousedown = function() {closeRef(event)}

    referenceArea = document.createElement('div')
    referenceWindow.appendChild(referenceArea)
    referenceArea.id = 'referenceArea'

    reference = document.createElement('img')
    referenceWindow.appendChild(reference)
    reference.id = 'reference'
}
function dragWindow(event) {
    let shiftX = event.clientX - event.target.getBoundingClientRect().left
    let shiftY = event.clientY - event.target.getBoundingClientRect().top

    event.target.style.position = 'absolute'
    event.target.style.zIndex = 1000
    function moveAt(pageX, pageY) {
        event.target.style.left = pageX - shiftX + 'px'
        event.target.style.top = pageY - shiftY + 'px'
    }
    moveAt(event.pageX, event.pageY)
    function onMouseMove(event) {
        moveAt(event.pageX, event.pageY)
    }
    document.addEventListener('mousemove', onMouseMove)
    referenceWindow.onmouseup = function() {
        document.removeEventListener('mousemove', onMouseMove)
        referenceWindow.onmouseup = null
    }
}
function closeRef(event) {
    event.target.parentNode.remove()
}
function clearReference() {
    canvas.style.removeProperty("background-image")
    canvas.style.backgroundColor = backgroundColor
}
function changeBackgroundColor(target) {
    backgroundColor = target.id
    canvas.style.backgroundColor = backgroundColor
}
function toolHandler(tool) {
    mode = tool
}
function load() {
    for (i = 0; i < 32*32; i++) {
        document.getElementById(i).style.backgroundColor = localStorage[i]
        document.getElementById(i).dataset.color = localStorage[i]
    }
}
function save() {
    for (i = 0; i < 32*32; i++) {
        if (document.getElementById(i).dataset.color != undefined) {
            localStorage[i] = document.getElementById(i).dataset.color
        }
    }
}
function clearCanvas() {
    for (i = 0; i < 32*32; i++) {
        document.getElementById(i).removeAttribute('data-color')
        document.getElementById(i).style.removeProperty('background-color')
        localStorage.removeItem(i)
    }
}
function scaleBG(mod) {
    let scale = getComputedStyle(canvas).getPropertyValue('--scale').slice(0, -1)
    if (mod === '++') {scale++}
    if (mod === '--') {scale--}
    canvas.style.setProperty("--scale", scale + '%')
}
function moveBGVert(mod) {
    let vertPos = getComputedStyle(canvas).getPropertyValue('--vert').slice(0, -1)
    if (mod === '++') {vertPos++}
    if (mod === '--') {vertPos--}
    canvas.style.setProperty('--vert', vertPos + '%')
}
function moveBGHorz(mod) {
    let horzPos = getComputedStyle(canvas).getPropertyValue('--horz').slice(0, -1)
    if (mod === '++') {horzPos++}
    if (mod === '--') {horzPos--}
    canvas.style.setProperty('--horz', horzPos + '%')
}

function expand(target) {
    var content = target.nextElementSibling
    if (content.style.display === "block") {
        content.style.display = "none"
    } else {
        content.style.display = "block"

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
function canvasMousedown() {
    switch (mode) {
        case 'pencil' : paint(); break;
        case 'eraser' : erase(); break;
        case 'eyedropper': chooseColor(document.getElementById(hovered[0].dataset.color)); break; 
        case 'changeBackground': break;
    }
}
function paletteMousedown(target) {
    switch (mode) {
        case 'pencil' :
        case 'eraser' :
        case 'eyedropper': chooseColor(target); break;
        case 'changeBackground': changeBackgroundColor(target); break;
    }
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
    chosenColor = target.id
    target.classList.toggle('activeColor')
}
function eyedropper() {
    chosenColor = hovered[0].dataset.color
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
    let checks = conjugate(verb, ...Object.values(verbs[verb]),person,tense).split(",")
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
function randomize(vrb){
    if (vrb === undefined) v = Object.keys(verbs)[Math.floor(Math.random() * Object.keys(verbs).length)]
    t = randomTense()
    p = Object.keys(persons)[Math.floor(Math.random() * Object.keys(persons).length)]
    switch (p) {
        case 'thirdSg': prn = Object.values(persons.thirdSg)[Math.floor(Math.random() * 2)]; break;
        case 'thirdPl' : prn = Object.values(persons.thirdPl)[Math.floor(Math.random() * 1)]; break;
        default : prn = persons[p]
    }
    if (dissalloweds.some(phr => (v + " " + t).includes(phr))) {
        randomize(v)
    } else {
        verb = v
        person = p
        tense = t
        personField.innerHTML = prn
        verbField.innerHTML = v
        tenseField.innerHTML = tenses[t][1]
        contextField.innerHTML = tenses[t][2]
        textBox.placeholder = tenses[t][0].replace('[prs]',prn)
        hintButton.title = conjugate(v, ...Object.values(verbs[verb]),person,tense)
        var hint = Object.values(verbs[verb])
        hintverb.innerHTML = verb
        hintenglish.innerHTML = hint[0]
        hintpres.innerHTML = hint[2]
        hintpast.innerHTML = hint[3]
        hintpastPart.innerHTML = hint[4]
        hintsubj.innerHTML = hint[5]
    }
}

function constructHint(v) {
    let hint = {}
    hint[v] = {}
    for (let t in tenses) {
        hint[v][t] = []
        for (let p in persons) {
            switch (p) {
                case 'thirdSg': for (let g in persons.thirdSg) {hint[v][t].push(persons.thirdSg[g] + " " + conjugate(v, ...Object.values(verbs[v]), p, t))}; break;
                case 'thirdPl' : for (let g in persons.thirdPl) {hint[v][t].push(persons.thirdPl[g] + " " + conjugate(v, ...Object.values(verbs[v]), p, t))}; break;
                default : hint[v][t].push(persons[p] + " " + conjugate(v, ...Object.values(verbs[v]), p, t))
            }
        }
    }
    hintcontent.innerHTML = JSON.stringify(hint, null, 1)
}