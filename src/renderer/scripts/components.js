var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
var __defProp2 = Object.defineProperty;
var __name2 = /* @__PURE__ */ __name((target, value) => __defProp2(target, "name", { value, configurable: true }), "__name");
var __defProp22 = Object.defineProperty;
var __name22 = /* @__PURE__ */ __name2(
  (target, value) => __defProp22(target, "name", { value, configurable: true }),
  "__name"
);
var __defProp222 = Object.defineProperty;
var __name222 = /* @__PURE__ */ __name22(
  (target, value) => __defProp222(target, "name", { value, configurable: true }),
  "__name"
);
var __defProp2222 = Object.defineProperty;
var __name2222 = /* @__PURE__ */ __name222(
  (target, value) => __defProp2222(target, "name", { value, configurable: true }),
  "__name"
);
var __defProp22222 = Object.defineProperty;
var __name22222 = /* @__PURE__ */ __name2222(
  (target, value) => __defProp22222(target, "name", { value, configurable: true }),
  "__name"
);
var __defProp222222 = Object.defineProperty;
var __name222222 = /* @__PURE__ */ __name22222(
  (target, value) => __defProp222222(target, "name", { value, configurable: true }),
  "__name"
);
var __defProp2222222 = Object.defineProperty;
var __name2222222 = /* @__PURE__ */ __name222222(
  (target, value) => __defProp2222222(target, "name", { value, configurable: true }),
  "__name"
);
var __defProp22222222 = Object.defineProperty;
var __name22222222 = /* @__PURE__ */ __name2222222(
  (target, value) => __defProp22222222(target, "name", { value, configurable: true }),
  "__name"
);
var __defProp222222222 = Object.defineProperty;
var __name222222222 = /* @__PURE__ */ __name22222222(
  (target, value) => __defProp222222222(target, "name", { value, configurable: true }),
  "__name"
);
var __defProp2222222222 = Object.defineProperty;
var __name2222222222 = /* @__PURE__ */ __name222222222(
  (target, value) => __defProp2222222222(target, "name", { value, configurable: true }),
  "__name"
);
import { EventEmitter, DOMUtils } from "./utils.js";
class Component extends EventEmitter {
  static {
    __name(this, "Component");
  }
  static {
    __name2(this, "Component");
  }
  static {
    __name22(this, "Component");
  }
  static {
    __name222(this, "Component");
  }
  static {
    __name2222(this, "Component");
  }
  static {
    __name22222(this, "Component");
  }
  static {
    __name222222(this, "Component");
  }
  static {
    __name2222222(this, "Component");
  }
  static {
    __name22222222(this, "Component");
  }
  static {
    __name222222222(this, "Component");
  }
  static {
    __name2222222222(this, "Component");
  }
  constructor(element, options = {}) {
    super();
    this.element = typeof element === "string" ? document.querySelector(element) : element;
    this.options = { ...this.defaultOptions, ...options };
    this.state = {};
    this.isDestroyed = false;
    if (this.element) {
      this.init();
    }
  }
  get defaultOptions() {
    return {};
  }
  init() {
    this.bindEvents();
    this.render();
  }
  bindEvents() {
  }
  render() {
  }
  setState(newState) {
    const oldState = { ...this.state };
    this.state = { ...this.state, ...newState };
    this.emit("stateChange", this.state, oldState);
    this.render();
  }
  destroy() {
    this.isDestroyed = true;
    this.emit("destroy");
    if (this.element && this.element.parentNode) {
      this.element.parentNode.removeChild(this.element);
    }
  }
}
class Toast extends Component {
  static {
    __name(this, "Toast");
  }
  static {
    __name2(this, "Toast");
  }
  static {
    __name22(this, "Toast");
  }
  static {
    __name222(this, "Toast");
  }
  static {
    __name2222(this, "Toast");
  }
  static {
    __name22222(this, "Toast");
  }
  static {
    __name222222(this, "Toast");
  }
  static {
    __name2222222(this, "Toast");
  }
  static {
    __name22222222(this, "Toast");
  }
  static {
    __name222222222(this, "Toast");
  }
  static {
    __name2222222222(this, "Toast");
  }
  get defaultOptions() {
    return {
      type: "info",
      // success, error, warning, info
      duration: 4e3,
      closable: true,
      position: "top-right",
      animation: "slide"
    };
  }
  static show(message, options = {}) {
    const toast = new Toast(null, { ...options, message });
    return toast;
  }
  init() {
    this.createElement();
    this.appendToContainer();
    super.init();
    this.show();
  }
  createElement() {
    this.element = DOMUtils.createElement("div", {
      className: `toast toast--${this.options.type} toast--${this.options.animation}`,
      innerHTML: `
        <div class="toast__icon">
          <i class="fas ${this.getIcon()}"></i>
        </div>
        <div class="toast__content">
          <div class="toast__message">${this.options.message}</div>
        </div>
        ${this.options.closable ? '<button class="toast__close"><i class="fas fa-times"></i></button>' : ""}
      `
    });
  }
  getIcon() {
    const icons = {
      success: "fa-check-circle",
      error: "fa-exclamation-circle",
      warning: "fa-exclamation-triangle",
      info: "fa-info-circle"
    };
    return icons[this.options.type] || icons.info;
  }
  appendToContainer() {
    let container = document.querySelector(".toast-container");
    if (!container) {
      container = DOMUtils.createElement("div", {
        className: `toast-container toast-container--${this.options.position}`
      });
      document.body.appendChild(container);
    }
    container.appendChild(this.element);
  }
  bindEvents() {
    if (this.options.closable) {
      const closeBtn = this.element.querySelector(".toast__close");
      closeBtn?.addEventListener("click", () => this.hide());
    }
    if (this.options.duration > 0) {
      this.autoHideTimer = setTimeout(() => this.hide(), this.options.duration);
    }
    this.element.addEventListener("mouseenter", () => {
      if (this.autoHideTimer) {
        clearTimeout(this.autoHideTimer);
      }
    });
    this.element.addEventListener("mouseleave", () => {
      if (this.options.duration > 0) {
        this.autoHideTimer = setTimeout(() => this.hide(), 1e3);
      }
    });
  }
  show() {
    requestAnimationFrame(() => {
      this.element.classList.add("toast--show");
    });
  }
  hide() {
    this.element.classList.add("toast--hide");
    setTimeout(() => this.destroy(), 300);
  }
  destroy() {
    if (this.autoHideTimer) {
      clearTimeout(this.autoHideTimer);
    }
    super.destroy();
  }
}
class Modal extends Component {
  static {
    __name(this, "Modal");
  }
  static {
    __name2(this, "Modal");
  }
  static {
    __name22(this, "Modal");
  }
  static {
    __name222(this, "Modal");
  }
  static {
    __name2222(this, "Modal");
  }
  static {
    __name22222(this, "Modal");
  }
  static {
    __name222222(this, "Modal");
  }
  static {
    __name2222222(this, "Modal");
  }
  static {
    __name22222222(this, "Modal");
  }
  static {
    __name222222222(this, "Modal");
  }
  static {
    __name2222222222(this, "Modal");
  }
  get defaultOptions() {
    return {
      closable: true,
      backdrop: true,
      keyboard: true,
      size: "medium",
      // small, medium, large, fullscreen
      animation: "fade",
      autoFocus: true
    };
  }
  static show(content, options = {}) {
    const modal = new Modal(null, { ...options, content });
    return modal;
  }
  init() {
    this.createElement();
    document.body.appendChild(this.element);
    super.init();
    this.show();
  }
  createElement() {
    this.element = DOMUtils.createElement("div", {
      className: `modal modal--${this.options.size} modal--${this.options.animation}`,
      innerHTML: `
        <div class="modal__backdrop"></div>
        <div class="modal__container">
          <div class="modal__content">
            ${this.options.closable ? '<button class="modal__close"><i class="fas fa-times"></i></button>' : ""}
            <div class="modal__body">
              ${this.options.content || ""}
            </div>
          </div>
        </div>
      `
    });
  }
  bindEvents() {
    if (this.options.closable) {
      const closeBtn = this.element.querySelector(".modal__close");
      closeBtn?.addEventListener("click", () => this.hide());
    }
    if (this.options.backdrop) {
      const backdrop = this.element.querySelector(".modal__backdrop");
      backdrop?.addEventListener("click", () => this.hide());
    }
    if (this.options.keyboard) {
      this.keydownHandler = (e) => {
        if (e.key === "Escape") this.hide();
      };
      document.addEventListener("keydown", this.keydownHandler);
    }
    this.trapFocus();
  }
  trapFocus() {
    const focusableElements = this.element.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    if (focusableElements.length === 0) return;
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    this.focusHandler = (e) => {
      if (e.key === "Tab") {
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    };
    this.element.addEventListener("keydown", this.focusHandler);
    if (this.options.autoFocus) {
      firstElement.focus();
    }
  }
  show() {
    document.body.classList.add("modal-open");
    requestAnimationFrame(() => {
      this.element.classList.add("modal--show");
    });
    this.emit("show");
  }
  hide() {
    this.element.classList.add("modal--hide");
    setTimeout(() => {
      document.body.classList.remove("modal-open");
      this.destroy();
    }, 300);
    this.emit("hide");
  }
  destroy() {
    if (this.keydownHandler) {
      document.removeEventListener("keydown", this.keydownHandler);
    }
    if (this.focusHandler) {
      this.element.removeEventListener("keydown", this.focusHandler);
    }
    super.destroy();
  }
}
class Loading extends Component {
  static {
    __name(this, "Loading");
  }
  static {
    __name2(this, "Loading");
  }
  static {
    __name22(this, "Loading");
  }
  static {
    __name222(this, "Loading");
  }
  static {
    __name2222(this, "Loading");
  }
  static {
    __name22222(this, "Loading");
  }
  static {
    __name222222(this, "Loading");
  }
  static {
    __name2222222(this, "Loading");
  }
  static {
    __name22222222(this, "Loading");
  }
  static {
    __name222222222(this, "Loading");
  }
  static {
    __name2222222222(this, "Loading");
  }
  get defaultOptions() {
    return {
      type: "spinner",
      // spinner, dots, bars, pulse
      size: "medium",
      // small, medium, large
      overlay: false,
      message: ""
    };
  }
  static show(options = {}) {
    const loading = new Loading(null, options);
    return loading;
  }
  init() {
    this.createElement();
    this.appendToTarget();
    super.init();
    this.show();
  }
  createElement() {
    const className = `loading loading--${this.options.type} loading--${this.options.size}`;
    this.element = DOMUtils.createElement("div", {
      className: this.options.overlay ? `${className} loading--overlay` : className,
      innerHTML: `
        <div class="loading__spinner">
          ${this.getSpinnerHTML()}
        </div>
        ${this.options.message ? `<div class="loading__message">${this.options.message}</div>` : ""}
      `
    });
  }
  getSpinnerHTML() {
    const spinners = {
      spinner: '<div class="spinner"></div>',
      dots: '<div class="dots"><span></span><span></span><span></span></div>',
      bars: '<div class="bars"><span></span><span></span><span></span><span></span></div>',
      pulse: '<div class="pulse"></div>'
    };
    return spinners[this.options.type] || spinners.spinner;
  }
  appendToTarget() {
    const target = this.options.target || document.body;
    target.appendChild(this.element);
  }
  show() {
    requestAnimationFrame(() => {
      this.element.classList.add("loading--show");
    });
  }
  hide() {
    this.element.classList.add("loading--hide");
    setTimeout(() => this.destroy(), 300);
  }
}
class ProgressBar extends Component {
  static {
    __name(this, "ProgressBar");
  }
  static {
    __name2(this, "ProgressBar");
  }
  static {
    __name22(this, "ProgressBar");
  }
  static {
    __name222(this, "ProgressBar");
  }
  static {
    __name2222(this, "ProgressBar");
  }
  static {
    __name22222(this, "ProgressBar");
  }
  static {
    __name222222(this, "ProgressBar");
  }
  static {
    __name2222222(this, "ProgressBar");
  }
  static {
    __name22222222(this, "ProgressBar");
  }
  static {
    __name222222222(this, "ProgressBar");
  }
  static {
    __name2222222222(this, "ProgressBar");
  }
  get defaultOptions() {
    return {
      value: 0,
      max: 100,
      animated: true,
      striped: false,
      color: "primary",
      showLabel: true,
      labelFormat: /* @__PURE__ */ __name2222222222(
        (value, max) => `${Math.round(value / max * 100)}%`,
        "labelFormat"
      )
    };
  }
  init() {
    this.createElement();
    super.init();
  }
  createElement() {
    if (!this.element) {
      this.element = DOMUtils.createElement("div", {
        className: "progress-bar"
      });
    }
    this.render();
  }
  render() {
    const percentage = Math.min(100, Math.max(0, this.options.value / this.options.max * 100));
    this.element.innerHTML = `
      <div class="progress-bar__track">
        <div class="progress-bar__fill progress-bar__fill--${this.options.color} 
                    ${this.options.animated ? "progress-bar__fill--animated" : ""}
                    ${this.options.striped ? "progress-bar__fill--striped" : ""}"
             style="width: ${percentage}%">
        </div>
      </div>
      ${this.options.showLabel ? `<div class="progress-bar__label">
          ${this.options.labelFormat(this.options.value, this.options.max)}
        </div>` : ""}
    `;
  }
  setValue(value) {
    this.options.value = value;
    this.render();
    this.emit("change", value);
  }
  setMax(max) {
    this.options.max = max;
    this.render();
  }
}
class Dropdown extends Component {
  static {
    __name(this, "Dropdown");
  }
  static {
    __name2(this, "Dropdown");
  }
  static {
    __name22(this, "Dropdown");
  }
  static {
    __name222(this, "Dropdown");
  }
  static {
    __name2222(this, "Dropdown");
  }
  static {
    __name22222(this, "Dropdown");
  }
  static {
    __name222222(this, "Dropdown");
  }
  static {
    __name2222222(this, "Dropdown");
  }
  static {
    __name22222222(this, "Dropdown");
  }
  static {
    __name222222222(this, "Dropdown");
  }
  static {
    __name2222222222(this, "Dropdown");
  }
  get defaultOptions() {
    return {
      trigger: "click",
      // click, hover
      placement: "bottom-start",
      offset: 8,
      closeOnClick: true,
      closeOnEscape: true
    };
  }
  init() {
    this.trigger = this.element.querySelector("[data-dropdown-trigger]");
    this.menu = this.element.querySelector("[data-dropdown-menu]");
    if (!this.trigger || !this.menu) {
      return;
    }
    super.init();
  }
  bindEvents() {
    if (this.options.trigger === "click") {
      this.trigger.addEventListener("click", (e) => {
        e.preventDefault();
        this.toggle();
      });
    } else if (this.options.trigger === "hover") {
      this.element.addEventListener("mouseenter", () => this.show());
      this.element.addEventListener("mouseleave", () => this.hide());
    }
    if (this.options.closeOnClick) {
      this.menu.addEventListener("click", (e) => {
        if (e.target.closest("[data-dropdown-item]")) {
          this.hide();
        }
      });
    }
    if (this.options.closeOnEscape) {
      this.escapeHandler = (e) => {
        if (e.key === "Escape" && this.isOpen) {
          this.hide();
        }
      };
      document.addEventListener("keydown", this.escapeHandler);
    }
    this.outsideClickHandler = (e) => {
      if (this.isOpen && !this.element.contains(e.target)) {
        this.hide();
      }
    };
    document.addEventListener("click", this.outsideClickHandler);
  }
  toggle() {
    this.isOpen ? this.hide() : this.show();
  }
  show() {
    if (this.isOpen) return;
    this.isOpen = true;
    this.element.classList.add("dropdown--open");
    this.menu.classList.add("dropdown__menu--show");
    this.positionMenu();
    this.emit("show");
  }
  hide() {
    if (!this.isOpen) return;
    this.isOpen = false;
    this.element.classList.remove("dropdown--open");
    this.menu.classList.remove("dropdown__menu--show");
    this.emit("hide");
  }
  positionMenu() {
    const triggerRect = this.trigger.getBoundingClientRect();
    const menuRect = this.menu.getBoundingClientRect();
    const viewport = {
      width: window.innerWidth,
      height: window.innerHeight
    };
    let top, left;
    switch (this.options.placement) {
      case "bottom-start":
        top = triggerRect.bottom + this.options.offset;
        left = triggerRect.left;
        break;
      case "bottom-end":
        top = triggerRect.bottom + this.options.offset;
        left = triggerRect.right - menuRect.width;
        break;
      case "top-start":
        top = triggerRect.top - menuRect.height - this.options.offset;
        left = triggerRect.left;
        break;
      case "top-end":
        top = triggerRect.top - menuRect.height - this.options.offset;
        left = triggerRect.right - menuRect.width;
        break;
      default:
        top = triggerRect.bottom + this.options.offset;
        left = triggerRect.left;
    }
    if (left + menuRect.width > viewport.width) {
      left = viewport.width - menuRect.width - 10;
    }
    if (left < 10) {
      left = 10;
    }
    if (top + menuRect.height > viewport.height) {
      top = triggerRect.top - menuRect.height - this.options.offset;
    }
    if (top < 10) {
      top = 10;
    }
    this.menu.style.position = "fixed";
    this.menu.style.top = `${top}px`;
    this.menu.style.left = `${left}px`;
  }
  destroy() {
    if (this.escapeHandler) {
      document.removeEventListener("keydown", this.escapeHandler);
    }
    if (this.outsideClickHandler) {
      document.removeEventListener("click", this.outsideClickHandler);
    }
    super.destroy();
  }
}
class Tabs extends Component {
  static {
    __name(this, "Tabs");
  }
  static {
    __name2(this, "Tabs");
  }
  static {
    __name22(this, "Tabs");
  }
  static {
    __name222(this, "Tabs");
  }
  static {
    __name2222(this, "Tabs");
  }
  static {
    __name22222(this, "Tabs");
  }
  static {
    __name222222(this, "Tabs");
  }
  static {
    __name2222222(this, "Tabs");
  }
  static {
    __name22222222(this, "Tabs");
  }
  static {
    __name222222222(this, "Tabs");
  }
  static {
    __name2222222222(this, "Tabs");
  }
  get defaultOptions() {
    return {
      activeTab: 0,
      animation: true,
      keyboard: true
    };
  }
  init() {
    this.tabButtons = this.element.querySelectorAll("[data-tab-button]");
    this.tabPanels = this.element.querySelectorAll("[data-tab-panel]");
    if (this.tabButtons.length === 0 || this.tabPanels.length === 0) {
      return;
    }
    this.activeIndex = this.options.activeTab;
    super.init();
    this.showTab(this.activeIndex);
  }
  bindEvents() {
    this.tabButtons.forEach((button, index) => {
      button.addEventListener("click", (e) => {
        e.preventDefault();
        this.showTab(index);
      });
    });
    if (this.options.keyboard) {
      this.element.addEventListener("keydown", (e) => {
        if (e.target.matches("[data-tab-button]")) {
          const currentIndex = Array.from(this.tabButtons).indexOf(e.target);
          let newIndex = currentIndex;
          switch (e.key) {
            case "ArrowLeft":
              newIndex = currentIndex > 0 ? currentIndex - 1 : this.tabButtons.length - 1;
              break;
            case "ArrowRight":
              newIndex = currentIndex < this.tabButtons.length - 1 ? currentIndex + 1 : 0;
              break;
            case "Home":
              newIndex = 0;
              break;
            case "End":
              newIndex = this.tabButtons.length - 1;
              break;
            default:
              return;
          }
          e.preventDefault();
          this.showTab(newIndex);
          this.tabButtons[newIndex].focus();
        }
      });
    }
  }
  showTab(index) {
    if (index < 0 || index >= this.tabButtons.length) return;
    this.tabButtons.forEach((button, i) => {
      button.classList.toggle("tab-button--active", i === index);
      button.setAttribute("aria-selected", i === index);
      button.setAttribute("tabindex", i === index ? "0" : "-1");
    });
    this.tabPanels.forEach((panel, i) => {
      const isActive = i === index;
      panel.classList.toggle("tab-panel--active", isActive);
      panel.setAttribute("aria-hidden", !isActive);
      if (this.options.animation) {
        if (isActive) {
          panel.style.display = "block";
          requestAnimationFrame(() => {
            panel.classList.add("tab-panel--show");
          });
        } else {
          panel.classList.remove("tab-panel--show");
          setTimeout(() => {
            if (!panel.classList.contains("tab-panel--active")) {
              panel.style.display = "none";
            }
          }, 300);
        }
      }
    });
    this.activeIndex = index;
    this.emit("change", index);
  }
  getActiveTab() {
    return this.activeIndex;
  }
  setActiveTab(index) {
    this.showTab(index);
  }
}
class Tooltip extends Component {
  static {
    __name(this, "Tooltip");
  }
  static {
    __name2(this, "Tooltip");
  }
  static {
    __name22(this, "Tooltip");
  }
  static {
    __name222(this, "Tooltip");
  }
  static {
    __name2222(this, "Tooltip");
  }
  static {
    __name22222(this, "Tooltip");
  }
  static {
    __name222222(this, "Tooltip");
  }
  static {
    __name2222222(this, "Tooltip");
  }
  static {
    __name22222222(this, "Tooltip");
  }
  static {
    __name222222222(this, "Tooltip");
  }
  static {
    __name2222222222(this, "Tooltip");
  }
  get defaultOptions() {
    return {
      placement: "top",
      trigger: "hover",
      delay: 0,
      offset: 8,
      arrow: true,
      animation: true
    };
  }
  init() {
    this.content = this.element.getAttribute("data-tooltip") || this.element.getAttribute("title");
    if (this.element.hasAttribute("title")) {
      this.element.removeAttribute("title");
    }
    if (!this.content) return;
    this.createTooltip();
    super.init();
  }
  createTooltip() {
    this.tooltip = DOMUtils.createElement("div", {
      className: `tooltip tooltip--${this.options.placement}`,
      innerHTML: `
        <div class="tooltip__content">${this.content}</div>
        ${this.options.arrow ? '<div class="tooltip__arrow"></div>' : ""}
      `
    });
    document.body.appendChild(this.tooltip);
  }
  bindEvents() {
    if (this.options.trigger === "hover") {
      this.element.addEventListener("mouseenter", () => this.show());
      this.element.addEventListener("mouseleave", () => this.hide());
    } else if (this.options.trigger === "click") {
      this.element.addEventListener("click", () => this.toggle());
    } else if (this.options.trigger === "focus") {
      this.element.addEventListener("focus", () => this.show());
      this.element.addEventListener("blur", () => this.hide());
    }
  }
  show() {
    if (this.isVisible) return;
    clearTimeout(this.hideTimer);
    if (this.options.delay > 0) {
      this.showTimer = setTimeout(() => this._show(), this.options.delay);
    } else {
      this._show();
    }
  }
  _show() {
    this.isVisible = true;
    this.positionTooltip();
    this.tooltip.classList.add("tooltip--show");
    this.emit("show");
  }
  hide() {
    if (!this.isVisible) return;
    clearTimeout(this.showTimer);
    this.hideTimer = setTimeout(() => {
      this.isVisible = false;
      this.tooltip.classList.remove("tooltip--show");
      this.emit("hide");
    }, 100);
  }
  toggle() {
    this.isVisible ? this.hide() : this.show();
  }
  positionTooltip() {
    const elementRect = this.element.getBoundingClientRect();
    const tooltipRect = this.tooltip.getBoundingClientRect();
    let top, left;
    switch (this.options.placement) {
      case "top":
        top = elementRect.top - tooltipRect.height - this.options.offset;
        left = elementRect.left + (elementRect.width - tooltipRect.width) / 2;
        break;
      case "bottom":
        top = elementRect.bottom + this.options.offset;
        left = elementRect.left + (elementRect.width - tooltipRect.width) / 2;
        break;
      case "left":
        top = elementRect.top + (elementRect.height - tooltipRect.height) / 2;
        left = elementRect.left - tooltipRect.width - this.options.offset;
        break;
      case "right":
        top = elementRect.top + (elementRect.height - tooltipRect.height) / 2;
        left = elementRect.right + this.options.offset;
        break;
    }
    this.tooltip.style.position = "fixed";
    this.tooltip.style.top = `${top}px`;
    this.tooltip.style.left = `${left}px`;
  }
  destroy() {
    clearTimeout(this.showTimer);
    clearTimeout(this.hideTimer);
    if (this.tooltip && this.tooltip.parentNode) {
      this.tooltip.parentNode.removeChild(this.tooltip);
    }
    super.destroy();
  }
}
class ComponentFactory {
  static {
    __name(this, "ComponentFactory");
  }
  static {
    __name2(this, "ComponentFactory");
  }
  static {
    __name22(this, "ComponentFactory");
  }
  static {
    __name222(this, "ComponentFactory");
  }
  static {
    __name2222(this, "ComponentFactory");
  }
  static {
    __name22222(this, "ComponentFactory");
  }
  static {
    __name222222(this, "ComponentFactory");
  }
  static {
    __name2222222(this, "ComponentFactory");
  }
  static {
    __name22222222(this, "ComponentFactory");
  }
  static {
    __name222222222(this, "ComponentFactory");
  }
  static {
    __name2222222222(this, "ComponentFactory");
  }
  static components = /* @__PURE__ */ new Map([
    ["toast", Toast],
    ["modal", Modal],
    ["loading", Loading],
    ["progress-bar", ProgressBar],
    ["dropdown", Dropdown],
    ["tabs", Tabs],
    ["tooltip", Tooltip]
  ]);
  static register(name, componentClass) {
    this.components.set(name, componentClass);
  }
  static create(name, element, options = {}) {
    const ComponentClass = this.components.get(name);
    if (!ComponentClass) {
      return null;
    }
    return new ComponentClass(element, options);
  }
  static initAll(container = document) {
    const componentSelectors = [
      '[data-component="dropdown"]',
      '[data-component="tabs"]',
      "[data-tooltip]",
      "[title]"
    ];
    componentSelectors.forEach((selector) => {
      const elements = container.querySelectorAll(selector);
      elements.forEach((element) => {
        const componentName = element.getAttribute("data-component") || (element.hasAttribute("data-tooltip") || element.hasAttribute("title") ? "tooltip" : null);
        if (componentName && !element._component) {
          const options = this.parseOptions(element);
          element._component = this.create(componentName, element, options);
        }
      });
    });
  }
  static parseOptions(element) {
    const options = {};
    const dataAttrs = element.dataset;
    Object.keys(dataAttrs).forEach((key) => {
      if (key.startsWith("option")) {
        const optionName = key.replace("option", "").toLowerCase();
        let value = dataAttrs[key];
        value = JSON.parse(value);
        options[optionName] = value;
      }
    });
    return options;
  }
}
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => ComponentFactory.initAll());
} else {
  ComponentFactory.initAll();
}
class ComponentManager {
  static {
    __name(this, "ComponentManager");
  }
  static {
    __name2(this, "ComponentManager");
  }
  static {
    __name22(this, "ComponentManager");
  }
  static {
    __name222(this, "ComponentManager");
  }
  static {
    __name2222(this, "ComponentManager");
  }
  static {
    __name22222(this, "ComponentManager");
  }
  static {
    __name222222(this, "ComponentManager");
  }
  static {
    __name2222222(this, "ComponentManager");
  }
  static {
    __name22222222(this, "ComponentManager");
  }
  static {
    __name222222222(this, "ComponentManager");
  }
  static {
    __name2222222222(this, "ComponentManager");
  }
  constructor() {
    this.components = /* @__PURE__ */ new Map();
    this.factories = /* @__PURE__ */ new Map();
  }
  init() {
    this.registerDefaultFactories();
  }
  registerDefaultFactories() {
    this.register("toast", ToastComponent);
    this.register("modal", ModalComponent);
    this.register("loading", LoadingComponent);
    this.register("gameCard", GameCardComponent);
    this.register("achievementCard", AchievementCardComponent);
  }
  register(name, componentClass) {
    this.factories.set(name, componentClass);
  }
  create(name, element, options = {}) {
    const ComponentClass = this.factories.get(name);
    if (!ComponentClass) {
      return null;
    }
    const component = new ComponentClass(element, options);
    const id = this.generateId();
    this.components.set(id, component);
    return component;
  }
  destroy(componentId) {
    const component = this.components.get(componentId);
    if (component) {
      component.destroy();
      this.components.delete(componentId);
    }
  }
  destroyAll() {
    this.components.forEach((component) => component.destroy());
    this.components.clear();
  }
  generateId() {
    return `component_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}
const ToastComponent = Toast;
const ModalComponent = Modal;
const LoadingComponent = Loading;
const GameCardComponent = Component;
const AchievementCardComponent = Component;
if (typeof window !== "undefined") {
  window.Components = {
    Component,
    Toast,
    Modal,
    Loading,
    ProgressBar,
    Dropdown,
    Tabs,
    Tooltip,
    ComponentFactory,
    ComponentManager
  };
}
export {
  AchievementCardComponent,
  Component,
  ComponentFactory,
  ComponentManager,
  Dropdown,
  GameCardComponent,
  Loading,
  LoadingComponent,
  Modal,
  ModalComponent,
  ProgressBar,
  Tabs,
  Toast,
  ToastComponent,
  Tooltip
};
