var toBePainted = []
var counter = 0

function chooseColor(target) {
    if (document.querySelectorAll('.activeColor').length != 0) {
        document.querySelectorAll('.activeColor')[0].classList.toggle('activeColor')
    }
    chosenColor = crayola[(target.id).substring(5)]
    target.classList.toggle('activeColor')
}
function choose2ndColor(target) {
    if (document.querySelectorAll('.active2ndColor').length != 0) {
        document.querySelectorAll('.active2ndColor')[0].classList.toggle('active2ndColor')
    }
    chosen2ndColor = crayola[(target.id).substring(5)]
    target.classList.toggle('active2ndColor')
}
function paint(target) {
    if (target.dataset.color == chosenColor) {
        target.style.removeProperty('background-color')
        counter--
        return
    } else
    if (counter < 3) {
        if (chosenColor === undefined) {
            return
        } else
        toBePainted.push(target)
        target.dataset.color = chosenColor
        target.style.backgroundColor = chosenColor+50
        counter++
    }
}
function paint2nd(target) {
    if (target.dataset.color == chosen2ndColor) {
        target.style.removeProperty('background-color')
        counter--
        return
    } else
    if (counter < 3) {
        if (chosen2ndColor === undefined) {
            return
        } else
        toBePainted.push(target)
        target.dataset.color = chosen2ndColor
        target.style.backgroundColor = chosen2ndColor+50
        counter++
    }
}
function confirm() {
    for (i = 0; i <= toBePainted.length - 1; i++) {
        toBePainted[i].style.backgroundColor = toBePainted[i].dataset.color
    }
    toBePainted = []
    counter = 0
}