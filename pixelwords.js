let lang
let mode = 'pencil'

var verbContext = {}

//var verb
//var person
//var tense

var hovered = {}

let canvas  = document.getElementById('canvas') // big canvas
let context = canvas.getContext('2d')

let cvsImage = document.createElement('canvas') // image canvas
let ctxImage = cvsImage.getContext('2d')

let cvsSelected = document.createElement('canvas') // selected cells canvas
let ctxSelected = cvsSelected.getContext('2d')

let cvsHighlighted = document.createElement('canvas') // highlighted cells canvas
let ctxHighlighted = cvsHighlighted.getContext('2d')

// Set up canvas
let pxls = {
    width: 32,
    height: 32
}
function setUpCanvas() {

    // set the big canvas wrapper aspect ratio
    canvasWrapper.style.aspectRatio = `${pxls.width} / ${pxls.height}`
    if (pxls.width / pxls.height >= 1) {
        canvasWrapper.style.width = '95%'; canvasWrapper.style.height = 'auto'
        guide.style.width = '95%'; guide.style.height = 'auto'
    }
    if (pxls.width / pxls.height < 1) {
        canvasWrapper.style.width = 'auto'; canvasWrapper.style.height = '95%'
        guide.style.width = 'auto'; guide.style.height = '95%'
    }

    // set the little canvases height and width to the amount of pixels
    cvsImage.width =  cvsSelected.width = cvsHighlighted.width = pxls.width
    cvsImage.height = cvsSelected.height = cvsHighlighted.height = pxls.height

    // set the big canvas height and width to an upscaled version
    canvas.width = pxls.width * 4
    canvas.height = pxls.height * 4


    // set up the guide grid and match to pixels
    for (let i = 0; i < pxls.width * pxls.height; i++) {
        cell = document.createElement('div')
        guide.appendChild(cell)
    }
    guide.style.gridTemplateColumns = `repeat(${pxls.width}, 1fr)`
    guide.style.gridTemplateRows = `repeat(${pxls.height}, 1fr)`
    guide.style.aspectRatio = `${pxls.width} / ${pxls.height}`
    //guide.style.width = `${pxls.width * 4}px`
    //guide.style.height = `${pxls.height * 4}px`
}

let img = new Image
let source = cvsImage.toDataURL()

// Handle the canvas mouse movements

function getXY(e) {
    // get big canvas x and y
    let trueRatio = canvas.getBoundingClientRect().width / cvsImage.width
    let mouseX = Math.floor(e.offsetX / trueRatio)
    let mouseY = Math.floor(e.offsetY / trueRatio)
    return {x: mouseX, y: mouseY}
}

function handleCanvasMousemove(e) {
    e.preventDefault()

    let mouse = getXY(e)
    if (
        document.activeElement.nodeName === 'INPUT' ||
        Object.keys(cellStack).length === 3
    ) clearHover()
    else switch (mode) {
        case 'pan' : break
        case 'pencil' :
        case 'eraser' :
        case 'eyedropper' : hover(mouse.x, mouse.y); break
        case 'changeBackground' : break
        case 'zoom' : break
    }
}

function handleCanvasMousedown(e) {
    e.preventDefault()

    let mouse = getXY(e)
    
    // determine action based on the active tool
    switch (mode) {
        case 'pan' : pan(e); break
        case 'pencil' : pencil(mouse.x, mouse.y); break
        case 'eraser' : clearCell(mouse.x, mouse.y); break
        case 'eyedropper' : chooseColor(document.getElementById(getCellColor(mouse.x, mouse.y))); break
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
        case 'fr' : lang = [fr]; break
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
        case 'french' : localStorage.setItem('lang', 'fr'); break
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
        case 'french' : personClue = '"qui: "'; verbClue = '"quoi: "'; tenseClue = '"quand: "'; contextClue = '"comment: "'; break
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
    promptURLInput.type = 'text'
    promptURLInput.name = 'promptURLInput'
    promptURLInput.id = 'promptURLInput'
    promptURLInput.className = 'text'
    promptURLInput.placeholder = 'Paste an image URL here!'
    promptURLInput.focus()

    promptURLInput.onkeyup = loadFromURL
}

// Load reference image from URL
function loadFromURL() {

    // if key is not 'enter' don't do anything
    if (window.event.keyCode != 13) return

    // get the image link, or 
    let imageLink = promptURLInput.value
    if (!imageLink) imageLink = 'https://openseauserdata.com/files/4b507ea31a058216e79455493232b40a.jpg'
    promptURLInput.onkeyup = null
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
    if (darkMode) referenceAreaWrapper.classList.add('darkmode')

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
    if (Object.keys(cellStack).length === 3) {canvasNotFocused(); textBox.focus(); return}

    addToCellStack(x, y)
    
    // Fill cells with a transparent color version of the selected color
    ctxImage.fillStyle = chosenColor + 50
    ctxImage.fillRect(x, y, 1, 1)
    source = cvsImage.toDataURL()
    renderImage()
    
    // Get a verb, person, tense, and context on the first highlighted cell
    if (Object.keys(cellStack).length === 1) randomize()
    if (Object.keys(cellStack).length > 2) {canvasNotFocused(); textBox.focus()}
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

        ctxImage.fillStyle = color
        ctxImage.fillRect(x, y, 1, 1)
        source = cvsImage.toDataURL()
        renderImage()
    })
}

