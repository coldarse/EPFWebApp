const Keyboard = {
    elements: {
        main: null,
        keysContainer: null,
        keys: [],
        activeElem: null,
        keyboardspace: null,
        startpos: null,
        endpos: null,
        currElemLength: null,
    },

    eventHandlers: {
        oninput: null,
        onclose: null
    },

    properties: {
        value: "",
        capsLock: false,
        tagname: "",
        className: "",
        maxChar: -1
    },

    init() {
        // Create main elements
        this.elements.main = document.createElement("div");
        this.elements.keysContainer = document.createElement("div");
        this.elements.keyboardspace = document.createElement("div");
        // Setup main elements
        this.elements.main.classList.add("keyboard", "keyboard--hidden");
        this.elements.keysContainer.classList.add("keyboard__keys");
        this.elements.keysContainer.appendChild(this._createKeys());
        this.elements.keyboardspace.classList.add("spaceHandling");
        this.elements.keys = this.elements.keysContainer.querySelectorAll(".keyboard__key");
        // Add to DOM
        this.elements.main.appendChild(this.elements.keysContainer);
        document.body.appendChild(this.elements.main);
        document.body.appendChild(this.elements.keyboardspace);
        // Automatically use keyboard for elements with .use-keyboard-input
        document.querySelectorAll(".use-keyboard-input").forEach(element => {
            element.addEventListener("focus", () => {
                this.open(element, currentValue => {
                    element.value = currentValue;
                });
            });
        });
    },

    _setActive() {
        try {
            this.elements.activeElem = document.activeElement.id;
            if (this.elements.activeElem != "") {
                var currElem = document.getElementById(this.elements.activeElem);
                this.elements.startpos = currElem.selectionStart;
                this.elements.endpos = currElem.selectionEnd;
                this.elements.currElemLength = currElem.value.length;
                currElem.scrollIntoView(true);
                currElem.scrollIntoView({
                block: 'center',
                });
                //console.log(currElem);
            }
        }
        catch (ex) {
            this.elements.startpos = null;
            this.elements.endpos = null;
        }
    },

    _createKeys() {
        const fragment = document.createDocumentFragment();
        const keyLayout = [
            "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "backspace", "done",
            "%", "q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "&",
            "caps", "a", "s", "d", "f", "g", "h", "j", "k", "l", "enter",
            "!", "_", "z", "x", "c", "v", "b", "n", "m", ",", ".", "@",
            "clear", "/", "space", "tab", "-", "$"
        ];

        // Creates HTML for an icon
        const createIconHTML = (icon_name) => {
            return `<i class="material-icons">${icon_name}</i>`;
        };

        keyLayout.forEach(key => {
            const keyElement = document.createElement("button");
            const insertLineBreak = ["done", "&", "enter", "@"].indexOf(key) !== -1;

            // Add attributes/classes
            keyElement.setAttribute("type", "button");
            keyElement.classList.add("keyboard__key");

            switch (key) {
                case "backspace":
                    keyElement.classList.add("keyboard__key--wide");
                    keyElement.innerHTML = createIconHTML("backspace");
                    keyElement.addEventListener("click", () => {
                        if (this.elements.startpos.toString() == this.elements.currElemLength.toString()) {
                            this.properties.value = this.properties.value.substring(0, this.properties.value.length - 1);
                        } else {
                            this.properties.value = this.properties.value.substring(0, this.elements.startpos - 1) + this.properties.value.substring(this.elements.startpos, this.properties.value.length);
                            this.elements.startpos -= 1;
                            this.elements.currElemLength = this.properties.value.length;
                        }
                        this._triggerEvent("oninput");
                    });
                    break;

                case "caps":
                    keyElement.classList.add("keyboard__key--wide", "keyboard__key--activatable");
                    keyElement.innerHTML = createIconHTML("keyboard_capslock");
                    keyElement.addEventListener("click", () => {
                        this._toggleCapsLock();
                        keyElement.classList.toggle("keyboard__key--active", this.properties.capsLock);
                    });
                    break;

                case "enter":
                    keyElement.classList.add("keyboard__key--wide");
                    keyElement.innerHTML = createIconHTML("keyboard_return");
                    keyElement.addEventListener("click", () => {
                        var x = document.forms.item(1);
                        var elements = x.elements;
                        for (var i = 0; i < elements.length; i++) {
                            if (this.elements.activeElem == elements[i].id) {
                                document.getElementById(elements[i + 1].id).focus();
                                this.elements.activeElem = elements[i + 1].id;
                                break;
                            }
                        }
                    });
                    break;

                case "space":
                    keyElement.classList.add("keyboard__key--extra-wide");
                    keyElement.innerHTML = createIconHTML("space_bar");
                    keyElement.addEventListener("click", () => {
                        if (this.elements.startpos.toString() == this.elements.currElemLength.toString()) {
                            this.properties.value += " ";
                        }
                        else {
                            this.properties.value = this.properties.capsLock ? this.properties.value.substring(0, this.elements.startpos) + " " + this.properties.value.substring(this.elements.startpos, this.properties.value.length) : this.properties.value.substring(0, this.elements.startpos) + " " + this.properties.value.substring(this.elements.startpos, this.properties.value.length);
                            this.elements.startpos += 1;
                            this.elements.currElemLength = this.properties.value.length;
                        }
                        this._triggerEvent("oninput");
                    });
                    break;

                case "tab":
                    keyElement.classList.add("keyboard__key--wide");
                    keyElement.innerHTML = createIconHTML("keyboard_tab");
                    keyElement.addEventListener("click", () => {
                        //console.log(this.elements.activeElem)
                        var x = document.forms.item(1);
                        var elements = x.elements;
                        for (var i = 0; i < elements.length; i++) {
                            if (this.elements.activeElem == elements[i].id) {
                                document.getElementById(elements[i + 1].id).focus();
                                this.elements.activeElem = elements[i + 1].id;
                                break;
                            }
                        }

                    });
                    break;

                case "clear":
                    keyElement.classList.add("keyboard__key--wide");
                    keyElement.innerHTML = createIconHTML("clear");
                    keyElement.addEventListener("click", () => {
                        this.properties.value = "";
                        this._triggerEvent("oninput");
                    });
                    break;



                case "done":
                    keyElement.classList.add("keyboard__key--wide", "keyboard__key--dark");
                    keyElement.innerHTML = createIconHTML("keyboard_hide");
                    keyElement.addEventListener("click", () => {
                        this.close();
                        this._triggerEvent("onclose");
                    });
                    break;

                default:
                    keyElement.textContent = key.toLowerCase();
                    keyElement.addEventListener("click", () => {
                        if (this.elements.startpos.toString() == this.elements.currElemLength.toString()) {
                            this.properties.value += this.properties.capsLock ? key.toUpperCase() : key.toLowerCase();
                        }
                        else {
                            this.properties.value = this.properties.capsLock ? this.properties.value.substring(0, this.elements.startpos) + key.toUpperCase() + this.properties.value.substring(this.elements.startpos, this.properties.value.length) : this.properties.value.substring(0, this.elements.startpos) + key.toLowerCase() + this.properties.value.substring(this.elements.startpos, this.properties.value.length);
                            this.elements.startpos += 1;
                            this.elements.currElemLength = this.properties.value.length;
                        }
                        this._limit(this.properties);
                        this._isSymbol(this.properties);
                        this._isNumeric(this.properties);
                        this._isCapitalField(this.properties);
                        this._triggerEvent("oninput");
                    });
                    break;
            }

            fragment.appendChild(keyElement);
            if (insertLineBreak) {
                fragment.appendChild(document.createElement("br"));
            }
        });
        return fragment;
    },

    _isCapitalField(element) {
        if (element.className.toLowerCase().includes("allcapitalletter")) {
            element.value = element.value.toUpperCase();
        }
    },
    _isNumeric(element) {
        if (element.className.toLowerCase().includes("numericonly")) {
            element.value = element.value.replace(/[^\d-]/g, '');
        }
    },
    _isSymbol(element) {
        if (element.className.toLowerCase().includes("nosymbol")) {
            element.value = element.value.replace(/[$-/:-?{-~!"^_`\[\]@]/, '');
        }

     
        // else if (element.tagname.toLowerCase().includes('securephrase')) { done
        //     element.value = element.value.replace(/[$-/:-?{-~!"^_`\[\]@]/, '');
        // }
        // else if (element.tagname.toLowerCase().includes('city')) { done
        //     element.value = element.value.replace(/[$-/:-?{-~!"^_`\[\]@]/, '');
        // }
    
       
       
        // else if (element.tagname.toLowerCase().includes('acctnum')) { done
        //     element.value = element.value.replace(/[$-/:-?{-~!"^_`\[\]@]/, '');
        // }
        // else if (element.tagname.toLowerCase().includes('password')) { done
        //     element.value = element.value.replace(/[$-/:-?{-~!"^_`\[\]@]/, '');
        // }
    },
    _limit(element) {
        var max_chars = 500;
        if (element.className.toLowerCase().includes("maxchar")) {
            max_chars = element.maxChar;
        }

        // if (element.tagname == null) {
        //     element.tagname = "";
        // }

        // if (element.tagname.toLowerCase().includes('phoneno')) { done
        //     max_chars = 16;
        // }
        // else if (element.tagname.toLowerCase().includes('homeno')) { done
        //     max_chars = 15;
        // }
        // else if (element.tagname.toLowerCase().includes('address_1')) { done
        //     max_chars = 41;
        // }
        // else if (element.tagname.toLowerCase().includes('address_2')) { done
        //     max_chars = 41;
        // }
        // else if (element.tagname.toLowerCase().includes('address_3')) { done
        //     max_chars = 41;
        // }
        // else if (element.tagname.toLowerCase().includes('emailadd')) {done
        //     max_chars = 60;
        // }
        // else if (element.tagname.toLowerCase().includes('postc')) {done
        //     max_chars = 10;
        // }
        // else if (element.tagname.toLowerCase().includes('acctnum')) {done
        //     max_chars = 17;
        // }
        // else if (element.tagname.toLowerCase().includes('securephrase')) { done
        //     max_chars = 11;
        // }
        // else if (element.tagname.toLowerCase().includes('password')) { done
        //     max_chars = 21;
        // }
    
      
        if (element.value.length >= max_chars) {
            element.value = element.value.substr(0, max_chars);
        }
    },

    _triggerEvent(handlerName) {
        if (typeof this.eventHandlers[handlerName] == "function") {
            this.eventHandlers[handlerName](this.properties.value);
        }
    },

    _toggleCapsLock() {
        this.properties.capsLock = !this.properties.capsLock;

        for (const key of this.elements.keys) {
            if (key.childElementCount === 0) {
                key.textContent = this.properties.capsLock ? key.textContent.toUpperCase() : key.textContent.toLowerCase();
            }
        }
    },

    open(initialValue, oninput, onclose) {
        this.properties.value = initialValue.value || "";
        this.properties.tagname = initialValue.getAttribute('name');
        this.properties.className = initialValue.className;
        this.properties.maxChar = parseInt(initialValue.getAttribute('maxChar'));
        this.eventHandlers.oninput = oninput;
        this.eventHandlers.onclose = onclose;
        this.elements.main.classList.remove("keyboard--hidden");
        this.elements.keyboardspace.style.height = "350px";
    },

    close() {
        this.properties.value = "";
        this.eventHandlers.oninput = oninput;
        this.eventHandlers.onclose = onclose;
        this.elements.main.classList.add("keyboard--hidden");
        this.elements.keyboardspace.style.height = "0";
    },


    removeElementsByClass(className) {
        var elements = document.getElementsByClassName(className);
        while (elements.length > 0) {
            elements[0].parentNode.removeChild(elements[0]);
        }
    }
};


function loadKeyboard() {
    Keyboard.init();
}

function closeKeyboard() {
    Keyboard.close();
}

function deleteKeyboard() {
    Keyboard.removeElementsByClass('keyboard');
    Keyboard.removeElementsByClass('spaceHandling');
}

window.addEventListener("click", textclick, false);

function textclick() {
    Keyboard._setActive();
}

