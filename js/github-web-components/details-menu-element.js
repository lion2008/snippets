class DetailsMenuElement extends HTMLElement {
    constructor() {
        super();
    }
    get preload() {
        return this.hasAttribute('preload');
    }
    set preload(value) {
        if (value) {
            this.setAttribute('preload', '');
        }
        else {
            this.removeAttribute('preload');
        }
    }
    get src() {
        return this.getAttribute('src') || '';
    }
    set src(value) {
        this.setAttribute('src', value);
    }
    connectedCallback() {
        if (!this.hasAttribute('role'))
            this.setAttribute('role', 'menu');
        const details = this.parentElement;
        if (!details)
            return;
        const summary = details.querySelector('summary');
        if (summary) {
            summary.setAttribute('aria-haspopup', 'menu');
            if (!summary.hasAttribute('role'))
                summary.setAttribute('role', 'button');
        }
        const subscriptions = [
            fromEvent(details, 'compositionstart', e => trackComposition(this, e)),
            fromEvent(details, 'compositionend', e => trackComposition(this, e)),
            fromEvent(details, 'click', e => shouldCommit(details, this, e)),
            fromEvent(details, 'change', e => shouldCommit(details, this, e)),
            fromEvent(details, 'keydown', e => keydown(details, this, e)),
            fromEvent(details, 'toggle', () => loadFragment(details, this), { once: true }),
            fromEvent(details, 'toggle', () => closeCurrentMenu(details)),
            this.preload
                ? fromEvent(details, 'mouseover', () => loadFragment(details, this), { once: true })
                : NullSubscription,
            ...focusOnOpen(details)
        ];
        states.set(this, { subscriptions, loaded: false, isComposing: false });
    }
    disconnectedCallback() {
        const state = states.get(this);
        if (!state)
            return;
        states.delete(this);
        for (const sub of state.subscriptions) {
            sub.unsubscribe();
        }
    }
}
const states = new WeakMap();
const NullSubscription = {
    unsubscribe() {
    }
};
function fromEvent(target, eventName, onNext, options = false) {
    target.addEventListener(eventName, onNext, options);
    return {
        unsubscribe: () => {
            target.removeEventListener(eventName, onNext, options);
        }
    };
}
function loadFragment(details, menu) {
    const src = menu.getAttribute('src');
    if (!src)
        return;
    const state = states.get(menu);
    if (!state)
        return;
    if (state.loaded)
        return;
    state.loaded = true;
    const loader = menu.querySelector('include-fragment');
    if (loader && !loader.hasAttribute('src')) {
        loader.addEventListener('loadend', () => autofocus(details));
        loader.setAttribute('src', src);
    }
}
function focusOnOpen(details) {
    let isMouse = false;
    const onmousedown = () => (isMouse = true);
    const onkeydown = () => (isMouse = false);
    const ontoggle = () => {
        if (!details.hasAttribute('open'))
            return;
        if (autofocus(details))
            return;
        if (!isMouse)
            focusFirstItem(details);
    };
    return [
        fromEvent(details, 'mousedown', onmousedown),
        fromEvent(details, 'keydown', onkeydown),
        fromEvent(details, 'toggle', ontoggle)
    ];
}
function closeCurrentMenu(details) {
    if (!details.hasAttribute('open'))
        return;
    for (const menu of document.querySelectorAll('details[open] > details-menu')) {
        const opened = menu.closest('details');
        if (opened && opened !== details && !opened.contains(details)) {
            opened.removeAttribute('open');
        }
    }
}
function autofocus(details) {
    if (!details.hasAttribute('open'))
        return false;
    const input = details.querySelector('[autofocus]');
    if (input) {
        input.focus();
        return true;
    }
    else {
        return false;
    }
}
function focusFirstItem(details) {
    const selected = document.activeElement;
    if (selected && isMenuItem(selected) && details.contains(selected))
        return;
    const target = sibling(details, true);
    if (target)
        target.focus();
}
function sibling(details, next) {
    const options = Array.from(details.querySelectorAll('[role^="menuitem"]:not([hidden]):not([disabled]):not([aria-disabled="true"])'));
    const selected = document.activeElement;
    const index = selected instanceof HTMLElement ? options.indexOf(selected) : -1;
    const found = next ? options[index + 1] : options[index - 1];
    const def = next ? options[0] : options[options.length - 1];
    return found || def;
}
const ctrlBindings = navigator.userAgent.match(/Macintosh/);
function shouldCommit(details, menu, event) {
    const target = event.target;
    if (!(target instanceof Element))
        return;
    if (target.closest('details') !== details)
        return;
    if (event.type === 'click') {
        const menuitem = target.closest('[role="menuitem"], [role="menuitemradio"]');
        const onlyCommitOnChangeEvent = menuitem && menuitem.tagName === 'LABEL' && menuitem.querySelector('input');
        if (menuitem && !onlyCommitOnChangeEvent) {
            commit(menuitem, details);
        }
    }
    else if (event.type === 'change') {
        const menuitem = target.closest('[role="menuitemradio"], [role="menuitemcheckbox"]');
        if (menuitem)
            commit(menuitem, details);
    }
}
function updateChecked(selected, details) {
    for (const el of details.querySelectorAll('[role="menuitemradio"], [role="menuitemcheckbox"]')) {
        const input = el.querySelector('input[type="radio"], input[type="checkbox"]');
        let checkState = (el === selected).toString();
        if (input instanceof HTMLInputElement) {
            checkState = input.indeterminate ? 'mixed' : input.checked.toString();
        }
        el.setAttribute('aria-checked', checkState);
    }
}
function commit(selected, details) {
    if (selected.hasAttribute('disabled') || selected.getAttribute('aria-disabled') === 'true')
        return;
    const menu = selected.closest('details-menu');
    if (!menu)
        return;
    const dispatched = menu.dispatchEvent(new CustomEvent('details-menu-select', {
        cancelable: true,
        detail: { relatedTarget: selected }
    }));
    if (!dispatched)
        return;
    updateLabel(selected, details);
    updateChecked(selected, details);
    if (selected.getAttribute('role') !== 'menuitemcheckbox')
        close(details);
    menu.dispatchEvent(new CustomEvent('details-menu-selected', {
        detail: { relatedTarget: selected }
    }));
}
function keydown(details, menu, event) {
    if (!(event instanceof KeyboardEvent))
        return;
    if (details.querySelector('details[open]'))
        return;
    const state = states.get(menu);
    if (!state || state.isComposing)
        return;
    const isSummaryFocused = event.target instanceof Element && event.target.tagName === 'SUMMARY';
    switch (event.key) {
        case 'Escape':
            if (details.hasAttribute('open')) {
                close(details);
                event.preventDefault();
                event.stopPropagation();
            }
            break;
        case 'ArrowDown':
            {
                if (isSummaryFocused && !details.hasAttribute('open')) {
                    details.setAttribute('open', '');
                }
                const target = sibling(details, true);
                if (target)
                    target.focus();
                event.preventDefault();
            }
            break;
        case 'ArrowUp':
            {
                if (isSummaryFocused && !details.hasAttribute('open')) {
                    details.setAttribute('open', '');
                }
                const target = sibling(details, false);
                if (target)
                    target.focus();
                event.preventDefault();
            }
            break;
        case 'n':
            {
                if (ctrlBindings && event.ctrlKey) {
                    const target = sibling(details, true);
                    if (target)
                        target.focus();
                    event.preventDefault();
                }
            }
            break;
        case 'p':
            {
                if (ctrlBindings && event.ctrlKey) {
                    const target = sibling(details, false);
                    if (target)
                        target.focus();
                    event.preventDefault();
                }
            }
            break;
        case ' ':
        case 'Enter':
            {
                const selected = document.activeElement;
                if (selected instanceof HTMLElement && isMenuItem(selected) && selected.closest('details') === details) {
                    event.preventDefault();
                    event.stopPropagation();
                    selected.click();
                }
            }
            break;
    }
}
function isMenuItem(el) {
    const role = el.getAttribute('role');
    return role === 'menuitem' || role === 'menuitemcheckbox' || role === 'menuitemradio';
}
function close(details) {
    const wasOpen = details.hasAttribute('open');
    if (!wasOpen)
        return;
    details.removeAttribute('open');
    const summary = details.querySelector('summary');
    if (summary)
        summary.focus();
}
function updateLabel(item, details) {
    const button = details.querySelector('[data-menu-button]');
    if (!button)
        return;
    const text = labelText(item);
    if (text) {
        button.textContent = text;
    }
    else {
        const html = labelHTML(item);
        if (html)
            button.innerHTML = html;
    }
}
function labelText(el) {
    if (!el)
        return null;
    const textEl = el.hasAttribute('data-menu-button-text') ? el : el.querySelector('[data-menu-button-text]');
    if (!textEl)
        return null;
    return textEl.getAttribute('data-menu-button-text') || textEl.textContent;
}
function labelHTML(el) {
    if (!el)
        return null;
    const contentsEl = el.hasAttribute('data-menu-button-contents') ? el : el.querySelector('[data-menu-button-contents]');
    return contentsEl ? contentsEl.innerHTML : null;
}
function trackComposition(menu, event) {
    const state = states.get(menu);
    if (!state)
        return;
    state.isComposing = event.type === 'compositionstart';
}
export default DetailsMenuElement;
if (!window.customElements.get('details-menu')) {
    window.DetailsMenuElement = DetailsMenuElement;
    window.customElements.define('details-menu', DetailsMenuElement);
}