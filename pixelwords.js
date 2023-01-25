let lang
let mode = 'pencil'

var verbContext = {}

//var verb
//var person
//var tense

var hovered = []

// Set up canvas
function setUpCanvas() {
    let pxls = 32

    // set the little canvas height and width to the amount of pixels
    cvs.width = pxls
    cvs.height = pxls

    // set the big canvas height and width to an upscaled version
    canvas.width = pxls * 4
    canvas.height = pxls * 4


    // set up the guide grid and match to pixels
    for (let i = 0; i < pxls ** 2; i++) {
        cell = document.createElement('div')
        guide.appendChild(cell)
    }
    guide.style.gridTemplateColumns = `repeat(${pxls}, 1fr)`
    guide.style.gridTemplateRows = `repeat(${pxls}, 1fr)`
}

let img = new Image
let source = cvs.toDataURL()

// Handle the canvas mouse movements

function handleCanvasMousedown(e) {
    e.preventDefault()

    // get big canvas x and y
    let trueRatio = canvas.getBoundingClientRect().width / cvs.width
    let mouseX = Math.floor(e.offsetX / trueRatio)
    let mouseY = Math.floor(e.offsetY / trueRatio)
    
    // determin action based on the active tool
    switch (mode) {
        case 'pan' : pan(e); break
        case 'pencil' : pencil(mouseX, mouseY); break
        case 'eraser' : clearCell(mouseX, mouseY); break
        case 'eyedropper' : chooseColor(document.getElementById(getCellColor(mouseX, mouseY))); break
        case 'changeBackground' : break
        case 'zoom' : scaleCanvas(e); break
    }
}

// Saving and loading functionality
function loadVariablesFromLocalStorage() {

    // load the dark mode variable
    switch (localStorage.getItem('darkMode')) {
        case 'true' : darkMode = true; setDarkMode(); break
        case 'false': darkMode = false; break
        default : darkMode = false
    }

    // load the language variable
    switch (localStorage.getItem('lang')) {
        case 'en' : lang = [en]; break
        case 'de' : lang = [de]; break
        default : lang = [en]
    }

    // set up stack and history strings
    let cellStackString = localStorage.getItem('cellStack')
    let cellHistoryString = localStorage.getItem('cellHistory')

    // parse the strings into JSON objects
    if (cellStackString != null) cellStack = JSON.parse(cellStackString)
    if (cellHistoryString != null) cellHistory = JSON.parse(cellHistoryString)
}
function saveVariablesToLocalStorage() {

    // save the stack and history as strings
    localStorage.setItem('cellStack', JSON.stringify(cellStack))
    localStorage.setItem('cellHistory', JSON.stringify(cellHistory))

    // save dark mode
    localStorage.setItem('darkMode', darkMode)

    // save the current language
    switch (lang[0].name) {
        case 'english' : localStorage.setItem('lang', 'en'); break
        case 'german' : localStorage.setItem('lang', 'de'); break
    }
}

// Set up context box
function setUpContent() {

    // set up variables
    let sidebar = document.getElementById('sidebar')
    let personClue, verbClue, tenseClue, contextClue

    //depending on the language, set the variable to the correct languaeg words
    switch (lang[0].name) {
        case 'english' : personClue = '"who: "'; verbClue = '"what: "'; tenseClue = '"when: "'; contextClue = '"how: "'; break
        case 'german' : personClue = '"wer: "'; verbClue = '"was: "'; tenseClue = '"wenn: "'; contextClue = '"wie: "'; break
    }

    // set the css variables
    sidebar.style.setProperty('--person', personClue)
    sidebar.style.setProperty('--verb', verbClue)
    sidebar.style.setProperty('--tense', tenseClue)
    sidebar.style.setProperty('--context', contextClue)
}

// Popup Window Functions

