export interface Event {
  data: any;
}

export interface Listener {
  (event: Event): void;
}

export interface Source {
  addEventListener(name: string, listener: Listener): void;
  removeEventListener(name: string, listener: Listener): void;
  close(): void;
}
