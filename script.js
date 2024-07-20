document.getElementById('add-text-btn').addEventListener('click', () => {
    const textElement = document.createElement('div');
    textElement.classList.add('draggable');
    textElement.innerHTML = `
        <textarea class="text-content" placeholder="Type your text here..."></textarea>
        <button class="remove-text-btn btn btn-danger">Remove Text</button>
    `;
    document.getElementById('text-overlay').appendChild(textElement);

    makeTextDraggable(textElement);
    
    const textSizeSlider = document.getElementById('font-size-slider');
    const textColorInput = document.getElementById('text-color-picker');
    const textContent = textElement.querySelector('.text-content');

    textContent.style.fontSize = `${textSizeSlider.value}px`;
    document.getElementById('font-size-value').textContent = `${textSizeSlider.value}px`;

    textSizeSlider.addEventListener('input', () => {
        textContent.style.fontSize = `${textSizeSlider.value}px`;
        document.getElementById('font-size-value').textContent = `${textSizeSlider.value}px`;
    });

    textColorInput.addEventListener('input', () => {
        textContent.style.color = textColorInput.value;
    });

    const boldBtn = document.getElementById('bold-btn');
    const italicBtn = document.getElementById('italic-btn');
    const underlineBtn = document.getElementById('underline-btn');

    boldBtn.addEventListener('click', () => {
        textContent.style.fontWeight = textContent.style.fontWeight === 'bold' ? 'normal' : 'bold';
    });

    italicBtn.addEventListener('click', () => {
        textContent.style.fontStyle = textContent.style.fontStyle === 'italic' ? 'normal' : 'italic';
    });

    underlineBtn.addEventListener('click', () => {
        textContent.style.textDecoration = textContent.style.textDecoration === 'underline' ? 'none' : 'underline';
    });
});

document.getElementById('remove-text-btn').addEventListener('click', () => {
    const textElements = document.querySelectorAll('.text-overlay .draggable');
    if (textElements.length > 0) {
        document.getElementById('text-overlay').removeChild(textElements[textElements.length - 1]);
    } else {
        alert('No text elements to remove.');
    }
});
const makeTextDraggable = (element) => {
    element.addEventListener('mousedown', (e) => {
        const textContent = element.querySelector('.text-content');
        const rect = element.getBoundingClientRect();
        const offsetX = e.clientX - rect.left;
        const offsetY = e.clientY - rect.top;

        const moveHandler = (e) => {
            const cardRect = document.getElementById('card').getBoundingClientRect();
            const newLeft = e.clientX - cardRect.left - offsetX;
            const newTop = e.clientY - cardRect.top - offsetY;
            element.style.left = `${newLeft}px`;
            element.style.top = `${newTop}px`;
        };

        const stopHandler = () => {
            document.removeEventListener('mousemove', moveHandler);
            document.removeEventListener('mouseup', stopHandler);
        };

        document.addEventListener('mousemove', moveHandler);
        document.addEventListener('mouseup', stopHandler);
    });

    element.querySelector('.text-content').addEventListener('input', (e) => {
        e.target.style.width = 'auto';
    });

    element.querySelector('.remove-text-btn').addEventListener('click', () => {
        document.getElementById('text-overlay').removeChild(element);
    });
};

document.getElementById('bg-color-picker').addEventListener('input', function() {
    document.querySelector('.card-content').style.backgroundColor = this.value;
});

document.getElementById('font-select').addEventListener('change', function() {
    document.querySelectorAll('.text-overlay h1, .text-overlay p, .text-content').forEach(el => {
        el.style.fontFamily = this.value;
    });
});

document.getElementById('font-size-select').addEventListener('change', function() {
    document.querySelectorAll('.text-overlay h1, .text-overlay p, .text-content').forEach(el => {
        el.style.fontSize = this.value;
    });
});

document.getElementById('text-color-picker').addEventListener('input', function() {
    document.querySelectorAll('.text-overlay h1, .text-overlay p, .text-content').forEach(el => {
        el.style.color = this.value;
    });
});