function createWindow(id) {

    // create the whole window, add to html body, set id, class, 
    let popupWindow = document.createElement('div')
    document.body.appendChild(popupWindow)
    popupWindow.id = id
    popupWindow.className = 'window outsetBorder'
    if (darkMode) popupWindow.classList.add('darkmode')
    popupWindow.onmousedown = dragWindow

    // create the reference window close button
    let closeButton = document.createElement('button')
    popupWindow.appendChild(closeButton)
    closeButton.id = 'closeButton'
    closeButton.innerHTML = '&times;'

    // start event listener for when the close button is clicked
    closeButton.onmousedown = function() {closeRef(window.event.target)}

    //create the popup window content area

    let contentArea = document.createElement('div')
    popupWindow.appendChild(contentArea)
    contentArea.className = 'contentArea'

    return id = {
        popupWindowKey : popupWindow,
        closeButtonKey : closeButton,
        contentAreaKey : contentArea
    }
}

function createURLPromptWindow() {
    let e = createWindow('promptURL')

    let promptURLInputWrapper = document.createElement('div')
    e.contentAreaKey.appendChild(promptURLInputWrapper)
    promptURLInputWrapper.className = 'text insetBorder'
    if (darkMode) promptURLInputWrapper.classList.add('darkmode')


    let promptURLInput = document.createElement('input')
    promptURLInputWrapper.appendChild(promptURLInput)
    promptURLInput.id = 'promptURLInput'
    promptURLInput.className = 'text'
    promptURLInput.placeholder = 'Paste an image URL here!'

    promptURLInput.onkeyup = loadFromURL
}

// Load reference image from URL
function loadFromURL() {

    // if key is not 'enter' don't do anything
    if (window.event.keyCode != 13) return

    // get the image link, or 
    let imageLink = promptURLInput.value
    if (!imageLink) imageLink = 'https://openseauserdata.com/files/4b507ea31a058216e79455493232b40a.jpg'
    closeRef(window.event.target.parentNode.parentNode)
    createRefWindow()
    reference.setAttribute("src", imageLink)
}

// Reference window handlers
function createRefWindow(imageLink) {

    let e = createWindow('referenceWindow')
    let contentArea = e.contentAreaKey

    // create the reference window canvas area container
    let referenceAreaWrapper = document.createElement('div')
    contentArea.appendChild(referenceAreaWrapper)
    referenceAreaWrapper.className = 'field insetBorder'

    referenceArea = document.createElement('div')
    referenceAreaWrapper.appendChild(referenceArea)
    referenceArea.id = 'referenceArea'
    referenceArea.className = 'overflow'

    // create the reference window image
    reference = document.createElement('img')
    referenceArea.appendChild(reference)
    reference.id = 'reference'
    reference.addEventListener("mousedown", handleReferenceImgMousedown)
}
function dragWindow(e) {

    // get a list of all windows onscreen
    let windows = document.querySelectorAll('.window')
    let isWindow

    //check target against list to see if it is a window
    windows.forEach(element =>  {
        if (e.target === element) isWindow = true 
    })

    //if not a window, don't do anything
    if (!isWindow) return

    e = e || window.event

    //prevent highlighting while dragging the window
    e.preventDefault()

    let shiftX = e.clientX - e.target.getBoundingClientRect().left
    let shiftY = e.clientY - e.target.getBoundingClientRect().top

    e.target.style.position = 'absolute'
    e.target.style.zIndex = 1000
    function moveAt(pageX, pageY) {
        e.target.style.left = pageX - shiftX + 'px'
        e.target.style.top = pageY - shiftY + 'px'
    }
    moveAt(e.pageX, e.pageY)
    function onMouseMove(event) {
        moveAt(event.pageX, event.pageY)
    }
    document.addEventListener('mousemove', onMouseMove)
    e.target.onmouseup = function() {
        document.removeEventListener('mousemove', onMouseMove)
        e.target.onmouseup = null
    }
}
function closeRef(target) {
    target.parentNode.remove()
}
function handleReferenceImgMousedown(e) {
    e.preventDefault()

    switch (mode) {
        case 'zoom' : scaleCanvas(e)
    }
}

// Pencil tool -- Highlight the cells to be confirmed
let cellStack = {}      // This is where I keep the highlighted cells waiting to be colored
let cellHistory = {}    // This is where I keep a list of all the cells that have been colored

