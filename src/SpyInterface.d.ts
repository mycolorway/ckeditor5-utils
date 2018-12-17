export interface Spy {
	(): void;
	called: boolean;
}
