"use strict";
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.frameCache = exports.FrameCache = void 0;
const Singleton_1 = require("../Decorators/Singleton");
const LensConfig_1 = require("./LensConfig");
const NativeLogger_1 = require("./NativeLogger");
const UpdateDispatcher_1 = require("./UpdateDispatcher");
const TAG = "FrameCache";
const log = new NativeLogger_1.default(TAG);
/**
 * FrameCache provides automatic per-frame caching for expensive function calls.
 *
 * This utility allows you to wrap expensive methods so that:
 * 1. The first call in a frame executes the original function and caches the result
 * 2. Subsequent calls in the same frame return the cached result
 * 3. The cache is automatically cleared at the start of each new frame
 *
 * Usage:
 * ```typescript
 * // Get the singleton instance
 * private frameCache = FrameCache.getInstance()
 *
 * // Wrap an expensive method
 * private getCachedHandOrientation = this.frameCache.wrap(
 *   'getHandOrientation',
 *   () => this.computeHandOrientation()
 * )
 *
 * // Use the cached version
 * const orientation = this.getCachedHandOrientation()
 *
 * Results in ~0.03ms overhead compared to a simple manual caching solution.
 * ```
 */
let FrameCache = (() => {
    let _classDecorators = [Singleton_1.Singleton];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var FrameCache = _classThis = class {
        constructor() {
            this.cacheMap = new Map();
            this.isInitialized = false;
            this.instanceName = "FrameCache";
            this.initializeGlobalFlushIfNeeded();
        }
        /**
         * Wrap a function with per-frame caching.
         *
         * @param key Unique identifier for this cached function
         * @param fn The expensive function to cache
         * @returns A cached version of the function
         */
        wrap(key, fn) {
            if (this.cacheMap.has(key)) {
                log.w(`Cache key '${key}' already exists in ${this.instanceName}. Returning existing cached function.`);
                return this.cacheMap.get(key).getCallableFunction();
            }
            const cachedFn = new CachedFunctionImpl(key, fn);
            this.cacheMap.set(key, cachedFn);
            log.v(`Registered cached function '${key}' in ${this.instanceName}`);
            return cachedFn.getCallableFunction();
        }
        /**
         * Wrap a method with per-frame caching, preserving 'this' context.
         *
         * @param key Unique identifier for this cached function
         * @param context The object context ('this')
         * @param fn The expensive method to cache
         * @returns A cached version of the method
         */
        wrapMethod(key, context, fn) {
            const cachedFn = this.wrap(key, () => fn.call(context));
            return () => cachedFn();
        }
        /**
         * Clear all caches managed by this instance
         */
        flushAll() {
            let flushedCount = 0;
            for (const [, cachedFnImpl] of this.cacheMap) {
                if (cachedFnImpl.isCached()) {
                    cachedFnImpl.clearCache();
                    flushedCount++;
                }
            }
            if (flushedCount > 0) {
                log.v(`Flushed ${flushedCount} cached functions in ${this.instanceName}`);
            }
        }
        /**
         * Remove a cached function
         */
        remove(key) {
            const removed = this.cacheMap.delete(key);
            if (removed) {
                log.v(`Removed cached function '${key}' from ${this.instanceName}`);
            }
            return removed;
        }
        /**
         * Initialize global cache flushing if not already done.
         * Only called once due to singleton pattern.
         */
        initializeGlobalFlushIfNeeded() {
            if (this.isInitialized) {
                return;
            }
            this.isInitialized = true;
            // Register a high-priority update event to flush all caches at the start of each frame
            LensConfig_1.LensConfig.getInstance().updateDispatcher.createUpdateEvent("FrameCache_GlobalFlush", () => this.flushAll(), UpdateDispatcher_1.UpdateDispatcherPriority.FlushCache);
            log.i(`Initialized global cache flushing for ${this.instanceName}`);
        }
    };
    __setFunctionName(_classThis, "FrameCache");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        FrameCache = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return FrameCache = _classThis;
})();
exports.FrameCache = FrameCache;
/**
 * Implementation of a cached function
 */
class CachedFunctionImpl {
    constructor(key, originalFn) {
        this.key = key;
        this.originalFn = originalFn;
        this.cachedResult = undefined;
        this.hasCachedResult = false;
    }
    call() {
        if (this.hasCachedResult) {
            return this.cachedResult;
        }
        // Execute the original function and cache the result
        this.cachedResult = this.originalFn();
        this.hasCachedResult = true;
        log.v(`Computed and cached result for '${this.key}'`);
        return this.cachedResult;
    }
    clearCache() {
        if (this.hasCachedResult) {
            this.cachedResult = undefined;
            this.hasCachedResult = false;
            log.v(`Cleared cache for '${this.key}'`);
        }
    }
    isCached() {
        return this.hasCachedResult;
    }
    getCallableFunction() {
        const callableFn = (() => this.call());
        callableFn.clearCache = () => this.clearCache();
        callableFn.isCached = () => this.isCached();
        return callableFn;
    }
}
// Global instance for convenience
exports.frameCache = FrameCache.getInstance();
//# sourceMappingURL=FrameCache.js.map