function pencil(x, y) {

    // check if cell has already been colored with the same color
    if (getCellColor(x, y) === chosenColor) return

    // check if cell has already been highlighted and if so, remove the highlight
    if (cellStack[`${x}_${y}`]) {
        clearCell(x, y)
        return
    }

    // Check if we've already placed three cells
    if (Object.keys(cellStack).length === 3) {textBox.focus(); return}

    addToCellStack(x, y)
    
    // Fill cells with a transparent color version of the selected color
    ctx.fillStyle = chosenColor + 50
    ctx.fillRect(x, y, 1, 1)
    source = cvs.toDataURL()
    renderImage()
    
    // Get a verb, person, tense, and context on the first highlighted cell
    if (Object.keys(cellStack).length === 1) randomize()
    if (Object.keys(cellStack).length > 2) textBox.focus()
}

// Manage our cell stack object to track our three selected cells
function addToCellStack(x, y) {
    cellStack[`${x}_${y}`] = {
        x : x,
        y : y,
        color : chosenColor
    }
    //localStorage.setItem('cellStack', JSON.stringify(cellStack))
}
function removeFromCellStack(x, y) {
    delete cellStack[`${x}_${y}`]
    //localStorage.setItem('cellStack', JSON.stringify(cellStack))
}

// Manage cell history
function addToCellHistory(x, y, color) {
    cellHistory[`${x}_${y}`] = {
        x : x,
        y : y,
        color : color
    }
    //localStorage.setItem('cellHistory', JSON.stringify(cellHistory))
}
function removeFromCellHistory(x, y) {
    delete cellHistory[`${x}_${y}`]
    //localStorage.setItem('cellHistory', JSON.stringify(cellHistory))
}

// Confirm the cell after user correctly conjugates verb
function confirmCell() {

    Object.keys(cellStack).forEach(key => {

        let x = cellStack[key].x
        let y = cellStack[key].y
        let color = cellStack[key].color

        addToCellHistory(x, y, color)
        removeFromCellStack(x, y)

        ctx.fillStyle = color
        ctx.fillRect(x, y, 1, 1)
        source = cvs.toDataURL()
        renderImage()
    })
}

// Clears the cell
function clearCell(x, y) {

    removeFromCellStack(x, y)
    removeFromCellHistory(x, y)
    if (Object.keys(cellStack).length === 0) {verbContext = {}; populateContextBox(); deconstructHint()}
    
    ctx.clearRect(x, y, 1, 1)
    source = cvs.toDataURL()
    renderImage()
}

// Gets cell color from cellHistory
function getCellColor(x, y) {
    if (cellHistory[`${x}_${y}`] === undefined) return
    return cellHistory[`${x}_${y}`].color
}

// Renders the hidden canvas onto the onscreen canvas
function renderImage() {
    img.src = source
    img.onload = () => {
        context.clearRect(0, 0, canvas.width, canvas.height)
        drawCanvas()
    }
}

function drawCanvas() {
    context.imageSmoothingEnabled = false
    context.drawImage(img, 0, 0, canvas.width, canvas.height)
}

function loadCanvas() {
    Object.keys(cellHistory).forEach(cell => {
        ctx.fillStyle = cellHistory[cell].color
        ctx.fillRect(cellHistory[cell].x, cellHistory[cell].y, 1, 1)
    })
    Object.keys(cellStack).forEach(cell => {
        ctx.fillStyle = cellStack[cell].color+50
        ctx.fillRect(cellStack[cell].x, cellStack[cell].y, 1, 1)
    })
    source = cvs.toDataURL()
    renderImage()
    if (Object.keys(cellStack).length != 0) randomize()
    if (Object.keys(cellStack).length > 2) textBox.focus()
}

// Change canvas background color
function changeBackgroundColor(target) {
    backgroundColor = target.id
    canvas.style.backgroundColor = backgroundColor
}

// Switch between tool types
function toolHandler(tool) {
    mode = tool
}