document.getElementById('text-align-select').addEventListener('change', function() {
    document.querySelectorAll('.text-overlay h1, .text-overlay p, .text-content').forEach(el => {
        el.style.textAlign = this.value;
    });
});

document.getElementById('image-upload').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById('card-image').src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
});

document.getElementById('download-btn').addEventListener('click', function() {
    html2canvas(document.getElementById('card'), {scale: 2}).then(function(canvas) {
        const link = document.createElement('a');
        link.href = canvas.toDataURL('image/png');
        link.download = 'wedding_invitation_card.png';
        link.click();
    });
});

document.getElementById('undo-btn').addEventListener('click', () => {
    if (undoStack.length > 0) {
        const state = undoStack.pop();
        redoStack.push(state);
        const textOverlay = document.getElementById('text-overlay');
        while (textOverlay.firstChild) {
            textOverlay.removeChild(textOverlay.firstChild);
        }
        state.forEach(item => {
            const textElement = document.createElement('div');
            textElement.classList.add('draggable');
            textElement.innerHTML = item.html;
            textElement.style.left = item.left;
            textElement.style.top = item.top;
            textElement.querySelector('.text-content').style.fontSize = item.fontSize;
            textElement.querySelector('.text-content').style.color = item.color;
            textElement.querySelector('.text-content').style.fontWeight = item.fontWeight;
            textElement.querySelector('.text-content').style.fontStyle = item.fontStyle;
            textElement.querySelector('.text-content').style.textDecoration = item.textDecoration;
            textElement.querySelector('.text-content').style.textAlign = item.textAlign;
            textOverlay.appendChild(textElement);

            makeTextDraggable(textElement);
        });

        updateState();
        updateUndoRedoButtons();
    }
});
document.getElementById('redo-btn').addEventListener('click', () => {
    if (redoStack.length > 0) {
        const state = redoStack.pop();
        undoStack.push(state);
        const textOverlay = document.getElementById('text-overlay');
        while (textOverlay.firstChild) {
            textOverlay.removeChild(textOverlay.firstChild);
        }
        state.forEach(item => {
            const textElement = document.createElement('div');
            textElement.classList.add('draggable');
            textElement.innerHTML = item.html;
            textElement.style.left = item.left;
            textElement.style.top = item.top;
            textElement.querySelector('.text-content').style.fontSize = item.fontSize;
            textElement.querySelector('.text-content').style.color = item.color;
            textElement.querySelector('.text-content').style.fontWeight = item.fontWeight;
            textElement.querySelector('.text-content').style.fontStyle = item.fontStyle;
            textElement.querySelector('.text-content').style.textDecoration = item.textDecoration;
            textElement.querySelector('.text-content').style.textAlign = item.textAlign;
            textOverlay.appendChild(textElement);

            makeTextDraggable(textElement);
        });

        updateState();
        updateUndoRedoButtons();
    }
});
const undoStack = [];
const redoStack = [];
const updateState = () => {
    const textOverlay = document.getElementById('text-overlay');
    const state = Array.from(textOverlay.children).map(child => ({
        html: child.innerHTML,
        left: child.style.left,
        top: child.style.top,
        fontSize: child.querySelector('.text-content').style.fontSize,
        color: child.querySelector('.text-content').style.color,
        fontWeight: child.querySelector('.text-content').style.fontWeight,
        fontStyle: child.querySelector('.text-content').style.fontStyle,
        textDecoration: child.querySelector('.text-content').style.textDecoration,
        textAlign: child.querySelector('.text-content').style.textAlign
    }));
    undoStack.push(state);
    redoStack.length = 0; 
    updateUndoRedoButtons();
};

const updateUndoRedoButtons = () => {
    document.getElementById('undo-btn').disabled = undoStack.length === 0;
    document.getElementById('redo-btn').disabled = redoStack.length === 0;
};
updateState();
updateUndoRedoButtons();
