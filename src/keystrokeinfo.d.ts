
/**
 * Information about a keystroke.
 */
export interface KeystrokeInfo {
	/**
	 * The [key code](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/keyCode).
	 */
	keyCode: number

	/**
	 * Whether the <kbd>Alt</kbd> modifier was pressed.
	 */
	altKey: boolean;

	/**
	 * Whether the <kbd>Ctrl</kbd> or <kbd>Cmd</kbd> modifier was pressed.
	 */
	ctrlKey: boolean;

	/**
	 * Whether the <kbd>Shift</kbd> modifier was pressed.
	 */
	shiftKey: boolean;
}