// pan handler
function pan(e) {

    let target = e.target.parentElement.parentElement
    let left = target.scrollLeft
    let top = target.scrollTop
    let mouseX = e.clientX
    let mouseY = e.clientY

    function onMouseMove(e) {
        let dx = e.clientX - mouseX
        let dy = e.clientY - mouseY

        target.scrollLeft = left - dx
        target.scrollTop = top - dy
    }
    function onMouseUp(e) {
        document.removeEventListener('mousemove', onMouseMove)
        document.removeEventListener('mouseup', onMouseUp)
    }
    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseup', onMouseUp)
}

// clear the canvas
function clearCanvas() {
    ctx.clearRect(0, 0, cvs.height, cvs.width)
    source = cvs.toDataURL()
    renderImage()
    Object.keys(cellStack).forEach(key => {
        let x = cellStack[key].x
        let y = cellStack[key].y
        removeFromCellStack(x, y)
    })
    Object.keys(cellHistory).forEach(key => {
        let x = cellHistory[key].x
        let y = cellHistory[key].y
        removeFromCellHistory(x, y)
    })
}

// adjust the zoom on both the main canvas and the reference canvas
function scaleCanvas(e) {

    // get the canvas clicked on
    let target = e.target
    if (target === canvas) target = canvasWrapper
    let tarWidth
    let tarHeight

    // Zoom in
    if (!e.ctrlKey) {
        tarWidth = target.getBoundingClientRect().width * 1.1       // multiply the onscreen target width by 110%
        tarHeight = target.getBoundingClientRect().height * 1.1     // multiply the onscreen target height by 110%
    }

    // zoom out if the control key is pressed
    if (e.ctrlKey) {
        tarWidth = target.getBoundingClientRect().width * 0.9
        tarHeight = target.getBoundingClientRect().height * 0.9
    }

    target.style.maxWidth = 'none'
    target.style.maxHeight = 'none'
    target.style.width = `${tarWidth}px`
    target.style.height = `${tarHeight}px`

    if (target === canvasWrapper) {
        guide.style.width = `${tarWidth}px`
        guide.style.height = `${tarHeight}px`
    }
}

// Light mode / Dark mode setting
let darkMode

function toggleDarkMode() {
    darkMode = darkMode ? false : true
    setDarkMode()
}
function setDarkMode() {

    document.body.classList.toggle('darkmode')
    windows = document.querySelectorAll('.window')
    windows.forEach(win => {
        win.classList.toggle('darkmode')
    })
    containers = document.querySelectorAll('.container')
    containers.forEach(container => {
        container.classList.toggle('darkmode')
    })
    texts = document.querySelectorAll('.text')
    texts.forEach(text => {
        text.classList.toggle('darkmode')
    })
    canvas.classList.toggle('darkmode')
    fields = document.querySelectorAll('.field')
    fields.forEach(field => {
        field.classList.toggle('darkmode')
    })
}

// Change the language

function changeLang() {
    switch(lang[0].name) {
        case 'german' : lang = [en]; break
        case 'english' : lang = [de]; break
    }
    loadLang()
    setUpContent()
}

function loadLang() {
    switch(lang[0].name) {
        case 'german' : lang = [de]; break
        default : lang = [en]; break
    }
    if (Object.keys(cellStack).length != 0) randomize()
    if (Object.keys(cellStack).length > 2) textBox.focus()
}

// Expand and contract the hintbox
function expand(target) {
    let content = target.nextElementSibling
    if (content.style.display === "flex") {
        content.style.display = "none"
    } else {
        content.style.display = "flex"

    }
}

// Key and mouse functionality

function hover(target) {
    hovered.push(target)
    if (hovered.length === 2) {
        hovered[0].classList.toggle('hovered')
        hovered.splice(0,1)
    }
    hovered[0].classList.toggle('hovered')
}

function paletteMousedown(target) {
    switch (mode) {
        case 'pencil' :
        case 'eraser' :
        case 'eyedropper': chooseColor(target); break;
        case 'changeBackground': changeBackgroundColor(target); break;
    }
}

