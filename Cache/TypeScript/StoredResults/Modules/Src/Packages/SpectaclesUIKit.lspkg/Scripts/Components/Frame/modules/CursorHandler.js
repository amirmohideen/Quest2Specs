"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const InteractorCursor_1 = require("SpectaclesInteractionKit.lspkg/Components/Interaction/InteractorCursor/InteractorCursor");
class CursorHandler {
    constructor(options) {
        this.options = options;
        /**
         *
         * Manages custom cursor states
         * used for indicating contextual functionality
         * swaps textures
         * animates effects
         *
         */
        /**
         * mode is used to select the current active texture
         * updated in Frame update loop to match the FrameInputController state
         */
        this.mode = InteractorCursor_1.CursorMode.Auto;
        this.lastMode = this.mode;
        this.frame = this.options.frame;
        this.interactorCursor = null;
        /**
         * update
         * @param inputState
         * @param frameState
         *
         * method called in main loop
         * watches for changed CursorModes to swap textures
         * updates position and triggers animations
         */
        this.update = (_inputState, _frameState) => {
            if (!this.interactorCursor) {
                return;
            }
            // handle switching cursors
            if (this.mode !== this.lastMode) {
                this.interactorCursor.cursorMode = this.mode;
                this.lastMode = this.mode;
            }
        };
        this.interactorCursor = options.interactorCursor ?? null;
    }
    /**
     * sets current position of cursor
     * ignored if cursor is in lockMode
     */
    set position(pos) {
        if (pos === undefined) {
            return;
        }
        this.interactorCursor.cursorPosition = pos;
    }
    /**
     * Sets the InteractorCursor for the handler to control.
     * @param cursor
     */
    setCursor(cursor) {
        if (cursor === undefined) {
            return;
        }
        if (this.interactorCursor !== cursor && this.interactorCursor) {
            this.resetCursor();
        }
        this.interactorCursor = cursor;
    }
    /**
     * Reset the position override & mode of the interactor cursor.
     */
    resetCursor() {
        if (this.interactorCursor) {
            this.interactorCursor.cursorMode = InteractorCursor_1.CursorMode.Auto;
        }
        this.lastMode = InteractorCursor_1.CursorMode.Auto;
        this.mode = InteractorCursor_1.CursorMode.Auto;
    }
}
exports.default = CursorHandler;
//# sourceMappingURL=CursorHandler.js.map