// Clears the cell
function clearCell(x, y) {

    removeFromCellStack(x, y)
    removeFromCellHistory(x, y)
    if (Object.keys(cellStack).length === 0) {verbContext = {}; populateContextBox(); deconstructHint()}
    
    ctxImage.clearRect(x, y, 1, 1)
    source = cvsImage.toDataURL()
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
    context.drawImage(cvsImage, 0, 0, canvas.width, canvas.height)
    context.drawImage(cvsSelected, 0, 0, canvas.width, canvas.height)
    context.drawImage(cvsHighlighted, 0, 0, canvas.width, canvas.height)
}

function loadCanvas() {
    Object.keys(cellHistory).forEach(cell => {
        ctxImage.fillStyle = cellHistory[cell].color
        ctxImage.fillRect(cellHistory[cell].x, cellHistory[cell].y, 1, 1)
    })
    Object.keys(cellStack).forEach(cell => {
        ctxImage.fillStyle = cellStack[cell].color+50
        ctxImage.fillRect(cellStack[cell].x, cellStack[cell].y, 1, 1)
    })
    source = cvsImage.toDataURL()
    renderImage()
    if (Object.keys(cellStack).length != 0) randomize()
    if (Object.keys(cellStack).length > 2) {canvasNotFocused(); textBox.focus()}
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
    ctxImage.clearRect(0, 0, cvsImage.height, cvsImage.width)
    source = cvsImage.toDataURL()
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
        tarWidth = target.offsetWidth * 1.1       // multiply the onscreen target width by 110%
        tarHeight = target.offsetHeight * 1.1     // multiply the onscreen target height by 110%
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
        canvas.style.width = `${tarWidth}px`
        canvas.style.height = `${tarHeight}px`
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
        case 'english' : lang = [fr]; break
        case 'french' : lang = [de]; break
    }
    loadLang()
    setUpContent()
}

function loadLang() {
    switch(lang[0].name) {
        case 'german' : lang = [de]; break
        case 'french' : lang = [fr]; break
        default : lang = [en]; break
    }
    if (Object.keys(cellStack).length != 0) randomize()
    if (Object.keys(cellStack).length > 2) {canvasNotFocused(); textBox.focus()}
}

// Settings dialog window