function keyup(e) {
    switch (e.keyCode) {
        case 90 : if (e.ctrlKey) undo(); break;
        case 13 : e.preventDefault(); textBox.value != "" ? confirm() : pencil(); return false;
        case 46 : erase(); break;
        case 37 : 
        case 38 :
        case 39 :
        case 40 :
            e.ctrlKey ? arrowKeyPaintHandler(e) : arrowKeyPixelHandler(e);
        default : return
    }
}

function arrowKeyPixelHandler(event) {
    if (Object.keys(cellStack).length === 3) return
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

function confirm() {
    let checks = lang[0].conjugate(...Object.values(lang[0].verbs[verbContext.verb]),verbContext.person,verbContext.tense[0]).split(",")
    let check = ''
    for (i=0;i<checks.length;i++) {
        check = '(?<![\\u0080-\\uFFFF\\w])(' + checks[i].replace(/\s/g, ')(?![\\u0800-\\uFFFF])+[\\s/\\S]+(?<![\\u0080-\\uFFFF\\w])(') + ')(?![\\u0800-\\uFFFF])'
        checkExp = new RegExp(check,'g')
        console.log(checks,check)
        if (checkExp.test(textBox.value)) {
            confirmCell()
            verbBox.placeholder = ""
            textBox.value = ""
            textBox.blur()
            verbContext = {}
            populateContextBox()
            deconstructHint()
        }
    }
}

function undo() {
    
    let stackCells = Object.keys(cellStack)
    let historyCells = Object.keys(cellHistory)

    if (stackCells.length) {
        let lastCell = stackCells[stackCells.length - 1]
        clearCell(cellStack[lastCell].x, cellStack[lastCell].y)
    } else if (historyCells.length) {
        let lastCell = historyCells[historyCells.length -1]
        clearCell(cellHistory[lastCell].x, cellHistory[lastCell].y)
    } else return
}
function erase() {
    hovered[0].removeAttribute('data-color')
    hovered[0].style.removeProperty('background-color')
    localStorage.removeItem(hovered[0].id)
}
function randomize(vrb) {

    deconstructHint()

    // get random verb, tense, and person
    verbContext.verb = lang[0].getRandomVerb()
    verbContext.tense = lang[0].getRandomTense()
    verbContext.person = lang[0].getRandomPerson()

    verbContext.prn = lang[0].getPronoun(verbContext.person)

    verbContext.when = lang[0].tenses[verbContext.tense[0]][verbContext.tense[1]].when
    verbContext.context = lang[0].tenses[verbContext.tense[0]][verbContext.tense[1]].context
    verbContext.phrase = lang[0].tenses[verbContext.tense[0]][verbContext.tense[1]].phrase.replace('[prs]',verbContext.prn)

    checkDisalloweds()
    
    {
        populateContextBox()

        // construct the hint box based on the verb provided.
        constructHint(verbContext.verb)
    }

    function checkDisalloweds() {
        if (lang[0].dissalloweds.some(phr => (verbContext.verb + " " + verbContext.tense).includes(phr))) {
            verbContext.tense = lang[0].getRandomTense()
            checkDisalloweds()
        }
        return
    }
}

// set the verb context fields and the text box hint phrase
function populateContextBox() {
    personField.innerHTML = verbContext.prn || ''
    verbField.innerHTML = verbContext.verb || ''
    tenseField.innerHTML = verbContext.when || ''
    contextField.innerHTML = verbContext.context || ''

    textBox.placeholder = verbContext.phrase || ''
}

// construct the hint box content; both the elements, and the information
function constructHint() {
    let hintObject = {}
    hintObject = lang[0].getPrincipleParts(verbContext.verb)
    for (i = 0; i < Object.keys(hintObject).length; i++) {
        hintSubBox = document.createElement('pre')
        hintcontent.appendChild(hintSubBox)
        hintSubBox.id = Object.keys(hintObject)[i]
        hintSubBox.innerHTML = Object.values(hintObject)[i]
    }
}

// remove and reset the hint box so that it has no elements, and returns to closed.
function deconstructHint() {
    hintcontent.innerHTML = ''
    hintcontent.style.display = 'none'
}