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
import { EventEmitter, DOMUtils, NumberUtils, throttle } from "./utils.js";
class VirtualScroller {
  static {
    __name(this, "VirtualScroller");
  }
  static {
    __name2(this, "VirtualScroller");
  }
  static {
    __name22(this, "VirtualScroller");
  }
  static {
    __name222(this, "VirtualScroller");
  }
  static {
    __name2222(this, "VirtualScroller");
  }
  static {
    __name22222(this, "VirtualScroller");
  }
  static {
    __name222222(this, "VirtualScroller");
  }
  constructor(container, options = {}) {
    this.container = typeof container === "string" ? document.querySelector(container) : container;
    this.options = {
      itemHeight: 50,
      bufferSize: 5,
      threshold: 100,
      renderItem: /* @__PURE__ */ __name222222(
        (item) => `<div class="virtual-item">${item}</div>`,
        "renderItem"
      ),
      ...options
    };
    this.data = [];
    this.visibleItems = [];
    this.startIndex = 0;
    this.endIndex = 0;
    this.scrollTop = 0;
    this.containerHeight = 0;
    this.totalHeight = 0;
    this.init();
  }
  init() {
    this.setupContainer();
    this.bindEvents();
    this.calculateDimensions();
  }
  setupContainer() {
    this.container.style.overflow = "auto";
    this.container.style.position = "relative";
    this.viewport = DOMUtils.createElement("div", {
      className: "virtual-scroller__viewport",
      style: "position: relative; width: 100%;"
    });
    this.spacer = DOMUtils.createElement("div", {
      className: "virtual-scroller__spacer",
      style: "position: absolute; top: 0; left: 0; right: 0; pointer-events: none;"
    });
    this.container.appendChild(this.spacer);
    this.container.appendChild(this.viewport);
  }
  bindEvents() {
    this.scrollHandler = throttle(() => {
      this.handleScroll();
    }, 16);
    this.container.addEventListener("scroll", this.scrollHandler);
    if (window.ResizeObserver) {
      this.resizeObserver = new ResizeObserver(() => {
        this.calculateDimensions();
        this.render();
      });
      this.resizeObserver.observe(this.container);
    }
  }
  setData(data) {
    this.data = data;
    this.totalHeight = data.length * this.options.itemHeight;
    this.spacer.style.height = `${this.totalHeight}px`;
    this.calculateVisibleRange();
    this.render();
  }
  calculateDimensions() {
    this.containerHeight = this.container.clientHeight;
    this.visibleCount = Math.ceil(this.containerHeight / this.options.itemHeight) + this.options.bufferSize * 2;
  }
  handleScroll() {
    this.scrollTop = this.container.scrollTop;
    this.calculateVisibleRange();
    this.render();
  }
  calculateVisibleRange() {
    const startIndex = Math.floor(this.scrollTop / this.options.itemHeight);
    this.startIndex = Math.max(0, startIndex - this.options.bufferSize);
    this.endIndex = Math.min(this.data.length, this.startIndex + this.visibleCount);
  }
  render() {
    this.viewport.innerHTML = "";
    const fragment = document.createDocumentFragment();
    for (let i = this.startIndex; i < this.endIndex; i++) {
      const item = this.data[i];
      const element = DOMUtils.createElement("div", {
        className: "virtual-scroller__item",
        style: `position: absolute; top: ${i * this.options.itemHeight}px; width: 100%; height: ${this.options.itemHeight}px;`,
        innerHTML: this.options.renderItem(item, i)
      });
      fragment.appendChild(element);
    }
    this.viewport.appendChild(fragment);
  }
  scrollToIndex(index) {
    const targetScrollTop = index * this.options.itemHeight;
    this.container.scrollTop = targetScrollTop;
  }
  destroy() {
    this.container.removeEventListener("scroll", this.scrollHandler);
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
  }
}
class LazyLoader {
  static {
    __name(this, "LazyLoader");
  }
  static {
    __name2(this, "LazyLoader");
  }
  static {
    __name22(this, "LazyLoader");
  }
  static {
    __name222(this, "LazyLoader");
  }
  static {
    __name2222(this, "LazyLoader");
  }
  static {
    __name22222(this, "LazyLoader");
  }
  static {
    __name222222(this, "LazyLoader");
  }
  constructor(options = {}) {
    this.options = {
      rootMargin: "50px",
      threshold: 0.1,
      loadingClass: "lazy-loading",
      loadedClass: "lazy-loaded",
      errorClass: "lazy-error",
      ...options
    };
    this.observer = null;
    this.init();
  }
  init() {
    if ("IntersectionObserver" in window) {
      this.observer = new IntersectionObserver(this.handleIntersection.bind(this), {
        rootMargin: this.options.rootMargin,
        threshold: this.options.threshold
      });
    }
  }
  observe(elements) {
    if (!this.observer) {
      elements.forEach((element) => this.loadElement(element));
      return;
    }
    elements.forEach((element) => {
      if (element.dataset.src || element.dataset.srcset) {
        this.observer.observe(element);
      }
    });
  }
  handleIntersection(entries) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        this.loadElement(entry.target);
        this.observer.unobserve(entry.target);
      }
    });
  }
  loadElement(element) {
    element.classList.add(this.options.loadingClass);
    if (element.tagName === "IMG") {
      this.loadImage(element);
    } else if (element.dataset.src) {
      this.loadContent(element);
    }
  }
  loadImage(img) {
    const src = img.dataset.src;
    const srcset = img.dataset.srcset;
    const tempImg = new Image();
    tempImg.onload = () => {
      img.src = src;
      if (srcset) img.srcset = srcset;
      img.classList.remove(this.options.loadingClass);
      img.classList.add(this.options.loadedClass);
      img.dispatchEvent(new CustomEvent("lazyloaded"));
    };
    tempImg.onerror = () => {
      img.classList.remove(this.options.loadingClass);
      img.classList.add(this.options.errorClass);
      img.dispatchEvent(new CustomEvent("lazyerror"));
    };
    tempImg.src = src;
  }
  async loadContent(element) {
    const response = await fetch(element.dataset.src);
    const content = await response.text();
    element.innerHTML = content;
    element.classList.remove(this.options.loadingClass);
    element.classList.add(this.options.loadedClass);
    if (window.Components) {
      window.Components.ComponentFactory.initAll(element);
    }
    element.dispatchEvent(new CustomEvent("lazyloaded"));
  }
  // Auto-initialize lazy elements
  static init(container = document) {
    const lazyLoader = new LazyLoader();
    const lazyElements = container.querySelectorAll("[data-src], img[data-src]");
    lazyLoader.observe(Array.from(lazyElements));
    return lazyLoader;
  }
}
class CacheManager {
  static {
    __name(this, "CacheManager");
  }
  static {
    __name2(this, "CacheManager");
  }
  static {
    __name22(this, "CacheManager");
  }
  static {
    __name222(this, "CacheManager");
  }
  static {
    __name2222(this, "CacheManager");
  }
  static {
    __name22222(this, "CacheManager");
  }
  static {
    __name222222(this, "CacheManager");
  }
  constructor(options = {}) {
    this.options = {
      maxSize: 50,
      // MB
      maxAge: 24 * 60 * 60 * 1e3,
      // 24 hours
      storageKey: "achievements-cache",
      compression: true,
      ...options
    };
    this.cache = /* @__PURE__ */ new Map();
    this.loadFromStorage();
    this.startCleanupTimer();
  }
  // Generate cache key
  generateKey(url, params = {}) {
    const paramString = Object.keys(params).sort().map((key) => `${key}=${params[key]}`).join("&");
    return `${url}${paramString ? "?" + paramString : ""}`;
  }
  // Set cache entry
  set(key, data, options = {}) {
    const entry = {
      data,
      timestamp: Date.now(),
      size: this.calculateSize(data),
      maxAge: options.maxAge || this.options.maxAge,
      tags: options.tags || []
    };
    this.cache.set(key, entry);
    this.enforceMaxSize();
    this.saveToStorage();
    return entry;
  }
  // Get cache entry
  get(key) {
    const entry = this.cache.get(key);
    if (!entry) return null;
    if (Date.now() - entry.timestamp > entry.maxAge) {
      this.cache.delete(key);
      this.saveToStorage();
      return null;
    }
    entry.lastAccess = Date.now();
    return entry.data;
  }
  // Check if key exists and is valid
  has(key) {
    return this.get(key) !== null;
  }
  // Delete cache entry
  delete(key) {
    const deleted = this.cache.delete(key);
    if (deleted) {
      this.saveToStorage();
    }
    return deleted;
  }
  // Clear cache by tags
  clearByTags(tags) {
    const keysToDelete = [];
    this.cache.forEach((entry, key) => {
      if (entry.tags.some((tag) => tags.includes(tag))) {
        keysToDelete.push(key);
      }
    });
    keysToDelete.forEach((key) => this.cache.delete(key));
    this.saveToStorage();
    return keysToDelete.length;
  }
  // Clear all cache
  clear() {
    this.cache.clear();
    this.saveToStorage();
  }
  // Get cache statistics
  getStats() {
    let totalSize = 0;
    let expiredCount = 0;
    const now = Date.now();
    this.cache.forEach((entry) => {
      totalSize += entry.size;
      if (now - entry.timestamp > entry.maxAge) {
        expiredCount++;
      }
    });
    return {
      entries: this.cache.size,
      totalSize: NumberUtils.formatBytes(totalSize),
      expiredCount,
      hitRate: this.hitRate || 0
    };
  }
  // Calculate data size (approximate)
  calculateSize(data) {
    return new Blob([JSON.stringify(data)]).size;
  }
  // Enforce maximum cache size (LRU eviction)
  enforceMaxSize() {
    const maxSizeBytes = this.options.maxSize * 1024 * 1024;
    let currentSize = 0;
    this.cache.forEach((entry) => {
      currentSize += entry.size;
    });
    if (currentSize <= maxSizeBytes) return;
    const entries = Array.from(this.cache.entries()).sort(
      (a, b) => (a[1].lastAccess || a[1].timestamp) - (b[1].lastAccess || b[1].timestamp)
    );
    for (const [key, entry] of entries) {
      if (currentSize <= maxSizeBytes) break;
      this.cache.delete(key);
      currentSize -= entry.size;
    }
  }
  // Cleanup expired entries
  cleanup() {
    const now = Date.now();
    const keysToDelete = [];
    this.cache.forEach((entry, key) => {
      if (now - entry.timestamp > entry.maxAge) {
        keysToDelete.push(key);
      }
    });
    keysToDelete.forEach((key) => this.cache.delete(key));
    if (keysToDelete.length > 0) {
      this.saveToStorage();
    }
    return keysToDelete.length;
  }
  // Start automatic cleanup timer
  startCleanupTimer() {
    this.cleanupTimer = setInterval(
      () => {
        this.cleanup();
      },
      5 * 60 * 1e3
    );
  }
  // Save cache to localStorage
  saveToStorage() {
    const cacheData = Array.from(this.cache.entries());
    const compressed = this.options.compression ? this.compress(JSON.stringify(cacheData)) : JSON.stringify(cacheData);
    localStorage.setItem(this.options.storageKey, compressed);
  }
  // Load cache from localStorage
  loadFromStorage() {
    const stored = localStorage.getItem(this.options.storageKey);
    if (!stored) return;
    const decompressed = this.options.compression ? this.decompress(stored) : stored;
    const cacheData = JSON.parse(decompressed);
    this.cache = new Map(cacheData);
    this.cleanup();
  }
  // Simple compression (base64 encoding)
  compress(data) {
    return btoa(unescape(encodeURIComponent(data)));
  }
  // Simple decompression
  decompress(data) {
    return decodeURIComponent(escape(atob(data)));
  }
  // Destroy cache manager
  destroy() {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer);
    }
    this.saveToStorage();
  }
}
class HttpCache extends CacheManager {
  static {
    __name(this, "HttpCache");
  }
  static {
    __name2(this, "HttpCache");
  }
  static {
    __name22(this, "HttpCache");
  }
  static {
    __name222(this, "HttpCache");
  }
  static {
    __name2222(this, "HttpCache");
  }
  static {
    __name22222(this, "HttpCache");
  }
  static {
    __name222222(this, "HttpCache");
  }
  constructor(options = {}) {
    super(options);
    this.requests = 0;
    this.hits = 0;
  }
  // Cached fetch
  async fetch(url, options = {}) {
    this.requests++;
    const cacheKey = this.generateKey(url, options.params);
    const cached = this.get(cacheKey);
    if (cached && !options.force) {
      this.hits++;
      this.hitRate = this.hits / this.requests * 100;
      return cached;
    }
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          "Cache-Control": "no-cache",
          ...options.headers
        }
      });
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      const data = await response.json();
      this.set(cacheKey, data, {
        maxAge: options.maxAge,
        tags: options.tags
      });
      return data;
    } catch (error) {
      const staleData = this.cache.get(cacheKey);
      if (staleData && options.staleWhileRevalidate) {
        return staleData.data;
      }
      throw error;
    }
  }
  // Prefetch data
  async prefetch(urls, options = {}) {
    const promises = urls.map(
      (url) => this.fetch(url, { ...options, priority: "low" }).catch(
        (_error) => (
          // Log removido para evitar dependência circular com DebugManager
          null
        )
      )
    );
    return Promise.allSettled(promises);
  }
}
class ImageOptimizer {
  static {
    __name(this, "ImageOptimizer");
  }
  static {
    __name2(this, "ImageOptimizer");
  }
  static {
    __name22(this, "ImageOptimizer");
  }
  static {
    __name222(this, "ImageOptimizer");
  }
  static {
    __name2222(this, "ImageOptimizer");
  }
  static {
    __name22222(this, "ImageOptimizer");
  }
  static {
    __name222222(this, "ImageOptimizer");
  }
  constructor(options = {}) {
    this.options = {
      quality: 0.8,
      maxWidth: 1920,
      maxHeight: 1080,
      format: "webp",
      fallbackFormat: "jpeg",
      ...options
    };
  }
  // Optimize image
  async optimizeImage(file) {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const img = new Image();
      img.onload = () => {
        const { width, height } = this.calculateDimensions(img.width, img.height);
        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob((blob) => resolve(blob), `image/${this.options.format}`, this.options.quality);
      };
      img.onerror = reject;
      img.src = URL.createObjectURL(file);
    });
  }
  calculateDimensions(originalWidth, originalHeight) {
    const { maxWidth, maxHeight } = this.options;
    let width = originalWidth;
    let height = originalHeight;
    if (width > maxWidth) {
      height = height * maxWidth / width;
      width = maxWidth;
    }
    if (height > maxHeight) {
      width = width * maxHeight / height;
      height = maxHeight;
    }
    return { width: Math.round(width), height: Math.round(height) };
  }
  // Generate responsive image srcset
  generateSrcSet(baseUrl, sizes = [320, 640, 1024, 1920]) {
    return sizes.map((size) => `${baseUrl}?w=${size} ${size}w`).join(", ");
  }
}
class PerformanceMonitor extends EventEmitter {
  static {
    __name(this, "PerformanceMonitor");
  }
  static {
    __name2(this, "PerformanceMonitor");
  }
  static {
    __name22(this, "PerformanceMonitor");
  }
  static {
    __name222(this, "PerformanceMonitor");
  }
  static {
    __name2222(this, "PerformanceMonitor");
  }
  static {
    __name22222(this, "PerformanceMonitor");
  }
  static {
    __name222222(this, "PerformanceMonitor");
  }
  constructor() {
    super();
    this.metrics = {
      memory: [],
      timing: [],
      fps: [],
      network: []
    };
    this.isMonitoring = false;
    this.startTime = performance.now();
  }
  start() {
    if (this.isMonitoring) return;
    this.isMonitoring = true;
    this.monitorMemory();
    this.monitorFPS();
    this.monitorCPU();
    this.monitorNetwork();
  }
  stop() {
    this.isMonitoring = false;
    if (this.memoryTimer) clearInterval(this.memoryTimer);
    if (this.cpuTimer) clearInterval(this.cpuTimer);
    if (this.fpsTimer) clearInterval(this.fpsTimer);
  }
  // Monitor memory usage
  monitorMemory() {
    if (!performance.memory) return;
    this.memoryTimer = setInterval(() => {
      if (!this.isMonitoring) return;
      const memory = {
        used: performance.memory.usedJSHeapSize,
        total: performance.memory.totalJSHeapSize,
        limit: performance.memory.jsHeapSizeLimit,
        timestamp: performance.now()
      };
      this.metrics.memory.push(memory);
      const memoryUsagePercent = memory.used / memory.total * 100;
      this.emit("memoryUpdate", memoryUsagePercent);
      if (this.metrics.memory.length > 100) {
        this.metrics.memory.shift();
      }
    }, 1e3);
  }
  // Monitor CPU usage (simulated based on performance)
  monitorCPU() {
    this.cpuTimer = setInterval(() => {
      if (!this.isMonitoring) return;
      const recentFPS = this.metrics.fps.slice(-5);
      const avgFPS = recentFPS.length > 0 ? recentFPS.reduce((sum, f) => sum + f.fps, 0) / recentFPS.length : 60;
      const cpuUsage = Math.max(0, Math.min(100, 100 - avgFPS / 60 * 100 + Math.random() * 10));
      this.emit("cpuUpdate", cpuUsage);
    }, 2e3);
  }
  // Monitor FPS
  monitorFPS() {
    let lastTime = performance.now();
    let frames = 0;
    const measureFPS = /* @__PURE__ */ __name222222(() => {
      if (!this.isMonitoring) return;
      frames++;
      const currentTime = performance.now();
      if (currentTime - lastTime >= 1e3) {
        const fps = Math.round(frames * 1e3 / (currentTime - lastTime));
        this.metrics.fps.push({
          fps,
          timestamp: currentTime
        });
        frames = 0;
        lastTime = currentTime;
        if (this.metrics.fps.length > 60) {
          this.metrics.fps.shift();
        }
      }
      requestAnimationFrame(measureFPS);
    }, "measureFPS");
    requestAnimationFrame(measureFPS);
  }
  // Monitor network requests
  monitorNetwork() {
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      const startTime = performance.now();
      try {
        const response = await originalFetch(...args);
        const endTime = performance.now();
        this.metrics.network.push({
          url: args[0],
          duration: endTime - startTime,
          status: response.status,
          size: response.headers.get("content-length"),
          timestamp: endTime
        });
        if (this.metrics.network.length > 50) {
          this.metrics.network.shift();
        }
        return response;
      } catch (error) {
        const endTime = performance.now();
        this.metrics.network.push({
          url: args[0],
          duration: endTime - startTime,
          error: error.message,
          timestamp: endTime
        });
        throw error;
      }
    };
  }
  // Get performance report
  getReport() {
    const memory = this.metrics.memory;
    const fps = this.metrics.fps;
    const network = this.metrics.network;
    return {
      memory: {
        current: memory[memory.length - 1],
        average: memory.reduce((sum, m) => sum + m.used, 0) / memory.length,
        peak: Math.max(...memory.map((m) => m.used))
      },
      fps: {
        current: fps[fps.length - 1]?.fps || 0,
        average: fps.reduce((sum, f) => sum + f.fps, 0) / fps.length || 0,
        min: Math.min(...fps.map((f) => f.fps)) || 0
      },
      network: {
        requests: network.length,
        averageTime: network.reduce((sum, n) => sum + n.duration, 0) / network.length || 0,
        errors: network.filter((n) => n.error).length
      },
      uptime: performance.now() - this.startTime
    };
  }
}
if (typeof window !== "undefined") {
  window.Performance = {
    VirtualScroller,
    LazyLoader,
    CacheManager,
    HttpCache,
    ImageOptimizer,
    PerformanceMonitor
  };
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => LazyLoader.init());
  } else {
    LazyLoader.init();
  }
}
export {
  CacheManager,
  HttpCache,
  ImageOptimizer,
  LazyLoader,
  PerformanceMonitor,
  VirtualScroller
};