function createSettingsWindow() {
    let e = createWindow('settingsWindow')

    let contentArea = e.contentAreaKey

    contentArea.insertAdjacentHTML('beforeend', `
    <div class="setWrap">Language
        <div class="setWrap">
            <div>English
                <input type="checkbox" name="EnglishCheck" id="EnglishCheck">
            </div>
            <div>German
                <input type="checkbox" name="GermanCheck" id="GermanCheck">
            </div>
        </div>
    </div>
    <div class="setWrap">Dark Mode
        <div class="setWrap">
            <input type="checkbox" name="darkModeCheck" id="darkModeCheck">
        </div>
    </div>
    <div class="setWrap">Canvas
        <div class="setWrap">
            <div style="padding: 20px 0px">Width
                <div class="text insetBorder digitInput">
                    <input type="text" name="widthInput" id="widthInput" class="text">
                </div>
            </div>
            <div style="padding: 20px 0px">Height
                <div class="text insetBorder digitInput">
                    <input type="text" name="heightInput" id="heightInput" class="text">
                </div>
            </div>
        </div>
    </div>
    `)

    // get variables of window elements
    var EnglishCheck = document.getElementById('EnglishCheck')
    var GermanCheck = document.getElementById('GermanCheck')
    var FrenchCheck = document.getElementById('FrenchCheck')

    var darkModeCheck = document.getElementById('darkModeCheck')

    var widthInput = document.getElementById('widthInput')
    var heightInput = document.getElementById('heightInput')

    // populate window elements with appropriate values
    switch (lang[0].name) {
        case 'english' : EnglishCheck.checked = true; GermanCheck.checked = false; FrenchCheck.checked = false; break
        case 'german' : EnglishCheck.checked = false; GermanCheck.checked = true; FrenchCheck.checked = false; break
        case 'french' : EnglishCheck.checked = false; GermanCheck.checked = false; FrenchCheck.checked = true; break
    }

    switch (darkMode) {
        case true : darkModeCheck.checked = true; break
        case false : darkModeCheck.checked = false; break
    }

    widthInput.value = pxls.width
    heightInput.value = pxls.height
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

function hover(x, y) {
    ctxHighlighted.clearRect(0, 0, cvsHighlighted.width, cvsHighlighted.height)
    hovered = {x: undefined, y: undefined}
    ctxHighlighted.fillStyle = darkMode ? '#FFFFFF50' : '#00000050'
    ctxHighlighted.fillRect(x, y, 1, 1)
    hovered = {x: x, y: y}
    source = cvsHighlighted.toDataURL()
    renderImage()
}

function clearHover() {
    ctxHighlighted.clearRect(0, 0, cvsHighlighted.width, cvsHighlighted.height)
    source = cvsHighlighted.toDataURL()
    renderImage()
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
    switch (e.key) {
        case 'z' : if (e.ctrlKey) undo(); break;
        case 'Enter' : e.preventDefault(); textBox.value != "" ? confirm() : pencil(hovered.x, hovered.y); return false;
        case 'Delete' : erase(); break;
        case 'ArrowLeft' : 
        case 'ArrowUp' :
        case 'ArrowRight' :
        case 'ArrowDown' :
            e.ctrlKey ? arrowKeyPaintHandler(e) : arrowKeyPixelHandler(e);
        default : return
    }
}

function textboxKeyup (event) {
    if (event.key === 'Enter') confirm()
}

function arrowKeyPixelHandler(event) {
    if (Object.keys(cellStack).length === 3) return
    else
    event.preventDefault()

    switch (event.key) {
        case 'ArrowUp'   : if (hovered.y > 0) hover(hovered.x, --(hovered.y)); break
        case 'ArrowDown' : if (hovered.y < (pxls.height - 1)) hover(hovered.x, ++(hovered.y)); break
        case 'ArrowLeft' : if (hovered.x > 0) hover(--(hovered.x), hovered.y); break
        case 'ArrowRight': if (hovered.x < (pxls.width - 1)) hover(++(hovered.x), hovered.y); break
    }
}

function arrowKeyPaintHandler(event) {
    event.preventDefault()
    let chosenColorID = document.querySelectorAll('.activeColor')[0].id
    switch (event.key) {
        case 'ArrowLeft' : if ((chosenColorID/8)%1 != 0) {
            chooseColor(document.getElementById((parseInt(chosenColorID) - 1)))
        } break
        case 'ArrowUp' : if (chosenColorID > 7) {
            chooseColor(document.getElementById((parseInt(chosenColorID) - 8)))
        } break
        case 'ArrowRight' : if ((chosenColorID/8)%1 != 0.875) {
            chooseColor(document.getElementById((parseInt(chosenColorID) + 1)))
        } break
        case 'ArrowDown' : if (chosenColorID < 56) {
            chooseColor(document.getElementById((parseInt(chosenColorID) + 8)))
        } break
    }
}

function chooseColor(target) {
    if (document.querySelectorAll('.activeColor').length != 0) {
        document.querySelectorAll('.activeColor')[0].classList.toggle('activeColor')
    }
    chosenColor = crayola[target.id]
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

// debug function to get all event listeners

function listAllEventListeners() {
    const allElements = Array.prototype.slice.call(document.querySelectorAll('*'));
    allElements.push(document);
    allElements.push(window);
  
    const types = [];
  
    for (let ev in window) {
      if (/^on/.test(ev)) types[types.length] = ev;
    }
  
    let elements = [];
    for (let i = 0; i < allElements.length; i++) {
      const currentElement = allElements[i];
      for (let j = 0; j < types.length; j++) {
        if (typeof currentElement[types[j]] === 'function') {
          elements.push({
            "node": currentElement,
            "type": types[j],
            "func": currentElement[types[j]].toString(),
          });
        }
      }
    }
  
    return elements.sort(function(a,b) {
      return a.type.localeCompare(b.type);
    });
  }